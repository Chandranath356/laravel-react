self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open('my-app-cache')
          .then((cache) => {
            return cache.addAll([
              '/build/assets/app-B_7lVK5n.css',
              '/build/assets/app-neCczAvf.css',
              '/build/assets/app-DkRC0YXs.js',
              '/build/manifest.json',
              '/',
              '/users',
              '/favicon.ico'
              // Add other assets to cache
            ]);
          })
      );
      self.skipWaiting();
    });

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== 'my-app-cache').map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});
const ignoredPaths = ['/@vite', '/@react-refresh', '/resources/'];
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  const url = new URL(event.request.url);


  if (event.request.method !== 'GET') return;

   if (ignoredPaths.some(path => url.pathname.startsWith(path))) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        console.log('[SW] Serving from cache:', event.request.url);
        return cached;
      }

      return fetch(event.request)
        .then((res) => {
          return res;
        })
        .catch(async (err) => {
          console.log('[SW] Offline and not cached:', event.request.url);
            if (event.request.mode === 'navigate') {
            const fallback = await caches.match('/offline.html');
            return fallback || new Response('<h1>Offline</h1>', {
              headers: { 'Content-Type': 'text/html' }
            });
          }

          return new Response('', { status: 404 });
        });
    })
  );
});
self.addEventListener('install', event => {
  self.skipWaiting();
});

let csrfToken = null;

self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_CSRF') {
    csrfToken = event.data.token;
  }
});

self.addEventListener("sync", (event) => {

 if (event.tag === "post-data") {
    event.waitUntil(
      syncOfflineForms()
    );
  }
});


async function syncOfflineForms() {
  const dbRequest = indexedDB.open("OfflineFormsDB", 1);
  dbRequest.onsuccess = async () => {
    const db = dbRequest.result;
    const tx = db.transaction("forms", "readwrite");
    const store = tx.objectStore("forms");

    const getAll = store.getAll();
    getAll.onsuccess = async () => {
      const forms = getAll.result;
      for (const form of forms) {
        if (!form.synced) {
           
          try {
            const res = await fetch("/api/service-worker", {
              method: "POST",
              credentials: "same-origin",
              headers: {  'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
               },
              body: JSON.stringify(form.formData),
            });
             
            if (res.ok) {
              const deleteTx = db.transaction("forms", "readwrite");
              const deleteStore = deleteTx.objectStore("forms");
              deleteStore.delete(form.id);
              console.log("Synced form ID:", form.id);
            }
          } catch (err) {
            console.log(err);
            console.error("Sync failed for form ID:", form.id);
          }
        }
      }
    };
  };
}