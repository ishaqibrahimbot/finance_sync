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

interface ExpenseModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{expense.description}</CardTitle>
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
          <p className="text-gray-600 text-sm">
            Paid via {expense.paymentMethod}
          </p>
          <p className="text-gray-600 text-sm">Notes: {expense.notes}</p>
          <ul className="space-x-1 flex flex-row items-center">
            {expense.tags.map((tag) => {
              return (
                <li key={tag}>
                  <Badge variant={"secondary"}>{tag}</Badge>
                </li>
              );
            })}
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
