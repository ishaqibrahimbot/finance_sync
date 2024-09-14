self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/api/share" && event.request.method === "POST") {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  console.log("HANDLING POST FROM '/api/share'");

  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const prompt = formData.get("prompt");
  const image = formData.get("image");
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
