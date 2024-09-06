import ExpenseInput from "@/components/ExpenseInput";
import ExpenseList from "@/components/ExpenseList";
import { getExpenses } from "./lib/actions";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const maxDuration = 60;

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-slate-100">
        <Image
          className="-mt-8"
          width={280}
          height={280}
          alt="finance sync logo"
          src="/landing-page-image.png"
        />
        <Card className="w-[350px]">
          <CardHeader className="space-y-2">
            <CardTitle>Welcome to Yet Another Finance App</CardTitle>
            <CardDescription>Sign in or sign up to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const expenses = await getExpenses(userId);

  return (
    <div className="container mx-auto p-4 pb-32">
      <ExpenseList expenses={expenses} />
      <ExpenseInput />
    </div>
  );
}
