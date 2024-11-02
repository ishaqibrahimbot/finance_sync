"use server";

import { revalidatePath } from "next/cache";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { LLMExpenseObjectSchema } from "./types";
import { createClient } from "@/lib/supabase/server";

export async function getExpenses() {
  const supabase = await createClient();

  const allTransactions = await supabase
    .from("transactions")
    .select("*")
    .order("date", {
      ascending: false,
    })
    .limit(5);

  return allTransactions;
}

export async function revalidate(path: string) {
  await revalidatePath(path);
  return;
}

export async function addExpense({
  formData,
  userId,
}: {
  formData: FormData;
  userId: string;
}) {
  const rawText = formData.get("rawExpenseText") as string;
  const image = formData.get("image") as File;

  console.log("got from form: ", rawText, image);

  if (!rawText && !image) return;

  const supabase = await createClient();

  let imageUrl: string | undefined;

  if (image) {
    const imagePath = `${userId}/${crypto.randomUUID()}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(imagePath, image);

    if (uploadError) throw uploadError;

    const { data } = await supabase.storage
      .from("images")
      .createSignedUrl(imagePath, 3600);

    imageUrl = data?.signedUrl;
  }

  const { data, error } = await supabase.from("transactions").insert({
    sourcetext: rawText,
    processingstatus: "processing",
    attachment: imageUrl,
    userid: userId,
  });

  if (error) {
    console.log("failed to insert record", error);
    return;
  }

  return;
}

export async function updateExpense({
  expenseId,
  prompt,
  userId,
}: {
  expenseId: string;
  prompt: string;
  userId: string;
}) {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/${userId}/${expenseId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        prompt,
      }),
    }
  );

  if (result.ok) {
    revalidatePath("/dashboard");
  }

  return;
}

export async function deleteExpense({ expenseId }: { expenseId: number }) {
  const supabase = await createClient();

  await supabase.from("transactions").delete().eq("id", expenseId);
  revalidatePath("/dashboard");
}

export async function generateExpense(expenseString: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: LLMExpenseObjectSchema,
    prompt: `You are given the description of an expense in raw text form. 
      You have to convert it into the given expense schema object. 
      The date today is ${new Date().toDateString()}. Use this date as a reference for when the raw text
      contains terms like 'yesterday' and so on to figure out the correct date.
      If there is no indication of a date, the date is today.
      This is the raw text: ${expenseString}`,
  });

  return object;
}
