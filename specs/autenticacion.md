# Sistema de Autenticacion

## Flujo

1. Usuario ingresa email + contrasena en `/login`
2. Se envia POST a `/api/auth/login`
3. Backend responde con JWT
4. Se decodifica el JWT y se extrae: `id`, `email`, `rol`
5. Se guarda en localStorage como `loggedUser` (JSON string con id, token, email, role)
6. Se redirige a `/clients`

## AuthProvider (`src/auth/AuthProvider.jsx`)

### Estado
```js
user: { id, email, rol, token } | null
token: string | null
loading: boolean
```

### Funciones expuestas via Context
- `login(tokenData)` - Decodifica JWT, guarda en localStorage, navega a /clients
- `logout(isExpired)` - Limpia estado, localStorage, redirige a /login
- `isAuthenticated()` - Retorna boolean
- `user` - Datos del usuario actual
- `loading` - Estado de carga inicial

## ProtectedRoute (`src/routes/ProtectedRoute.jsx`)

- Wrappea las rutas que requieren autenticacion
- Verifica token en localStorage al montar
- Si el token expiro, hace logout automatico
- Muestra spinner de carga mientras valida

## Validacion de Token

### En el cliente
- `useTokenValidation` hook: valida cada 60 segundos
- `isTokenExpired(token)` en `utils/config.js`: compara `exp` del JWT con `Date.now()`

### En Axios (interceptor)
- Request: agrega header `Authorization: Bearer {token}`
- Response: si recibe 401, limpia localStorage y redirige a /login

## Rutas

| Ruta | Componente | Protegida |
|---|---|---|
| `/login` | LoginForm | No |
| `/clients` | Clients | Si |
| `/*` | Redirect a /login | - |

## Almacenamiento

- **Key:** `loggedUser`
- **Valor:** `JSON.stringify({ id, token, email, role })`
- Se parsea con `JSON.parse` en cada acceso (con try-catch)
