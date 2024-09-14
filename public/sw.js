self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/" && event.request.method === "POST") {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  console.log("HANDLING POST FROM '/'");

  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const prompt = formData.get("prompt");
  const image = formData.get("image");
  console.log("PROMPT: ", prompt);

  if (prompt) {
    return Response.redirect(`/?prompt=${encodeURIComponent(prompt)}`);
  }

  if (!image) return Response.json({ error: "missing data" }, 400);

  const sizeInMb = image.size / 1000000;
  if (sizeInMb >= 4.5) {
    return Response.redirect(
      `/?message=${encodeURIComponent(
        "Sorry, we don't support direct share of images greater than 4.5Mb. Please upload it here instead."
      )}`
    );
  }

  const fileId = await saveFileToIndexedDB(image);
  const objectUrl = await generateObjectUrl(fileId);

  return Response.redirect(`/?prompt=${encodeURIComponent(objectUrl)}`);
}

async function saveFileToIndexedDB(image) {
  return new Promise((resolve, reject) => {
    const dbName = "ImageStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["files"], "readwrite");
      const store = transaction.objectStore("files");
      const fileId = Date.now().toString();
      const saveRequest = store.add({ id: fileId, file: file });

      saveRequest.onsuccess = () => resolve(fileId);
      saveRequest.onerror = () => reject("Error saving file");
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("files", { keyPath: "id" });
    };
  });
}

async function generateObjectUrl(fileId) {
  return new Promise((resolve, reject) => {
    const dbName = "FileStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["files"], "readonly");
      const store = transaction.objectStore("files");
      const getRequest = store.get(fileId);

      getRequest.onsuccess = (event) => {
        const file = event.target.result.file;
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      getRequest.onerror = () => reject("Error retrieving file");
    };
  });
}
