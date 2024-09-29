"use client";

import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Expense } from "../app/lib/types";
import { generateExpense } from "@/app/lib/actions";
import ExpenseItem from "./ExpenseItem";
import ExpenseModalDemo from "./ExpenseModalDemo";

export const Demo = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>();
  const [value, setValue] = useState(
    "Bought a lotus ice cream from Sweet Creme for 200 yesterday..."
  );

  return (
    <ScrollArea className="custom-comp relative mx-auto max-w-3xl h-[350px] space-y-4 w-full rounded-md border p-4 pb-24">
      <ul className="space-y-2">
        {expenses.map((expense) => {
          return (
            <ExpenseItem
              key={expense.expenseId}
              expense={expense}
              onClick={() => setSelectedExpense(expense)}
            />
          );
        })}
      </ul>
      {selectedExpense && (
        <ExpenseModalDemo
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
      <div className="px-4 pb-4 space-x-2 absolute bottom-0 left-0 right-0 flex flex-row items-center justify-between">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={!value}
          onClick={async () => {
            setLoading(true);
            const object = await generateExpense(value);
            setExpenses((prevValue) => [
              ...prevValue,
              {
                ...object,
                userId: "sandbox",
                expenseId: Date.now().toString(),
                createdAt: Date.now(),
                sourceText: value,
                processingStatus: "completed",
              },
            ]);
            setValue("");
            setLoading(false);
          }}
          className="min-w-[100px]"
        >
          {loading ? "wait.." : "Add"}
        </Button>
      </div>
    </ScrollArea>
  );
};
