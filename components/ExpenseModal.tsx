import {
  categories,
  currencies,
  Expense,
  ExpenseType,
  LLMExpenseObject,
  LLMExpenseObjectSchema,
  methods,
} from "@/app/lib/types";
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
import { deleteExpense } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import { safeExecuteAction } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface ExpenseModalProps {
  expense: Expense;
  onClose: () => void;
}

function getMetadata(signedUrl: string) {
  const urlObject = new URL(signedUrl);
  const expiryParam = urlObject.searchParams.get("token");
  if (!expiryParam) return null;

  // Extract expiry timestamp from JWT token (simplified)
  const token = expiryParam.split(".")[1];
  const payload = JSON.parse(atob(token));
  return payload;
}

export default function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  const [editing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    expense.attachment ?? null
  );
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  let expenseObject = expense as ExpenseType;

  const { register, handleSubmit, formState, setValue, reset } =
    useForm<LLMExpenseObject>({
      defaultValues: {
        amount: expenseObject.amount.toString(),
        category: expenseObject.category,
        type: expenseObject.type,
        currency: expenseObject.currency,
        date: expenseObject.date?.split("T")[0],
        method: expenseObject.method,
        notes: expenseObject.notes,
        tags: expenseObject.tags,
        title: expenseObject.title,
      },
      resolver: zodResolver(LLMExpenseObjectSchema),
    });

  useEffect(() => {
    if (!imageUrl) return;

    const imageMetadata = getMetadata(imageUrl);

    if (!imageMetadata) return;

    const expiryTime = imageMetadata.exp * 1000;
    const needsRenewal = Date.now() + 5 * 60 * 1000 > expiryTime;

    if (!needsRenewal) return;
    supabase.storage
      .from("images")
      .createSignedUrl(imageMetadata.url.replace("images/", ""), 3600)
      .then(({ data }) => {
        if (data?.signedUrl) {
          supabase
            .from("transactions")
            .update({
              attachment: data?.signedUrl,
            })
            .eq("id", expense.id)
            .then(({ error }) => {
              if (!error) {
                setImageUrl(data.signedUrl);
              }
            });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense.id]);

  if (editing) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="max-w-md w-full p-5">
          <CardHeader closeDisabled={editing}>Edit transaction</CardHeader>
          <CardContent className="space-y-2">
            <form
              className="space-y-2"
              onSubmit={handleSubmit(async (values) => {
                const { data, error } = await supabase
                  .from("transactions")
                  .update({
                    ...values,
                    amount: parseFloat(values.amount),
                  })
                  .eq("id", expense.id);
                if (error) {
                  toast.error(
                    "Something went wrong while updating the transaction"
                  );
                  return;
                }

                setEditing(false);
                reset();
              })}
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  defaultValue={formState.defaultValues?.category}
                  {...register("category")}
                  onValueChange={(value) => {
                    //@ts-ignore
                    setValue("category", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => {
                        return (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  defaultValue={formState.defaultValues?.currency}
                  {...register("currency")}
                  //@ts-ignore
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencies.map((currency) => {
                        return (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input {...register("amount")} id="amount" />
              </div>
              <div>
                <Label>Method</Label>
                <Select
                  defaultValue={formState.defaultValues?.method}
                  {...register("method")}
                  //@ts-ignore
                  onValueChange={(value) => setValue("method", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {methods.map((method) => {
                        return (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input {...register("notes")} id="notes" />
              </div>
              <Button className="w-full">Save</Button>
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader closeDisabled={editing} onClose={onClose}>
          <CardTitle className="text-2xl">{expense.title}</CardTitle>
          <p className="text-gray-600">{expense.category}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="flex items-center text-muted-foreground">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {expense.date?.split("T")[0]}
          </p>
          <p className="flex items-center text-xl font-bold">
            {expense.currency === "USD" && (
              <DollarSignIcon className="h-6 w-6 mr-2" />
            )}
            {expense.amount}
          </p>
          {imageUrl && (
            <a
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm underline text-gray-800"
              href={imageUrl}
            >
              View receipt
            </a>
          )}
          <p className="text-gray-600 text-sm">Paid via {expense.method}</p>
          {expense.notes && (
            <p className="text-gray-600 text-sm">Notes: {expense.notes}</p>
          )}
          <ul className="space-x-1 flex flex-row items-center">
            {expense?.tags?.map((tag) => {
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
            <Button
              onClick={() => {
                if (editing) {
                  setEditing(false);
                } else {
                  setEditing(true);
                }
              }}
              className="w-full"
              disabled={loading}
              variant={"outline"}
            >
              {editing ? `Cancel Edit` : `Edit`}
            </Button>
            <Button
              loading={loading}
              disabled={editing}
              onClick={async () => {
                setLoading(true);
                await safeExecuteAction({
                  id: "deleteExpense",
                  action: async () => {
                    await deleteExpense({
                      expenseId: expense.id,
                    });
                  },
                  onSuccess: () => {
                    onClose();
                  },
                });
                setLoading(false);
              }}
              variant={"outline"}
              className="w-full"
            >
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
