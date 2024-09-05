"use client";

import { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import ExpenseModal from "./ExpenseModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Expense } from "@/app/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  pendingExpense?: string | null;
}

export default function ExpenseList({
  expenses,
  pendingExpense,
}: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  return (
    <div className="my-8">
      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {pendingExpense && (
          <Card className="bg-muted">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{`Just hang on, adding "${pendingExpense}"...`}</p>
            </CardContent>
          </Card>
        )}
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
