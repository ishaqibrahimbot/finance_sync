import { supabase } from "@/lib/supabase";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { DependencyList, useEffect } from "react";

export function useUpdateExpense(
  callback: (
    payload: RealtimePostgresUpdatePayload<Record<string, any>>
  ) => void,
  dependencyArray?: DependencyList
) {
  useEffect(() => {
    const channel = supabase
      .channel("expense_update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray ?? []);
}
