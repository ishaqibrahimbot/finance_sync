import { ArrowDown, ArrowRight } from "lucide-react";
import { DragScreenshot } from "./DragScreenshot";
import { DragTarget } from "./DragTarget";
import { Section } from "./ui/section";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const ImageProcessing = () => {
  const [showResult, setShowResult] = useState(false);
  const [imageType, setImageType] = useState<"screenshot" | "image">("image");
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
        Just ordered some food? Got a{" "}
        <ToggleGroup
          defaultValue="image"
          className="mt-2 sm:mt-0 inline-block space-x-2 mx-1"
          type="single"
          value={imageType}
        >
          <ToggleGroupItem
            onClick={() => setImageType("image")}
            variant={"outline"}
            value="image"
          >
            picture
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => setImageType("screenshot")}
            variant={"outline"}
            value="screenshot"
          >
            screenshot
          </ToggleGroupItem>
        </ToggleGroup>{" "}
        <span>?</span>
      </h2>
      <h3 className="text-center text-[#7c6015]">
        Drag the {imageType} to the app (refresh the page to try again)
      </h3>
      <div className="py-4 mx-auto flex w-full max-w-3xl flex-col sm:flex-row justify-start space-y-6 sm:space-y-0 sm:justify-between items-center">
        <div>
          <DragScreenshot
            src={
              imageType === "image" ? "/receipt-real.jpeg" : "/screenshot.jpeg"
            }
            width={120}
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
            src="/image-result.png"
            alt="output of image processing"
          />
        </div>
      </div>
    </Section>
  );
};
