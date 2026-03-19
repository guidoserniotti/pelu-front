# Dependencias

## Produccion

| Paquete | Version | Proposito |
|---|---|---|
| `react` | ^19.1.1 | Framework UI |
| `react-dom` | ^19.1.1 | Renderizado DOM |
| `react-router-dom` | ^7.9.4 | Routing SPA |
| `axios` | ^1.12.2 | Cliente HTTP con interceptors |
| `jwt-decode` | ^4.0.0 | Decodificacion de tokens JWT |
| `@fullcalendar/react` | ^6.1.19 | Componente calendario |
| `@fullcalendar/core` | ^6.1.19 | Core del calendario |
| `@fullcalendar/daygrid` | ^6.1.19 | Vista mensual |
| `@fullcalendar/timegrid` | ^6.1.19 | Vista semanal/diaria |
| `@fullcalendar/interaction` | ^6.1.19 | Drag & drop, seleccion |
| `@fullcalendar/moment-timezone` | ^6.1.19 | Soporte timezone |
| `sweetalert2` | ^11.26.3 | Modales y dialogos |
| `sweetalert2-react-content` | ^5.1.0 | Wrapper React para Swal |
| `react-hook-form` | ^7.66.1 | Manejo de formularios |
| `@hookform/resolvers` | ^5.2.2 | Adaptador Zod para RHF |
| `zod` | ^4.1.13 | Validacion de schemas |
| `react-toastify` | ^11.0.5 | Notificaciones toast |
| `tailwindcss` | ^4.2.1 | Framework CSS utilitario |
| `@tailwindcss/vite` | ^4.2.1 | Plugin Tailwind para Vite |

## Desarrollo

| Paquete | Version | Proposito |
|---|---|---|
| `vite` | ^7.1.7 | Build tool + dev server |
| `@vitejs/plugin-react-swc` | ^4.1.0 | Fast refresh con SWC |
| `eslint` | ^9.36.0 | Linter |
| `eslint-plugin-react` | ^7.37.5 | Reglas ESLint para React |
| `@eslint/js` | ^9.29.0 | Config base ESLint |
| `globals` | ^16.2.0 | Variables globales para ESLint |
| `@types/react` | ^19.1.8 | Tipos TS (para IDE) |
| `@types/react-dom` | ^19.1.6 | Tipos TS (para IDE) |
| `eslint-plugin-react-hooks` | ^5.2.0 | Reglas de hooks |
| `eslint-plugin-react-refresh` | ^0.4.20 | Validacion HMR |

## Scripts

```bash
npm run dev       # Servidor de desarrollo (Vite)
npm run build     # Build de produccion (dist/)
npm run preview   # Preview del build
npm run lint      # Ejecutar ESLint
```
