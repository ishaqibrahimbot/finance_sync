"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const menuItems = [{ href: "/", label: "Home" }];

export function Menu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg ${
                pathname === item.href
                  ? "text-primary font-semibold"
                  : "text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button className="" asChild>
            <SignOutButton>Sign Out</SignOutButton>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
