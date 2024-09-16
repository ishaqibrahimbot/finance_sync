"use client";

import {
  deleteImage,
  generateObjectUrl,
  getImageAndDelete,
} from "@/lib/indexed-db";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { safeExecuteAction } from "@/lib/utils";

export default function PreviewImage({
  setImage,
}: {
  setImage: Dispatch<SetStateAction<File | null>>;
}) {
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
    } else {
      setPreviewImageUrl("");
      setModalOpen(false);
    }
  }, [queryParams]);

  return (
    <Dialog open={modalOpen}>
      <DialogContent hideCloseButton>
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
          <Button
            className="w-full"
            onClick={async () => {
              // extract the file object from db, set it in state,
              // and clear the indexeddb entry

              const fileId = queryParams.get("file");

              if (!fileId) return;

              await safeExecuteAction({
                id: "getImage",
                action: async () => await getImageAndDelete(fileId),
                onSuccess: async (image: File) => {
                  console.log("Image: ", image);
                  setImage(image);
                  router.replace("/");
                },
              });
            }}
          >
            Confirm
          </Button>
          <Button
            className="w-full"
            onClick={async () => {
              // remove the image from indexedDB and remove the query param
              const fileId = queryParams.get("file");

              if (!fileId) return;

              await safeExecuteAction({
                id: "clearImage",
                action: async () => await deleteImage(fileId),
                onSuccess: () => {
                  toast.info("Image cleared from db!");
                  router.replace("/");
                },
              });
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
