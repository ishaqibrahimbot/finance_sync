import { ArrowDown, ArrowRight } from "lucide-react";
import { Section } from "./ui/section";
import Image from "next/image";
import { DragTarget } from "./DragTarget";
import { DragScreenshot } from "./DragScreenshot";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const TextProcessing = () => {
  const [showResult, setShowResult] = useState(false);
  const [imageHidden, setImageHidden] = useState(false);

  const hideImage = () => {
    setImageHidden(true);
  };

  useEffect(() => {
    if (imageHidden) {
      setTimeout(() => {
        setShowResult(true);
      }, 2000);
    }
  }, [imageHidden]);

  return (
    <Section>
      <h2 className="text-[#7c6015] text-center">
        {`Works the same with texts :)`}
      </h2>
      <div className="py-4 mx-auto flex w-full max-w-3xl flex-col sm:flex-row justify-start space-y-6 sm:space-y-0 sm:justify-between items-center">
        <div>
          <DragScreenshot
            width={220}
            src="/sms.jpeg"
            imageHidden={imageHidden}
          />
        </div>
        <div>
          <DragTarget showResult={showResult} hideImage={hideImage} />
        </div>
        <ArrowRight
          className={cn(
            "hidden sm:block",
            "transition-transform duration-500",
            showResult ? "scale-150 opacity-100" : "scale-50 opacity-0"
          )}
        />
        <ArrowDown
          className={cn(
            "block sm:hidden",
            "transition-transform duration-500",
            showResult ? "scale-150 opacity-100" : "scale-50 opacity-0"
          )}
        />
        <div
          className={cn(
            "transition-transform duration-500",
            showResult ? "scale-100" : "scale-0"
          )}
        >
          <Image
            width={300}
            height={300}
            src="/text-generated.png"
            alt="output of image processing"
          />
        </div>
      </div>
    </Section>
  );
};
