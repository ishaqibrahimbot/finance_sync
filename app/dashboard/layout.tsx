import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "@/components/Menu";

const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={cn(inter.className, "bg-slate-100")}>
          <SignedIn>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
              <div className="container mx-auto flex justify-between items-center">
                <Menu />
                <h1 className="text-xl font-bold">Yet Another Finance App</h1>
              </div>
            </header>
          </SignedIn>
          <main className="pt-12">{children}</main>
        </body>
        <Toaster />
      </html>
    </ClerkProvider>
  );
}