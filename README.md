# 📝 PWA Lista de Tareas - Documentación

## 📋 Descripción
Aplicación Web Progresiva (PWA) de lista de tareas que demuestra la implementación de App Shell Architecture, funcionamiento offline mediante Service Worker, y capacidad de instalación en dispositivos.

**Materia:** Aplicaciones Web Progresivas  
**Práctica:** App Shell con Service Worker  
**Tecnologías:** HTML5, CSS3, JavaScript (Vanilla), Service Workers, Cache API, LocalStorage

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos
```
mi-pwa-todo/
│
├── index.html          # Página principal con App Shell
├── manifest.json       # Configuración de la PWA
├── sw.js              # Service Worker
├── css/
│   └── styles.css     # Estilos de la aplicación
├── js/
│   └── app.js         # Lógica de la aplicación
└── icons/             # Íconos en múltiples tamaños
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

### App Shell Components

El App Shell está compuesto por:

1. **Encabezado (Header)**
    - Título de la aplicación
    - Indicador de estado de conexión (online/offline)

2. **Navegación (Nav)**
    - Menú con tres vistas: Tareas, Completadas, Acerca de
    - Navegación sin recarga de página (SPA behavior)

3. **Contenido Dinámico (Main)**
    - Vista de Tareas: formulario + lista de tareas pendientes
    - Vista de Completadas: lista de tareas completadas
    - Vista Acerca de: información de la PWA

4. **Pie de Página (Footer)**
    - Información de copyright
    - Botón de instalación (cuando sea aplicable)

---

## ⚙️ Configuración e Instalación

### Prerrequisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (NO funciona con `file://`)
- HTTPS (o localhost para desarrollo)

### Instalación Local

#### Opción 1: Usando Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Opción 2: Usando Node.js
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000
```

#### Opción 3: Usando PHP
```bash
php -S localhost:8000
```

#### Opción 4: Usando Live Server (VS Code)
1. Instalar extensión "Live Server"
2. Click derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Acceso
Abre tu navegador y navega a:
```
http://localhost:8000
```

---

## 🔧 Funcionamiento del Service Worker

### Ciclo de Vida

1. **Instalación (Install)**
   ```javascript
   // Se ejecuta al registrar el SW por primera vez
   - Abre el caché
   - Guarda todos los archivos del App Shell
   - Activa skipWaiting() para control inmediato
   ```

2. **Activación (Activate)**
   ```javascript
   // Se ejecuta cuando el SW toma control
   - Elimina cachés antiguas
   - Ejecuta clients.claim() para controlar páginas existentes
   ```

3. **Interceptación (Fetch)**
   ```javascript
   // Se ejecuta en cada petición HTTP
   - Estrategia: Cache First, fallback a Network
   - Si ambos fallan, retorna index.html (offline)
   ```

### Estrategia de Caché

**Cache First con Network Fallback:**
```
Usuario solicita recurso
    ↓
¿Está en caché?
    ↓ SÍ → Retornar desde caché (rápido)
    ↓ NO
Solicitar a la red
    ↓
¿Respuesta exitosa?
    ↓ SÍ → Guardar en caché y retornar
    ↓ NO → Retornar error o fallback
```

**Ventajas:**
- ⚡ Carga instantánea de recursos cacheados
- 📴 Funcionamiento completo sin conexión
- 🔄 Actualización automática de recursos nuevos

---

## 🌐 Funcionamiento Offline

### Recursos Cacheados (App Shell)
- `index.html` - Página principal
- `styles.css` - Estilos
- `app.js` - Lógica de la aplicación
- `manifest.json` - Configuración PWA
- Íconos principales (192x192 y 512x512)

### Datos Persistentes
Los datos de las tareas se almacenan en **localStorage**, que persiste incluso:
- Sin conexión a internet
- Al cerrar el navegador
- Al reiniciar el dispositivo

```javascript
// Guardar tareas
localStorage.setItem('pwa-tasks', JSON.stringify(tasks));

// Recuperar tareas
const tasks = JSON.parse(localStorage.getItem('pwa-tasks'));
```

---

## 🧪 Cómo Probar el Modo Offline

### Método 1: DevTools de Chrome
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña **Network**
3. Cambia el dropdown a **Offline**
4. Recarga la página (F5)
5. La aplicación debe seguir funcionando

### Método 2: DevTools → Application
1. Abre Chrome DevTools (F12)
2. Ve a **Application** → **Service Workers**
3. Marca la casilla **Offline**
4. Prueba la aplicación

### Método 3: Desconexión Real
1. Desactiva tu WiFi o desconecta el cable de red
2. Recarga la aplicación
3. Debe seguir funcionando normalmente

### Método 4: Modo Avión
1. Activa el modo avión en tu dispositivo
2. Abre la PWA instalada
3. Verifica que funcione completamente

### ✅ Checklist de Pruebas
- [ ] La aplicación carga sin conexión
- [ ] Se pueden agregar nuevas tareas offline
- [ ] Se pueden marcar tareas como completadas offline
- [ ] Se pueden eliminar tareas offline
- [ ] El indicador muestra "Sin conexión"
- [ ] Al reconectar, el indicador cambia a "En línea"
- [ ] Los datos persisten después de recargar

---

## 📱 Instalación como PWA

### En Escritorio (Chrome/Edge)
1. Abre la aplicación en el navegador
2. Busca el ícono ➕ en la barra de direcciones
3. Click en "Instalar" o "Install App"
4. La app se instalará como aplicación de escritorio

### En Android
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma la instalación
4. La app aparecerá en tu cajón de aplicaciones

### En iOS
1. Abre la aplicación en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

**Nota:** El botón de instalación dentro de la app aparecerá automáticamente cuando el navegador detecte que es instalable.

---

## 🔍 Inspección con DevTools

### Ver Service Worker
1. DevTools → **Application** → **Service Workers**
2. Verifica el estado: "activated and running"
3. Puedes ver eventos en tiempo real

### Ver Caché
1. DevTools → **Application** → **Cache Storage**
2. Expande `pwa-todo-v1`
3. Verifica que todos los archivos estén cacheados

### Ver Manifest
1. DevTools → **Application** → **Manifest**
2. Verifica configuración e íconos
3. Revisa la sección "Installability"

### Ver LocalStorage
1. DevTools → **Application** → **Local Storage**
2. Busca la clave `pwa-tasks`
3. Verifica el JSON con las tareas guardadas

---

## 🎯 Criterios de Evaluación Cubiertos

### 1. ✅ Estructura del App Shell
- [x] Menú principal funcional (navegación SPA)
- [x] Encabezado con título e indicador de conexión
- [x] Pie de página con información
- [x] Mínimo 3 vistas de contenido dinámico

### 2. ✅ Service Worker
- [x] Cacheo del App Shell completo
- [x] Funcionamiento offline verificable
- [x] Estrategia Cache First implementada
- [x] Gestión de versiones de caché

### 3. ✅ Archivo de Manifiesto
- [x] manifest.json correctamente configurado
- [x] Íconos en múltiples tamaños (8 tamaños)
- [x] Nombre y short_name definidos
- [x] Colores de tema configurados
- [x] Display mode: standalone

### 4. ✅ Contenido Dinámico
- [x] Lista de tareas CRUD completo
- [x] Persistencia con localStorage
- [x] Actualización sin recarga de página
- [x] Interfaz reactiva a cambios

### 5. ✅ Documentación
- [x] README completo con explicaciones
- [x] Arquitectura documentada
- [x] Instrucciones de configuración
- [x] Guía de pruebas offline
- [x] Comentarios en el código

---

## 🚀 Características Adicionales

### Indicador de Conexión
Muestra en tiempo real si estás online u offline:
- 🟢 Verde: En línea
- 🔴 Rojo: Sin conexión

### Instalación Inteligente
Detecta automáticamente cuando la PWA es instalable y muestra un botón de instalación.

### Responsive Design
Se adapta perfectamente a:
- 📱 Móviles
- 💻 Tablets
- 🖥️ Escritorio

### Persistencia de Datos
Todas las tareas se guardan automáticamente en localStorage.

---

## 🐛 Troubleshooting

### La PWA no funciona offline
- Verifica que el Service Worker esté registrado
- Revisa la consola por errores
- Asegúrate de cargar la página al menos una vez online
- Limpia la caché: DevTools → Application → Clear storage

### El Service Worker no se registra
- **Debe** usarse HTTPS o localhost
- Verifica que `sw.js` esté en la raíz del proyecto
- Revisa errores en la consola
- Asegúrate de que el navegador soporte Service Workers

### No aparece el botón de instalación
- Solo funciona en HTTPS o localhost
- El manifest.json debe ser válido
- Deben existir los íconos especificados
- Algunos navegadores tienen criterios adicionales

### Los cambios no se reflejan
- El Service Worker cachea todo agresivamente
- Cambiar `CACHE_NAME` en `sw.js` fuerza actualización
- O usa: DevTools → Application → Service Workers → "Update"
- O usa modo incógnito para desarrollo

---

## 📚 Conceptos Aprendidos

### App Shell Architecture
Separación entre la estructura (shell) y el contenido dinámico para cargas ultra rápidas.

### Service Workers
Scripts que corren en segundo plano, permitiendo:
- Caché avanzado
- Funcionamiento offline
- Sincronización en background
- Notificaciones push

### Cache API
Almacenamiento de recursos en el navegador:
```javascript
caches.open('nombre') // Abrir caché
cache.add(recurso)    // Agregar recurso
caches.match(petición) // Buscar en caché
```

### Progressive Enhancement
La app funciona básicamente en cualquier navegador, pero aprovecha capacidades avanzadas cuando están disponibles.

---

## 🔗 Referencias

- [MDN - Progressive Web Apps](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
- [Google - Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [MDN - Web App Manifest](https://developer.mozilla.org/es/docs/Web/Manifest)

---

## 👨‍💻 Autor
Práctica desarrollada para la materia de **Aplicaciones Web Progresivas**  
Carrera: Desarrollo y Gestión de Software

---

## 📄 Licencia
Este proyecto es de código abierto para fines educativos.