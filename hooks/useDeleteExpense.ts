import { supabase } from "@/lib/supabase";
import { RealtimePostgresDeletePayload } from "@supabase/supabase-js";
import { useEffect } from "react";

export function useDeleteExpense(
  callback: (
    payload: RealtimePostgresDeletePayload<Record<string, any>>
  ) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel("expense_delete")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
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
