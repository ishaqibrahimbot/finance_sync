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

export const maxDuration = 60;

export default function Home() {
  return (
    <>
      <ServiceWorkerRegistration />
      <Header />
      <DndProvider backend={HTML5Backend}>
        <ImageProcessing />
        <TextProcessing />
        <Section>
          <h2 className="text-[#7c6015] text-center mb-1">
            {`Here's a mini demo :)`}
          </h2>
          <p className="text-[#7c6015] text-center text-sm">{`(Don't forget to tap on the generated card)`}</p>
          <Demo />
        </Section>
      </DndProvider>
      <Footer />
    </>
  );
}
