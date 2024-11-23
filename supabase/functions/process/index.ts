// deno-lint-ignore ban-ts-comment
//@ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as base64 from "jsr:@std/encoding/base64";
import * as aisdk from "npm:@ai-sdk/openai";
import * as ai from "npm:ai";
import * as z from "npm:zod";
import { createClient } from "jsr:@supabase/supabase-js@2";
import "jsr:@std/dotenv/load";

const categories = [
  "Food & Dining",
  "Groceries",
  "Entertainment",
  "Subscription",
  "Education",
  "Utilities",
  "Miscellaneous",
  "Home Maintenance",
  "Mobile & Communication",
  "Sports & Fitness",
  "Credit Card Payment",
  "Transportation",
  "Healthcare",
  "Electronics",
  "Housing",
  "Personal Care",
  "Clothing",
  "Savings & Investments",
  "Gifts & Donations",
  "Travel",
] as const;

export const currencies = ["PKR", "USD", "EUR", "GBP", "AED"] as const;
export const methods = [
  "cash",
  "credit-card",
  "debit-card",
  "bank-transfer",
] as const;

export const ExpenseSchema = z.object({
  userid: z.string(),
  id: z.string(),
  type: z.enum(["expense", "income"]),
  date: z
    .string()
    .describe(
      "the date on which the expense was made. This should be in the ISO yyyy-mm-dd format so that it can be used for sorting."
    ),
  amount: z.number(),
  currency: z.enum(currencies).default("PKR"),
  category: z.enum(categories),
  title: z
    .string()
    .optional()
    .describe("Should be a short and concise description of the expense"),
  method: z.enum(methods),
  tags: z.array(z.string()),
  notes: z.string().optional().describe("add any context or extra notes here"),
  sourcetext: z.string(),
  attachment: z.string().optional(),
  processingstatus: z.enum(["processing", "completed", "failed"]),
  createdat: z.date(),
  updatedat: z.date(),
});

export const LLMExpenseObjectSchema = ExpenseSchema.pick({
  date: true,
  type: true,
  amount: true,
  currency: true,
  category: true,
  title: true,
  method: true,
  tags: true,
  notes: true,
});

type LLMExpenseObject = z.infer<typeof LLMExpenseObjectSchema>;

async function generateExpenseObject(expenseString: string) {
  const { object } = await ai.generateObject({
    model: aisdk.openai("gpt-4o-mini"),
    schema: LLMExpenseObjectSchema,
    prompt: `You are given the description of a transaction in raw text form.
        Decide whether this represents an expense or an income.
        After that, you have to convert it into the given schema object.
        The date today is ${
          new Date().toISOString().split("T")[0]
        }. Use this date as a reference for when the raw text
        contains terms like 'yesterday' and so on to figure out the correct date.
        If there is no indication of a date, the date is today.
        This is the raw text: ${expenseString}`,
  });

  return object;
}

export async function processImage({
  imageBase64Data,
  metaText,
}: {
  imageBase64Data: string;
  metaText?: string;
}) {
  const { object } = await ai.generateObject({
    schema: LLMExpenseObjectSchema,
    model: aisdk.openai("gpt-4o-2024-08-06"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Attached is either a screenshot of a successful transaction of an expense or income, or a picture of a receipt.
            First decide whether this is an income or expense.
            Then, extract the necessary information from it to complete the required schema.
            The date today is ${
              new Date().toISOString().split("T")[0]
            }. If there is no indication of the date in the image, set date to today.
            ${
              metaText
                ? ` The following supporting meta information is also provided: ${metaText}`
                : ""
            }`,
          },
          {
            type: "image",
            image: imageBase64Data,
          },
        ],
      },
    ],
  });

  return object;
}

Deno.serve(async (req) => {
  const { record } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data, error } = await supabase
    .from("transactions")
    .select()
    .eq("id", record.id)
    .single();

  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  if (!data || (!data?.sourcetext && !data.attachment))
    return new Response(
      JSON.stringify({
        message: "something went wrong while fetching record",
        error: error?.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );

  if (data.processingstatus !== "processing") {
    return new Response(
      JSON.stringify({
        message: "record is either already processed or failed processing!",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
  try {
    let llmExpenseObject: LLMExpenseObject;
    if (!data.attachment) {
      llmExpenseObject = await generateExpenseObject(data.sourcetext);
    } else {
      // from now on attachment will be a key
      // we gotta download the blob and convert it to base64
      const key = data.attachment;
      const userId = data.userid;
      const imagePath = `${userId}/${key}`;
      const { data: blob, error } = await supabase.storage
        .from("images")
        .download(imagePath);

      if (!blob || error) {
        console.log(error);
        throw new Error("failed to download image");
      }

      const arrayBuffer = await blob.arrayBuffer();
      const base64Data = base64.encodeBase64(arrayBuffer);

      llmExpenseObject = await processImage({
        imageBase64Data: base64Data,
        metaText: data.sourcetext,
      });
    }

    // we save the resulting object in supabase table
    const { error } = await supabase
      .from("transactions")
      .update({
        ...llmExpenseObject,
        processingstatus: "completed",
      })
      .eq("id", record.id);

    if (error) {
      console.log(
        "something went wrong while saving processed data in table",
        error
      );
      return new Response(
        JSON.stringify({
          message: "something went wrong while saving processed data in table",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (_err) {
    console.log(_err);
    return new Response(
      JSON.stringify({
        success: false,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
