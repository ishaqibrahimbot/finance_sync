"use server";

import { revalidatePath } from "next/cache";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Expense, ExpensePostBody, LLMExpenseObjectSchema } from "./types";

export async function getExpenses(userId: string) {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/${userId}`
  );
  const expenses: Expense[] = await result.json();
  expenses.sort((a, b) => {
    if (a.date > b.date) return -1;
    else if (a.date < b.date) return 1;
    else {
      if (a.createdAt > b.createdAt) return -1;
      else return 1;
    }
  });
  return expenses;
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

  const payload: ExpensePostBody = {
    userId,
    text: rawText,
  };

  if (image) {
    let arrayBuffer: ArrayBuffer = await image.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    payload.image = {
      filename: image.name,
      contentType: image.type,
      base64Data,
    };
  }

  //   console.log("payload", payload);

  const result = await fetch(`${process.env.API_GATEWAY_ROOT_URL}/expenses`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!result.ok) {
    console.log("oops something went wrong");
    return;
  }

  const newlyAddedExpense = await result.json();
  revalidatePath("/dashboard");
  return newlyAddedExpense as Expense;
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

export async function deleteExpense({
  expenseId,
  userId,
}: {
  expenseId: string;
  userId: string;
}) {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/${userId}/${expenseId}`,
    {
      method: "DELETE",
    }
  );

  if (result.ok) {
    revalidatePath("/dashboard");
  }

  return;
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
