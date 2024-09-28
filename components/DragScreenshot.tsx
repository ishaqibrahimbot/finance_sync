"use client";
import { cn } from "@/lib/utils";
import { useDrag } from "react-dnd";

export function DragScreenshot({ imageHidden }: { imageHidden: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "w-20 h-20 self-start bg-gray-700 rounded-sm transition-transform duration-300 shadow-sm",
        imageHidden && "scale-0"
      )}
    ></div>
  );
}
