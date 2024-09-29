"use client";

import { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import ExpenseModal from "./ExpenseModal";
import { Expense } from "@/app/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  return (
    <div className="my-8">
      <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.expenseId}
            expense={expense}
            onClick={() => setSelectedExpense(expense)}
          />
        ))}
      </div>
      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
