"use server";

import { revalidatePath } from "next/cache";
import { Expense, ExpensePostBody, ExpensePostSchema } from "./types";

export async function getExpenses() {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/U07KDCUA8DA`
  );
  const expenses: Expense[] = await result.json();
  expenses.sort((a, b) => {
    if (a.date > b.date) return -1;
    else return 1;
  });
  return expenses;
}

export async function addExpense(formData: FormData) {
  const rawText = formData.get("rawExpenseText") as string;
  const image = formData.get("image") as File;

  console.log("got from form: ", rawText, image);

  if (!rawText && !image) return;

  const payload: ExpensePostBody = {
    userId: "U07KDCUA8DA",
    text: rawText,
  };

  if (image) {
    const arrayBuffer = await image.arrayBuffer();
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
  revalidatePath("/");
  return newlyAddedExpense as Expense;
}

export async function updateExpense(expenseId: string, prompt: string) {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/U07KDCUA8DA/${expenseId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        prompt,
      }),
    }
  );

  if (result.ok) {
    revalidatePath("/");
  }

  return;
}

export async function deleteExpense(expenseId: string) {
  const result = await fetch(
    `${process.env.API_GATEWAY_ROOT_URL}/expenses/U07KDCUA8DA/${expenseId}`,
    {
      method: "DELETE",
    }
  );

  if (result.ok) {
    revalidatePath("/");
  }

  return;
}
