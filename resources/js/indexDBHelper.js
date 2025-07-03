export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("OfflineFormsDB", 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("forms")) {
        db.createObjectStore("forms", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOffline(formName, formData) {
  const db = await openDB();
  const tx = db.transaction("forms", "readwrite");
  const store = tx.objectStore("forms");
  store.add({ formName, formData, synced: false, timestamp: new Date() });
}

export async function getUnsyncedForms() {
  const db = await openDB();
  const tx = db.transaction("forms", "readonly");
  const store = tx.objectStore("forms");
  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result.filter((entry) => !entry.synced));
    };
  });
}

export async function markAsSynced(id) {
  const db = await openDB();
  const tx = db.transaction("forms", "readwrite");
  const store = tx.objectStore("forms");
  const get = store.get(id);
  get.onsuccess = () => {
    const data = get.result;
    data.synced = true;
    store.put(data);
  };
}
