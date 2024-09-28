"use client";
import { DragScreenshot } from "@/components/DragScreenshot";
import { DragTarget } from "@/components/DragTarget";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const maxDuration = 60;

export default function Home() {
  const [imageHidden, setImageHidden] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const hideImage = () => {
    setImageHidden(true);
  };

  useEffect(() => {
    if (imageHidden) {
      setTimeout(() => {
        setShowArrow(true);
      }, 2000);
    }
  }, [imageHidden]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Section>
          <h2 className="text-[#7c6015] text-center">
            Just ordered some food? Got a screenshot?
          </h2>
          <h3 className="text-center text-[#7c6015]">
            Drag the screenshot to the app
          </h3>
          <div className="py-10 flex flex-row justify-start items-center">
            <div className="mr-40">
              <DragScreenshot imageHidden={imageHidden} />
            </div>
            <div className="mr-5">
              <DragTarget hideImage={hideImage} />
            </div>
            <ArrowRightIcon
              className={cn(
                "w-10 h-10 transition-transform duration-500",
                showArrow ? "translate-x-40" : "translate-x-0 hidden"
              )}
            />
          </div>
        </Section>
      </div>
    </DndProvider>
  );
}
