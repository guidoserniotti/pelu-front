# Thomas del Arco - Turnos

App de gestión de turnos y clientes para peluquería. Construida con React 19 + Vite 7.

## Stack

- **React 19** con SWC para Fast Refresh
- **Vite 7** como bundler
- **Tailwind CSS 4** para estilos
- **FullCalendar** para el calendario de turnos
- **React Router DOM** para navegación
- **React Hook Form + Zod** para formularios y validación
- **Axios** para llamadas a la API
- **vite-plugin-pwa** para Progressive Web App

## Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Linter
```

## PWA

La app es instalable como Progressive Web App. La configuración se encuentra en `vite.config.js` usando `vite-plugin-pwa`.

**Características:**
- Instalable en dispositivos (Android, iOS, desktop)
- App shell cacheado para carga rápida
- Página offline (`public/offline.html`) cuando no hay conexión
- Auto-update del service worker (sin intervención del usuario)
- Cache de Google Fonts

**Iconos PWA:** se encuentran en `public/` y fueron generados a partir del logo en `assets/logos-thomi/`. Para regenerarlos:

```bash
convert "assets/logos-thomi/IDENTIDAD_Thomas del Arco_8 copia.png" -resize 192x192 public/pwa-192x192.png
convert "assets/logos-thomi/IDENTIDAD_Thomas del Arco_8 copia.png" -resize 512x512 public/pwa-512x512.png
```

**Verificar PWA:** después de `npm run build && npm run preview`, abrir Chrome DevTools > Application para comprobar el manifest y el service worker.
