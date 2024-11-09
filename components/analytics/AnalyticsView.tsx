"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "@/lib/supabase";
import Expense from "../Expense";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { categories } from "@/app/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useLockBodyScroll } from "@uidotdev/usehooks";

const rangePreSelects = [
  "today",
  "yesterday",
  "this week",
  "last week",
  "this month",
  "last month",
  "custom",
] as const;

type PreSelectOptions =
  | "today"
  | "yesterday"
  | "this week"
  | "last week"
  | "this month"
  | "last month"
  | "custom";

type View = "all" | "category";

const ONE_DAY = 1000 * 60 * 60 * 24;

function Analytics() {
  /*
        what do we want here
        we want a category-wise breakdown
        but we want the ability to view all transactions as well for a specific date
        so a couple of ideas coming to fruition:

        - category wise breakdown
            - select a period
            - you can see all categories below, in order
            - clicking on each category total opens up a view with all transactions
            from that category based on that filter
        
        - all transactions view
            - select a period
            - you can see all transactions
            - also you have totals
        
        so the select a period thing is the common theme
        and then you can either view all transactions or category wise totals

        for selecting a period, there can be some pre-selects
        and then an option for custom range

        so e.g. today, yesterday, this week, last week, this month, last month
        and then custom mai you give a begin and end day
    */

  const [selectedRange, setSelectedRange] = useState<PreSelectOptions>("today");
  const [customRangeStart, setCustomRangeStart] = useState<string>();
  const [customRangeEnd, setCustomRangeEnd] = useState<string>();
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState();

  const { data } = useQuery({
    queryKey:
      selectedRange === "custom"
        ? ["analytics", "custom", customRangeStart, customRangeEnd]
        : ["analytics", selectedRange],
    enabled:
      selectedRange === "custom"
        ? !!customRangeStart && !!customRangeEnd!!
        : !!selectedRange,
    queryFn: async () => {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      if (selectedRange === "today") {
        let dbQuery = supabase
          .from("transactions")
          .select("*")
          .gte("date", today.toISOString());
        if (query) {
          dbQuery = dbQuery.textSearch("title", query);
        }
        return await dbQuery;
      } else if (selectedRange === "yesterday") {
        const yesterday = new Date(today.getTime() - ONE_DAY);
        let dbQuery = supabase
          .from("transactions")
          .select("*")
          .gte("date", yesterday.toISOString())
          .lt("date", today.toISOString());
        if (query) {
          dbQuery = dbQuery.textSearch("title", query);
        }
        return await dbQuery;
      } else if (selectedRange === "this week") {
        // assume we mean this starts from Monday

        let referenceDay = today.getDay();
        if (referenceDay === 0) {
          referenceDay = 7;
        }
        const start = new Date(today.getTime() - (referenceDay - 1) * ONE_DAY);
        return await supabase
          .from("transactions")
          .select("*")
          .gte("date", start.toISOString())
          .lt("date", new Date().toISOString());
      } else if (selectedRange === "last week") {
        // previous Monday - Sunday
        const oneWeekAgo = new Date(today.getTime() - 7 * ONE_DAY);
        oneWeekAgo.setHours(0);
        oneWeekAgo.setMinutes(0);
        oneWeekAgo.setSeconds(0);
        let referenceDay = oneWeekAgo.getDay();
        if (referenceDay === 0) {
          referenceDay = 7;
        }
        const start = new Date(
          oneWeekAgo.getTime() - (referenceDay - 1) * ONE_DAY
        );
        const end = new Date(
          oneWeekAgo.getTime() + (8 - referenceDay) * ONE_DAY
        );

        return await supabase
          .from("transactions")
          .select("*")
          .gte("date", start.toISOString())
          .lt("date", end.toISOString());
      } else if (selectedRange === "last month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const start = new Date(lastMonth);
        start.setDate(1);
        const end = new Date(today);
        end.setDate(1);

        return await supabase
          .from("transactions")
          .select("*")
          .gte("date", start.toISOString())
          .lt("date", end.toISOString());
      } else if (selectedRange === "this month") {
        const start = new Date(
          today.getTime() - (today.getDate() - 1) * ONE_DAY
        );
        return await supabase
          .from("transactions")
          .select("*")
          .gte("date", start.toISOString())
          .lt("date", new Date().toISOString());
      } else {
        const start = new Date(customRangeStart!);
        const end = new Date(customRangeEnd!);

        return await supabase
          .from("transactions")
          .select("*")
          .gte("date", start.toISOString())
          .lt("date", end.toISOString());
      }
    },
  });

  const categoryWiseFiltered = useMemo(
    () =>
      categories.reduce((prev, curr) => {
        const currentCategoryExpenses = data?.data?.filter(
          (expense) => expense.category === curr
        );
        if (currentCategoryExpenses?.length === 0) {
          return prev;
        }
        const total = currentCategoryExpenses?.reduce(
          (prev, currExp) => prev + (currExp.amount ?? 0),
          0
        );
        const newObj = {
          category: curr,
          expenses: currentCategoryExpenses,
          total,
          numExpenses: currentCategoryExpenses?.length,
        };
        return [...prev, newObj];
      }, new Array()),
    [data?.count, data?.data]
  );

  return (
    <>
      <div className="mt-8 space-y-4">
        <Select
          defaultValue={selectedRange}
          onValueChange={(value) => setSelectedRange(value as PreSelectOptions)}
        >
          <SelectTrigger className="border border-primary bg-primary/5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {rangePreSelects.map((option) => {
                return (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedRange === "custom" && (
          <div className="space-y-2">
            <div className="flex flex-row space-x-4">
              <Input
                className="border border-primary bg-primary/5"
                placeholder="Start"
                type="date"
                value={customRangeStart}
                onChange={(e) => setCustomRangeStart(e.target.value)}
              />
              <Input
                className="border border-primary bg-primary/5"
                placeholder="End"
                type="date"
                value={customRangeEnd}
                onChange={(e) => setCustomRangeEnd(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="flex flex-row space-x-2">
          <Button
            variant={"outline"}
            disabled={view === "all"}
            className="w-full disabled:bg-primary/20 disabled:opacity-100"
            onClick={() => setView("all")}
          >
            All Transactions
          </Button>
          <Button
            variant={"outline"}
            disabled={view === "category"}
            className="w-full disabled:bg-primary/20 disabled:opacity-100"
            onClick={() => setView("category")}
          >
            Category-wise
          </Button>
        </div>
        {/* <Input
        value={query}
        onChange={(e) => setQuery(e.target.value ?? "")}
        placeholder="Search..."
        className="border border-primary bg-primary/5"
      /> */}
        <ul className="space-y-2">
          {view === "all" &&
            data?.data?.map((expense) => (
              <li key={expense.id}>
                <Expense expense={expense} />
              </li>
            ))}
          {view === "category" &&
            categoryWiseFiltered.map((group) => (
              <li key={group.category}>
                <Card
                  className="hover:bg-primary/5 cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                  <CardContent className="p-4 flex flex-col">
                    <h3 className="text-base font-semibold">
                      {group.category}
                    </h3>
                    <div className="flex flex-row justify-between">
                      <p>Total: {group.total?.toFixed(2)}</p>
                      <p>{group.numExpenses}</p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
        </ul>
      </div>
      {selectedGroup && (
        <CategoryExpensesModal
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </>
  );
}

const queryClient = new QueryClient();

export function AnalyticsView() {
  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function CategoryExpensesModal({
  selectedGroup,
  setSelectedGroup,
}: {
  selectedGroup: any;
  setSelectedGroup: any;
}) {
  useLockBodyScroll();

  return (
    <div className="fixed h-screen inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full h-screen">
        <CardHeader onClose={() => setSelectedGroup(undefined)}>
          {selectedGroup.category}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 max-h-[calc(100vh-120px)] overflow-auto">
            {selectedGroup.expenses.map((expense: any) => (
              <li key={expense.id}>
                <Expense expense={expense} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
