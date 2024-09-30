"use client";
import { Demo } from "@/components/Demo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ImageProcessing } from "@/components/ImageProcessing";
import { TextProcessing } from "@/components/TextProcessing";
import { Section } from "@/components/ui/section";
import { DndProvider } from "react-dnd";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";

export const maxDuration = 60;

export default function Home() {
  const { width } = useWindowSize();
  const backend = width ? (width < 640 ? TouchBackend : HTML5Backend) : null;
  return (
    <>
      <ServiceWorkerRegistration />
      <Header />
      {backend && (
        <DndProvider backend={backend}>
          <ImageProcessing />
          <TextProcessing />
        </DndProvider>
      )}
      <Section>
        <h2 className="text-[#7c6015] text-center mb-1">
          {`Here's a mini demo :)`}
        </h2>
        <p className="text-[#7c6015] text-sm text-center">
          1. Click on the add button
        </p>
        <p className="text-[#7c6015] text-center text-sm">{`2. Tap on the generated card`}</p>
        <Demo />
      </Section>
      <Section>
        <h2 className="text-[#7c6015] text-center">{`Visit this blog post to learn more (and watch some real videos):`}</h2>
        <Button className="w-fit mx-auto" asChild variant="default">
          <a
            href={
              "https://www.ishaqibrahim.com/posts/introducing-yet-another-finance-app"
            }
            target="_blank"
          >
            About YAFA
          </a>
        </Button>
      </Section>
      <Section>
        <h2 className="text-[#7c6015] text-center">{`For the best experience, install this app on your phone (via the Chrome browser, preferably) from the link in the header ;)`}</h2>
      </Section>
      <Footer />
    </>
  );
}
