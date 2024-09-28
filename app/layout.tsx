import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "@/components/Menu";
import { Button } from "@/components/ui/button";

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
      <body
        className={cn(
          inter.className,
          "bg-[#FAF7F0] max-w-screen-xl mx-auto pt-4"
        )}
      >
        <header className="p-4">
          <nav className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-mono">YAFA</h1>
            <ul className="flex flex-row items-center text-gray-600">
              <li>
                <Button variant={"link"}>Install</Button>
              </li>
              <li>
                <Button variant={"link"}>Sign In</Button>
              </li>
              <li>
                <Button variant={"link"}>Sign Up</Button>
              </li>
            </ul>
          </nav>
        </header>
        <main className="pt-12 w-full">{children}</main>
        <footer className="w-full mx-auto flex flex-col items-center text-center">
          <p>Made by Ishaq Ibrahim</p>
        </footer>
      </body>
      <Toaster />
    </html>
  );
}
