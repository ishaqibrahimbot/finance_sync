"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDrop } from "react-dnd";

export function DragTarget({
  hideImage,
}: {
  hideImage: (...args: any) => any;
}) {
  const [dropped, setDropped] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: () => {
      hideImage();
      setDropped(true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "bg-[#7c6015] p-6 transition-transform duration-300 flex space-y-2 flex-col items-center justify-center",
        isOver && "scale-125",
        dropped && "animate-bounce duration-700"
      )}
    >
      <p className={cn("font-mono text-2xl")}>YAFA</p>
      {dropped && (
        <div className="w-20 h-20 bg-gray-700 rounded-sm shadow-sm"></div>
      )}
    </div>
  );
}
