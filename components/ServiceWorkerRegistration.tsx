"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ServiceWorkerRegistration() {
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    toast.info("Service worker registered with scope: " + registration.scope);

    if (registration.active) {
      toast.info("Service worker activated!");
    }

    registration.addEventListener("updatefound", (event) => {
      toast.info("Found update for service worker");
    });
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerServiceWorker();
    }
  }, []);

  return null;
}
