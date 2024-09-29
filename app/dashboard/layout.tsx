import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "@/components/Menu";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "YAFA",
  description: "Yet Another Finance App. But a great one this time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Menu />
          <Link href="/">
            <Image
              src="/yafa-text-logo.png"
              alt="yafa title"
              width={300}
              height={100}
            />
          </Link>
        </div>
      </header>
      <main className="pt-10">{children}</main>
      <Toaster />
    </>
  );
}
