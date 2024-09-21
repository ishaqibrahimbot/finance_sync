"use client";

import { useState, useRef } from "react";
import { ImageIcon, SendIcon, CameraIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { addExpense } from "@/app/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { safeExecuteAction } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Compressor from "compressorjs";
import PreviewImage from "./PreviewImage";

export default function ExpenseInput() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const imageCaptureInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const queryParams = useSearchParams();
  const router = useRouter();

  if (queryParams.has("prompt") && queryParams.get("prompt") !== input) {
    const prompt = queryParams.get("prompt");
    console.log("got this prompt", prompt);
    setInput(prompt!);
    inputRef?.current?.focus();
    router.replace("/");
  }

  if (queryParams.has("message")) {
    const message = queryParams.get("message");
    toast.error(
      message === "image-not-found"
        ? "We could not find the shared image. Please try again"
        : message
    );
    router.replace("/");
  }

  const handleImageUpload = (file: File) => {
    console.log("original file size", file.size);
    console.log("original file type", file.type);

    const promise = new Promise<File>(
      (resolve, reject) =>
        new Compressor(file, {
          quality: 0.8,
          retainExif: true,
          width: 2048,
          success: (file) => {
            resolve(file as File);
          },
          error: reject,
        })
    );

    toast.promise(promise, {
      loading: "Compressing your image...",
      success(data: File) {
        console.log("new file size", data.size);
        console.log("new file type", data.type);
        console.log("file", data.name);
        setImage(data);

        return "Done! Your image is ready to be sent.";
      },
      error(data) {
        if (imageUploadInputRef?.current)
          imageUploadInputRef.current.value = "";
        if (imageCaptureInputRef?.current)
          imageCaptureInputRef.current.value = "";
        console.error(data);
        return "Something went wrong while compressing your image. Please try again";
      },
    });
  };

  return (
    <>
      <PreviewImage handleImageUpload={handleImageUpload} />
      <Card className="fixed bg-slate-300 bottom-0 left-0 right-0 border-t rounded-t-xl">
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              value={input}
              ref={inputRef}
              name="rawExpenseText"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Spent a fortune on chocolate bars..."
              className="w-full min-h-[100px] resize-none rounded-xl"
            />
            <div className="flex justify-between items-center">
              {image ? (
                <div className="w-full flex flex-row justify-start items-center space-x-2">
                  <Button
                    size={"sm"}
                    aria-label="Remove Selected Image"
                    variant={"destructive"}
                    onClick={() => setImage(null)}
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                  <div className="text-sm text-muted-foreground max-w-36">
                    Image attached: {image.name}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-start space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageUploadInputRef.current?.click()}
                    className="h-10 px-4 rounded-lg border-2 border-gray-300"
                  >
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageCaptureInputRef.current?.click()}
                    className="h-10 px-4 rounded-lg border-2 border-gray-300"
                  >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Capture
                  </Button>
                </div>
              )}
              <input
                type="file"
                ref={imageUploadInputRef}
                id="image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleImageUpload(file);
                }}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={imageCaptureInputRef}
                id="image-capture"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleImageUpload(file);
                }}
                accept="image/*"
                capture="environment"
                className="hidden"
              />
              <Button
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append("rawExpenseText", input);
                  if (image) {
                    formData.append("image", image);
                  }
                  // used in a protected route, userId must be defined
                  await safeExecuteAction({
                    id: "addExpense",
                    action: async () => {
                      await addExpense({ formData, userId: userId! });
                    },
                    onSuccess: () => {
                      setInput("");
                      setImage(null);
                    },
                  });
                  setLoading(false);
                }}
                size="sm"
                className="h-10 px-6 rounded-lg"
                disabled={!input.trim() && !image}
              >
                <SendIcon className="h-5 w-5 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
