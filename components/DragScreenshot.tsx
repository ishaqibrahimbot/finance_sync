"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDrag } from "react-dnd";

export function DragScreenshot({
  imageHidden,
  src,
  width,
}: {
  imageHidden: boolean;
  src: string;
  width: number;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      //@ts-ignore
      ref={drag}
      className={cn(
        "self-start cursor-grab transition-transform duration-300 shadow-sm",
        imageHidden && "scale-0",
        isDragging && "cursor-grabbing"
      )}
    >
      <Image src={src} width={width} height={300} alt="receipt" />
    </div>
  );
}
