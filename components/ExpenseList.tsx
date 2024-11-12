"use client";
import { useState } from "react";
import { type Expense as ExpenseType } from "@/app/lib/types";
import ExpenseInput from "./ExpenseInput";
import Expense from "./Expense";
import ExpenseModal from "./ExpenseModal";
import { useInsertExpense } from "@/hooks/useInsertExpense";
import { useUpdateExpense } from "@/hooks/useUpdateExpense";
import { useDeleteExpense } from "@/hooks/useDeleteExpense";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChartColumnIcon } from "lucide-react";

interface ExpenseListProps {
  serverExpenses: ExpenseType[];
}

export default function ExpenseList({ serverExpenses }: ExpenseListProps) {
  const [expenses, setExpenses] = useState(serverExpenses);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(
    null
  );
  const path = usePathname();

  useDeleteExpense((payload) => {
    console.log("deleted", payload);
    setExpenses((prevExpenses) => {
      return prevExpenses.filter((expense) => expense.id !== payload.old.id);
    });
  });

  useInsertExpense((payload) => {
    setExpenses((prevExpenses) => [
      payload.new as ExpenseType,
      ...prevExpenses,
    ]);
    console.log("payload", payload);
  });

  useUpdateExpense(
    (payload) => {
      console.log("update payload", payload);
      setExpenses((prevExpenses) => {
        const index = prevExpenses
          .map((expense) => expense.id)
          .indexOf(payload.new.id);
        const newExpenses = [...prevExpenses].toSpliced(
          index,
          1,
          payload.new as ExpenseType
        );
        return newExpenses;
      });
      if (selectedExpense && selectedExpense.id === payload.new.id) {
        setSelectedExpense(payload.new as ExpenseType);
      }
    },
    [selectedExpense]
  );

  return (
    <div>
      <div className="my-8">
        <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
          {expenses.map((expense) => (
            <Expense
              onClick={() => setSelectedExpense(expense)}
              key={expense.id}
              expense={expense}
            />
          ))}
        </div>
        {selectedExpense && (
          <ExpenseModal
            key={selectedExpense.updatedat}
            expense={selectedExpense}
            onClose={() => setSelectedExpense(null)}
          />
        )}
      </div>
      <ExpenseInput />
      <Link
        href="/dashboard/analytics"
        className="fixed bg-primary right-6 rounded-full p-2 bottom-48 transition-all duration-500 active:scale-125"
      >
        <ChartColumnIcon className="w-8 h-8 text-white" />
      </Link>
    </div>
  );
}
