self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", async (event) => {
  console.log("event.request.url", event.request.url);
  const url = new URL(event.request.url);

  if (url.pathname === "/" && event.request.method === "POST") {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  console.log("HANDLING POST FROM '/'");

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
    return Response.redirect(`/?prompt=${encodeURIComponent(prompt)}`);
  }

  if (!image) return Response.json({ error: "missing data" }, { status: 400 });

  const cache = await caches.open("shared_image");
  await cache.put("shared_image", new Response(image));

  return Response.redirect(`/?shared_image=true`);
}

// async function saveFileToIndexedDB(image) {
//   return new Promise((resolve, reject) => {
//     const dbName = "ImageStorage";
//     const dbVersion = 1;
//     const request = indexedDB.open(dbName, dbVersion);

//     request.onerror = (event) => reject("IndexedDB error");

//     request.onsuccess = (event) => {
//       // @ts-ignore
//       const db = event.target?.result;
//       const transaction = db.transaction(["files"], "readwrite");
//       const store = transaction.objectStore("files");
//       const fileId = Date.now().toString();
//       const saveRequest = store.add({ id: fileId, file: image });

//       saveRequest.onsuccess = () => resolve(fileId);
//       saveRequest.onerror = () => reject("Error saving file");
//     };

//     request.onupgradeneeded = (event) => {
//       // @ts-ignore
//       const db = event.target?.result;
//       db.createObjectStore("files", { keyPath: "id" });
//     };
//   });
// }
