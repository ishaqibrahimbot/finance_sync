export async function saveFileToIndexedDB(image: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const dbName = "ImageStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");

    request.onsuccess = (event) => {
      // @ts-ignore
      const db = event.target?.result;
      const transaction = db.transaction(["files"], "readwrite");
      const store = transaction.objectStore("files");
      const fileId = Date.now().toString();
      const saveRequest = store.add({ id: fileId, file: image });

      saveRequest.onsuccess = () => resolve(fileId);
      saveRequest.onerror = () => reject("Error saving file");
    };

    request.onupgradeneeded = (event) => {
      // @ts-ignore
      const db = event.target?.result;
      db.createObjectStore("files", { keyPath: "id" });
    };
  });
}

export async function generateObjectUrl(fileId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const dbName = "ImageStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");
    request.onsuccess = (event) => {
      // @ts-ignore
      const db = event.target?.result;
      const transaction = db.transaction(["files"], "readonly");
      const store = transaction.objectStore("files");
      const getRequest = store.get(fileId);

      getRequest.onsuccess = (event: any) => {
        const file = event.target.result.file;
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      getRequest.onerror = () => reject("Error retrieving file");
    };
  });
}
