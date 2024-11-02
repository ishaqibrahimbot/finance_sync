import { Database } from "@/database.types";
import { z } from "zod";

export const categories = [
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
export const types = ["income", "expense"] as const;

export const ExpenseSchema = z.object({
  userid: z.string(),
  id: z.number(),
  type: z.enum(types),
  date: z
    .string()
    .describe(
      "the date on which the expense was made. This should be in the ISO yyyy-mm-dd format so that it can be used for sorting."
    ),
  amount: z.string().regex(new RegExp(/^[+-]?([0-9]*[.])?[0-9]+$/), {
    message: "Must be an amount",
  }),
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

export type ExpenseType = z.infer<typeof ExpenseSchema>;

export type Expense = Database["public"]["Tables"]["transactions"]["Row"];

export const ExpensePostSchema = z.object({
  userId: z.string(),
  text: z.string(),
  image: z
    .object({
      filename: z.string(),
      contentType: z.string(),
      base64Data: z.string(),
    })
    .optional(),
});

export type ExpensePostBody = z.infer<typeof ExpensePostSchema>;

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

export type LLMExpenseObject = z.infer<typeof LLMExpenseObjectSchema>;
