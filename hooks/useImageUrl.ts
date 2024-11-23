import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

function getMetadata(signedUrl: string) {
  const urlObject = new URL(signedUrl);
  const expiryParam = urlObject.searchParams.get("token");
  if (!expiryParam) return null;

  // Extract expiry timestamp from JWT token (simplified)
  const token = expiryParam.split(".")[1];
  const payload = JSON.parse(atob(token));
  return payload;
}

export function useImageUrl({
  currentUrl,
  expenseId,
  userId,
}: {
  currentUrl: string | null;
  expenseId: number;
  userId: string | null;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentUrl ?? null);

  useEffect(() => {
    if (!imageUrl) return;
    if (imageUrl.includes("https://drgtlksgexfaeyrqjril")) {
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
              .eq("id", expenseId)
              .then(({ error }) => {
                if (!error) {
                  setImageUrl(data.signedUrl);
                }
              });
          }
        });
    } else if (imageUrl.includes("https://financesyncappstack")) {
      return;
    } else {
      // it's a key
      const path = `${userId}/${imageUrl}`;
      supabase.storage
        .from("images")
        .createSignedUrl(path, 3600)
        .then(({ data }) => {
          const url = data?.signedUrl;
          setImageUrl(url ?? null);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseId]);

  return imageUrl;
}
