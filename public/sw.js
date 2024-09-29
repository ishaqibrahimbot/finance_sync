self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/dashboard" && event.request.method === "POST") {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  const clonedRequest = request.clone();
  const contentTypeHeader = clonedRequest.headers.get("Content-Type");

  if (!contentTypeHeader.includes("multipart/form-data")) {
    return await fetch(request);
  }

  const formData = await clonedRequest.formData();
  const formKeys = [...formData.keys()];

  if (!(formKeys.includes("prompt") || formKeys.includes("image"))) {
    return await fetch(request);
  }

  const prompt = formData.get("prompt");
  const image = formData.get("image");

  if (prompt) {
    return Response.redirect(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  }

  if (!image) return Response.json({ error: "missing data" }, { status: 400 });

  const cache = await caches.open("shared_image");
  await cache.put("shared_image", new Response(formData));

  return Response.redirect(`/dashboard?shared_image=true`);
}
