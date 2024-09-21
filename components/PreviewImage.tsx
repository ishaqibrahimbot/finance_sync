"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function PreviewImage({
  handleImageUpload,
}: {
  handleImageUpload: (file: File) => void;
}) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const showPreviewImage = async () => {
      const cache = await caches.open("shared_image");
      const imageResponse = await cache.match("shared_image");
      if (imageResponse) {
        const formData = await imageResponse.formData();
        const image = formData.get("image") as File;
        const imageUrl = URL.createObjectURL(image);
        setPreviewImageUrl(imageUrl);
        setModalOpen(true);
      }
    };

    if (queryParams.has("shared_image")) {
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
              // set image in state and clear from cache

              try {
                const cache = await caches.open("shared_image");
                const imageResponse = await cache.match("shared_image");
                if (imageResponse) {
                  const formData = await imageResponse.formData();
                  const image = formData.get("image") as File;
                  handleImageUpload(image);
                  await cache.delete("shared_image");
                  router.replace("/");
                }
              } catch (err) {
                console.error(err);
                toast.error("Something went wrong. Unable to set this image");
              }
            }}
          >
            Confirm
          </Button>
          <Button
            className="w-full"
            onClick={async () => {
              // remove the image from cache and remove the query param
              try {
                const cache = await caches.open("shared_image");
                await cache.delete("shared_image");
                router.replace("/");
              } catch (err) {
                console.error(err);
                toast.error(
                  "Something went wrong. Unable to clear shared image from cache"
                );
              }
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
