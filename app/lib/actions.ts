"use server";

import { Expense } from "./types";

export async function getExpenses() {
  const result = await fetch(
    "https://ypsdlnde0c.execute-api.ap-south-1.amazonaws.com/prod/expenses"
  );
  const expenses: Expense[] = await result.json();
  expenses.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    else return 1;
  });
  return expenses;
}

export async function addExpense(formData: FormData) {
  const rawText = formData.get("rawExpenseText");

  console.log("adding", rawText);

  const payload = {
    event: {
      type: "message",
      text: rawText,
      user: "U07KDCUA8DA",
    },
  };

  await fetch(
    "https://ypsdlnde0c.execute-api.ap-south-1.amazonaws.com/prod/webhook",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
