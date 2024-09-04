import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon } from "lucide-react";

interface Expense {
  id: number;
  title: string;
  date: string;
  amount: number;
}

interface ExpenseModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{expense.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="flex items-center text-muted-foreground">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {expense.date}
          </p>
          <p className="flex items-center text-xl font-bold">
            <DollarSignIcon className="h-6 w-6 mr-2" />
            {expense.amount.toFixed(2)}
          </p>
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
