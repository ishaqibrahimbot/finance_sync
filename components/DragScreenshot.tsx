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
  const [{ isDragging, difference }, drag] = useDrag(() => ({
    type: "image",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      difference: monitor.getDifferenceFromInitialOffset(),
    }),
  }));

  return (
    <div
      //@ts-ignore
      ref={drag}
      style={{
        ...(isDragging && !!difference
          ? {
              position: "relative",
              zIndex: 999,
              transform: `translate(${difference.x}px, ${difference.y}px)`,
              pointerEvents: "none",
            }
          : {}),
      }}
      className={cn(
        "self-start cursor-grab transition-transform shadow-sm",
        imageHidden && "scale-0",
        isDragging && "cursor-grabbing"
      )}
    >
      <Image src={src} width={width} height={300} alt="receipt" />
    </div>
  );
}
