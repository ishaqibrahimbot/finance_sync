export async function generateObjectUrl(fileId: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const file = await getImage(fileId);
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    } catch (err) {
      // @ts-ignore
      reject(err?.message ?? "Something went wrong");
    }
  });
}

export async function getImage(fileId: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const dbName = "ImageStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");
    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction(["files"], "readonly");
      const store = transaction.objectStore("files");
      const getRequest = store.get(fileId);

      getRequest.onsuccess = (event: any) => {
        const file = event.target.result.file;
        resolve(file as File);
      };

      getRequest.onerror = () => reject("Error retrieving file");
    };
  });
}

export async function getImageAndDelete(fileId: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const dbName = "ImageStorage";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => reject("IndexedDB error");
    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction(["files"], "readwrite");
      const store = transaction.objectStore("files");
      const getRequest = store.get(fileId);

      getRequest.onsuccess = (event: any) => {
        const file = event.target.result.file;
        const deleteRequest = store.delete(fileId);
        deleteRequest.onerror = (event) =>
          reject("something went wrong while deleting");
        deleteRequest.onsuccess = (event) => {
          resolve(file as File);
        };
      };

      getRequest.onerror = () => reject("Error retrieving file");
    };
  });
}

export async function deleteImage(fileId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageStorage", 1);

    request.onerror = (event) =>
      reject("Something went wrong while clearing the image");

    request.onsuccess = (event) => {
      const db = request.result;

      const transaction = db.transaction("files", "readwrite");
      const store = transaction.objectStore("files");
      const deleteRequest = store.delete(fileId);
      deleteRequest.onerror = (event) => {
        reject("Failed to clean image from db");
      };
      deleteRequest.onsuccess = (event) => {
        resolve();
      };
    };
  });
}
