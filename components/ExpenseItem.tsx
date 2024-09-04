import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon } from "lucide-react";

interface Expense {
  id: number;
  title: string;
  date: string;
  amount: number;
}

interface ExpenseItemProps {
  expense: Expense;
  onClick: () => void;
}

export default function ExpenseItem({ expense, onClick }: ExpenseItemProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{expense.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {expense.date}
          </p>
        </div>
        <p className="text-right font-bold flex items-center">
          <DollarSignIcon className="h-5 w-5 mr-1" />
          {expense.amount.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}
