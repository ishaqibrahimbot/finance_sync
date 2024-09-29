"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useDrop } from "react-dnd";

export function DragTarget({
  hideImage,
  showResult,
}: {
  hideImage: (...args: any) => any;
  showResult: boolean;
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
      // @ts-ignore
      ref={drop}
      className={cn(
        "p-6 transition-transform duration-300 flex space-y-2 flex-col items-center justify-center",
        isOver && "scale-[2]",
        dropped && !showResult && "animate-pulse duration-700"
      )}
    >
      <Image src="/yafa-logo.png" width={100} height={100} alt="yafa logo" />
    </div>
  );
}
