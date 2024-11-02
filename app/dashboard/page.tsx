import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExpenseList from "@/components/ExpenseList";

export const maxDuration = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log("ERRRO: ", error);
    redirect("/sign-in");
  }

  console.log("user", data.user.email);

  const expenses = await supabase
    .from("transactions")
    .select("*")
    .order("date", {
      ascending: false,
    })
    .limit(15);

  if (!expenses.data) return null;

  return (
    <>
      <div className="container mx-auto p-4 pb-32">
        <ExpenseList serverExpenses={expenses.data} />
      </div>
    </>
  );
}
