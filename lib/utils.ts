import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function safeExecuteAction({
  id,
  action,
  onError,
  onSuccess,
}: {
  id: string;
  action: (...args: any) => any;
  onError?: (...args: any) => any;
  onSuccess?: (...args: any) => any;
}) {
  try {
    await action();
    onSuccess && onSuccess();
  } catch (err) {
    console.log(`${id} error:`, err);
    toast(
      // @ts-ignore
      `error in ${id}: ${err?.message ?? "something went wrong"}`
    );
    onError && onError();
  }
}
