import { Expense } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface ExpenseModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseModalDemo({
  expense,
  onClose,
}: ExpenseModalProps) {
  const [editing, setEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader onClose={onClose}>
          <CardTitle className="text-2xl">{expense.title}</CardTitle>
          <p className="text-gray-600">{expense.category}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="flex items-center text-muted-foreground">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {expense.date}
          </p>
          <p className="flex items-center text-xl font-bold">
            {expense.currency === "USD" && (
              <DollarSignIcon className="h-6 w-6 mr-2" />
            )}
            {expense.amount}
          </p>
          {expense.attachment && (
            <a
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm underline text-gray-800"
              href={expense.attachment}
            >
              View receipt
            </a>
          )}
          <p className="text-gray-600 text-sm">
            Paid via {expense.paymentMethod}
          </p>
          {expense.notes && (
            <p className="text-gray-600 text-sm">Notes: {expense.notes}</p>
          )}
          <ul className="space-x-1 flex flex-row items-center">
            {expense.tags.map((tag) => {
              return (
                <li key={tag}>
                  <Badge variant={"default"}>{tag}</Badge>
                </li>
              );
            })}
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-center w-full space-y-4">
          <div className="flex flex-row items-center space-x-4 w-full">
            <Button className="w-full" disabled={loading} variant={"outline"}>
              {editing ? `Cancel Edit` : `Edit`}
            </Button>
            <Button
              loading={loading}
              disabled={editing}
              variant={"outline"}
              className="w-full"
            >
              Delete
            </Button>
          </div>
          {editing && (
            <>
              <Textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe your changes..."
                className="w-full min-h-[80px] resize-none rounded-md"
              />
              <Button loading={loading} variant={"default"} className="w-full">
                Save
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
