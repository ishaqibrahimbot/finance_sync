"use client";

import { useState, useRef } from "react";
import { ImageIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ExpenseInputProps {
  onAddExpense: (title: string) => void;
}

export default function ExpenseInput({ onAddExpense }: ExpenseInputProps) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddExpense(input.trim());
      setInput("");
      setImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Card className="fixed bg-slate-100 bottom-0 left-0 right-0 border-t rounded-t-xl">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter expense details..."
            className="w-full min-h-[100px] resize-none rounded-xl"
          />
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-4 rounded-lg border-2 border-gray-300"
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Upload Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 px-6 rounded-lg"
              disabled={!input.trim() && !image}
            >
              <SendIcon className="h-5 w-5 mr-2" />
              Add
            </Button>
          </div>
          {image && (
            <div className="text-sm text-muted-foreground">
              Image attached: {image.name}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
