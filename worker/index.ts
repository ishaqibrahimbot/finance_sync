import { util } from "./util";
import Compressor from "compressorjs";

declare let self: ServiceWorkerGlobalScope;

util();

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/api/share" && event.request.method === "POST") {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request: Request) {
  console.log("HANDLING POST FROM '/api/share'");

  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const prompt = formData.get("prompt") as string;
  const image = formData.get("image") as File;
  console.log("PROMPT: ", prompt);

  if (prompt) {
    return Response.redirect(`/?prompt=${encodeURIComponent(prompt)}`);
  }

  if (image) {
    const sizeInMb = image.size / 1000000;
    if (sizeInMb >= 4.5) {
      return Response.redirect(
        `/?message=${encodeURIComponent(
          "Sorry, we don't support direct share of images greater than 4.5Mb. Please upload it here instead."
        )}`
      );
    }
  }

  return fetch(request);
}
