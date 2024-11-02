import { supabase } from "@/lib/supabase";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useEffect } from "react";

export function useInsertExpense(
  callback: (
    payload: RealtimePostgresInsertPayload<Record<string, any>>
  ) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel("expense_insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
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
  }, []);
}
