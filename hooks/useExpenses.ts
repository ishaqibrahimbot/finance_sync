import { useState, useCallback } from "react";

interface Expense {
  id: number;
  title: string;
  date: string;
  amount: number;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pendingExpense, setPendingExpense] = useState<string | null>(null);

  const addExpense = useCallback((title: string) => {
    setPendingExpense(title);

    // Simulate an asynchronous API call
    setTimeout(() => {
      const newExpense: Expense = {
        id: Date.now(),
        title,
        date: new Date().toISOString().split("T")[0],
        amount: Math.floor(Math.random() * 10000) / 100,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      setPendingExpense(null);
    }, 2000); // Simulate a 2-second delay
  }, []);

  return { expenses, addExpense, pendingExpense };
}
