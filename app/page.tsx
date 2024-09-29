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
        <p className="text-[#7c6015] text-center text-sm">{`(Don't forget to tap on the generated card)`}</p>
        <Demo />
      </Section>
      <Section>
        <h2 className="text-[#7c6015] text-center">{`For the best experience, install this app on your phone (via Chrome, preferably) from the link in the header ;)`}</h2>
      </Section>
      <Footer />
    </>
  );
}
