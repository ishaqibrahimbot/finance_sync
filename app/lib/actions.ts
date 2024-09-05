"use server";

import { Expense } from "./types";

export async function getExpenses() {
  const result = await fetch(`${process.env.API_GATEWAY_ROOT_URL}/expenses`);
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

  await fetch(`${process.env.API_GATEWAY_ROOT_URL}/webhook`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function uploadImage(formData: FormData) {
  const image = formData.get("image") as File;
  console.log("image", image);

  const arrayBuffer = await image.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const payload = {
    event: {
      type: "image_upload",
      filename: image.name,
      contentType: image.type,
      base64Data,
      user: "U07KDCUA8DA",
    },
  };

  const result = await fetch(`${process.env.API_GATEWAY_ROOT_URL}/webhook`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("result.ok", result.ok);

  return;
}
