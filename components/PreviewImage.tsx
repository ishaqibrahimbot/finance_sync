"use client";

import { generateObjectUrl } from "@/lib/indexed-db";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function PreviewImage() {
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const showPreviewImage = async () => {
      const fileId = queryParams.get("file");
      const imageUrl = await generateObjectUrl(fileId as string);
      setPreviewImageUrl(imageUrl);
      setModalOpen(true);
    };

    if (queryParams.has("file")) {
      showPreviewImage();
    }
  }, [queryParams]);

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
        <div className="flex flex-row w-full items-center space-x-2">
          <Button>Confirm</Button>
          <Button
            onClick={async () => {
              // remove the image from indexedDB and remove the query param
              const fileId = queryParams.get("file");

              const request = indexedDB.open("ImageStorage", 1);

              request.onerror = (event) =>
                toast.error("Something went wrong while clearing the image");

              request.onsuccess = (event) => {
                const db = request.result;
              };
            }}
            variant={"destructive"}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
