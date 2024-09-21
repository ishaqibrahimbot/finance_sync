"use client";
import { Expense } from "@/app/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  CircleAlertIcon,
  DollarSignIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { revalidate } from "@/app/lib/actions";

interface ExpenseItemProps {
  expense: Expense;
  onClick: () => void;
}

export default function ExpenseItem({ expense, onClick }: ExpenseItemProps) {
  const intervalIdRef = useRef<any>();

  const revalidateExpenses = async () => {
    await revalidate("/");
  };

  useEffect(() => {
    if (expense.processingStatus === "processing") {
      const interval = expense.attachment ? 5000 : 2000;
      const intervalId = setInterval(() => {
        revalidateExpenses();
      }, interval);

      intervalIdRef.current = intervalId;
    } else {
      clearInterval(intervalIdRef.current);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [expense.processingStatus, expense.attachment]);

  if (expense.processingStatus !== "completed") {
    return (
      <Card className="bg-muted">
        <CardContent className="p-4 space-y-2">
          {expense.processingStatus === "processing" ? (
            <div className="flex flex-row items-center space-x-2">
              <LoaderCircleIcon className="h-5 w-5 animate-spin" />
              <p className="text-sm text-muted-foreground">{`Processing...`}</p>
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-2">
              <CircleAlertIcon className="h-4 w-4 text-red-600" />
              <p className="text-sm text-muted-foreground">{`Failed to process this source`}</p>
            </div>
          )}
          {expense.sourceText && (
            <p className="text-sm line-clamp-1">{`Text: ${expense.sourceText}`}</p>
          )}
          {expense.attachment && (
            <p className="text-sm">
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm underline text-gray-800"
                href={expense.attachment}
              >
                View attachment
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold">{expense.title}</h3>
          <p className="text-sm mt-1 text-muted-foreground flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {expense.date}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-right font-bold">{expense.amount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
