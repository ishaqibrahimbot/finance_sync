import { z } from "zod";

export const ExpenseSchema = z.object({
  userId: z.string(),
  expenseId: z.string(),
  date: z
    .string()
    .describe(
      "the date on which the expense was made. This should be in the ISO yyyy-mm-dd format so that it can be used for sorting."
    ),
  amount: z.number(),
  currency: z.enum(["PKR", "USD"]).default("PKR"),
  category: z.string(),
  title: z
    .string()
    .optional()
    .describe("Should be a short and concise description of the expense"),
  paymentMethod: z.enum(["cash", "credit-card", "debit-card", "bank transfer"]),
  tags: z.array(z.string()),
  notes: z.string().optional().describe("add any context or extra notes here"),
  sourceText: z.string(),
  attachment: z.string().optional(),
  processingStatus: z.enum(["processing", "completed", "failed"]),
  createdAt: z.number().describe("timestamp for when this was created"),
});

export type Expense = z.infer<typeof ExpenseSchema>;

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
