# Arquitectura del Proyecto

## Stack Tecnologico

- **Framework:** React 19 + Vite 7
- **Estilos:** Tailwind CSS v4 (con @theme tokens) + CSS custom para overrides
- **Calendario:** FullCalendar 6 (daygrid, timegrid, interaction, moment-timezone)
- **Modales/Alertas:** SweetAlert2
- **Notificaciones:** react-toastify
- **Formularios:** react-hook-form + Zod (validacion)
- **HTTP:** Axios (con interceptors para auth)
- **Auth:** JWT (jwt-decode) + React Context
- **Routing:** React Router v7
- **Deploy:** Vercel (SPA rewrite)

## Estructura de Carpetas

```
src/
├── auth/              # Context y Provider de autenticacion
├── components/        # Componentes reutilizables (UI)
├── hooks/             # Custom hooks (useTokenValidation)
├── pages/             # Paginas/vistas principales
├── routes/            # Definicion de rutas y ProtectedRoute
├── services/          # Llamadas a la API (clients, shifts, login, reminders)
├── styles/            # CSS global, calendario y modales
└── utils/             # Configuracion de Axios, JWT, SweetAlert, toastify
    ├── NotificationWindows/  # Modales (formularios, confirmaciones, alertas)
    └── toastify/             # Config y mensajes de toasts
```

## Flujo de Datos

```
Usuario → Componente (React) → Service (Axios) → API Backend
                                    ↓
                              Interceptor agrega JWT
                              Interceptor maneja 401 → logout
```

## Patron de Estado

- **Auth global:** React Context (AuthProvider)
- **Estado local:** useState/useRef en componentes
- **No se usa Redux ni state managers externos**

## Variables de Entorno

| Variable | Descripcion | Default |
|---|---|---|
| `VITE_URL_BACK` | URL del backend | `http://localhost:3000` |

## Proxy en Desarrollo

Vite redirige `/api` al backend configurado en `VITE_URL_BACK`.
