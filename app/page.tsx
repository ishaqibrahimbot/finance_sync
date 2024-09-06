import ExpenseInput from "@/components/ExpenseInput";
import ExpenseList from "@/components/ExpenseList";
import { getExpenses } from "./lib/actions";

export const maxDuration = 60;

export default async function Home() {
  const expenses = await getExpenses();

  return (
    <main className="container mx-auto p-4 pb-32">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">
        Expense Tracker
      </h1>
      <ExpenseList expenses={expenses} />
      <ExpenseInput />
    </main>
  );
}
