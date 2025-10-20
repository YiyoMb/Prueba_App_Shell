// ============================================
// SERVICE WORKER - Gestión de Caché y Offline
// ============================================

// Nombre de la caché - cambiar la versión fuerza actualización
const CACHE_NAME = 'pwa-todo-v1';

// Archivos del App Shell que se cachearán
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// ============================================
// EVENTO: INSTALL
// Se ejecuta cuando el SW se instala por primera vez
// ============================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');

    // Esperar a que se complete el cacheo
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Cacheando App Shell');
                // Agregar todos los archivos del App Shell al caché
                return cache.addAll(APP_SHELL);
            })
            .then(() => {
                console.log('✅ Service Worker: App Shell cacheado exitosamente');
                // Forzar que el nuevo SW tome control inmediatamente
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Error al cachear App Shell:', error);
            })
    );
});

// ============================================
// EVENTO: ACTIVATE
// Se ejecuta cuando el SW toma control
// ============================================
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activando...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Eliminar cachés antiguos
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Mantener solo el caché actual
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activado y listo');
                // Tomar control de todas las páginas inmediatamente
                return self.clients.claim();
            })
    );
});

// ============================================
// EVENTO: FETCH
// Intercepta todas las peticiones de red
// ============================================
self.addEventListener('fetch', (event) => {
    // Solo manejar peticiones GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        // Estrategia: Cache First, luego Network
        // Primero busca en caché, si no está, va a la red
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Encontrado en caché - retornar inmediatamente
                    console.log('💾 Desde caché:', event.request.url);
                    return cachedResponse;
                }

                // No está en caché - ir a la red
                console.log('🌐 Desde red:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Verificar si la respuesta es válida
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clonar la respuesta (solo se puede usar una vez)
                        const responseToCache = networkResponse.clone();

                        // Guardar en caché para futuras peticiones
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        // Error de red - puede ser modo offline
                        console.log('📴 Sin conexión, recurso no disponible:', event.request.url);

                        // Si es una página HTML, retornar el index.html cacheado
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }

                        // Para otros recursos, no hay fallback
                        return new Response('Sin conexión', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// ============================================
// EVENTO: MESSAGE
// Permite comunicación entre la app y el SW
// ============================================
self.addEventListener('message', (event) => {
    console.log('📨 Service Worker: Mensaje recibido:', event.data);

    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            console.log('🗑️ Todas las cachés eliminadas');
        });
    }
});