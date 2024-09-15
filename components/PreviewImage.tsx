"use client";

import { generateObjectUrl } from "@/lib/indexed-db";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function PreviewImage() {
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const router = useRouter();

  if (queryParams.has("file")) {
    const fileId = queryParams.get("file");
    generateObjectUrl(fileId as string).then((url) => {
      setPreviewImageUrl(url);
      router.replace("/");
    });
  }

  useEffect(() => {
    if (previewImageUrl) setModalOpen(true);
  }, [previewImageUrl]);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview your image</DialogTitle>
        </DialogHeader>
        <div className="relative min-w-[300px] min-h-[500px] sm:min-w-[450px] bg-black/30 p-2">
          {previewImageUrl && (
            <Image
              style={{
                objectFit: "contain",
              }}
              src={previewImageUrl}
              fill
              alt="preview image"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
