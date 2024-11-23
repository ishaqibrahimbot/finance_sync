import { type Expense } from "@/app/lib/types";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { useImageUrl } from "@/hooks/useImageUrl";

export default function Expense({
  expense,
  onClick,
}: {
  expense: Expense;
  onClick?: () => void;
}) {
  if (expense.processingstatus === "processing") {
    return <ExpenseProcessing expense={expense} />;
  }

  return (
    <Card
      className="cursor-pointer hover:bg-primary/10 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold">{expense.title}</h3>
          <p className="text-sm mt-1 text-muted-foreground flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {expense.date?.split("T")[0]}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-right font-bold">{expense.amount}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpenseProcessing({ expense }: { expense: Expense }) {
  const imageUrl = useImageUrl({
    currentUrl: expense.attachment,
    expenseId: expense.id,
    userId: expense.userid,
  });
  return (
    <Card className="bg-primary/5">
      <CardContent className="p-4 space-y-2">
        <div className="flex flex-row items-center space-x-2">
          {expense.processingstatus === "failed" ? (
            <>
              <CircleAlertIcon className="h-5 w-5 text-red-800" />
              <p className="text-sm text-muted-foreground">{`Failed`}</p>
            </>
          ) : (
            <>
              <LoaderCircleIcon className="h-5 w-5 animate-spin" />
              <p className="text-sm text-muted-foreground">{`Processing...`}</p>
            </>
          )}
        </div>

        {expense.sourcetext && (
          <p className="text-sm line-clamp-1">{`Text: ${expense.sourcetext}`}</p>
        )}
        <div className="flex flex-row space-x-4 items-center">
          {imageUrl && (
            <p className="text-sm">
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm underline text-gray-800"
                href={imageUrl}
              >
                View attachment
              </a>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
