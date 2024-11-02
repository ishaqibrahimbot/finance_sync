import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { signout } from "@/app/sign-in/[[...sign-in]]/actions";

export const Header = () => {
  const event = useRef<Event>();

  const { user } = useAuth();

  const saveEvent = (e: Event) => {
    e.preventDefault();
    console.log(e);
    event.current = e;
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", saveEvent);

    return () => {
      window.removeEventListener("beforeinstallprompt", saveEvent);
    };
  }, []);
  return (
    <header className="p-4 pb-0 sm:pb-4">
      <nav className="flex sm:flex-row space-y-2 sm:space-y-0 flex-col justify-between items-center">
        <Image
          src="/yafa-text-logo.png"
          alt="yafa title"
          width={320}
          height={100}
        />
        <ul className="flex flex-row -space-x-2 items-center text-gray-600">
          <li>
            <Button
              // @ts-ignore
              onClick={() => event?.current?.prompt()}
              variant={"link"}
            >
              Install
            </Button>
          </li>
          {user ? (
            <>
              <Button asChild variant={"link"}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant={"link"} onClick={() => signout()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <li>
                <Button asChild variant={"link"}>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant={"link"}>
                  <Link href={"/sign-up"}>Sign Up</Link>
                </Button>
              </li>
            </>
          )}
          <li>
            <Button asChild variant={"link"}>
              <a
                href={
                  "https://www.ishaqibrahim.com/posts/introducing-yet-another-finance-app"
                }
                target="_blank"
              >
                About YAFA
              </a>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
