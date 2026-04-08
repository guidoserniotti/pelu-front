# Sistema de Notificaciones

## Dos sistemas complementarios

| Sistema | Libreria | Uso |
|---|---|---|
| **Toasts** | react-toastify | Feedback rapido (exito, error, info, warning) |
| **Modales** | SweetAlert2 | Formularios, confirmaciones, detalles |

## Toasts (react-toastify)

### Configuracion (`utils/toastify/toastConfig.js`)

#### `showToast(type, message, options)`
- Tipos: success, error, info, warning
- Posicion default: top-center
- Auto-close: 2500ms

#### `promiseToast(promise, messageKey, toastId)`
- Envuelve operaciones async con estados: pending → success/error
- Extrae mensajes de error del backend automaticamente
- Acepta key de PROMISE_MESSAGES o objeto custom `{ pending, success, error }`

#### `showValidation(validationKey)`
- Muestra toast de error para validaciones del lado cliente

#### `showInstantMessage(messageKey, param)`
- Mensajes instantaneos (ej: sesion expirada)

### Mensajes (`utils/toastify/toastMessages.js`)

#### PROMISE_MESSAGES (para promiseToast)
- `AUTH_LOGIN` - Login exitoso/fallido
- `TURNO_CREATE`, `TURNO_UPDATE`, `TURNO_DELETE` - CRUD de turnos
- `CLIENTE_CREATE`, `CLIENTE_UPDATE`, `CLIENTE_DELETE` - CRUD de clientes

#### VALIDATION_MESSAGES
- `FECHA_PASADA` - No se puede agendar en el pasado
- `NO_CLIENTES` - No hay clientes registrados
- `CLIENTE_NO_IDENTIFICADO` - Cliente no encontrado
- `TURNO_MOVER_PASADO` - No se puede mover turno al pasado
- `TURNO_REDIMENSIONAR_PASADO` - No se puede redimensionar al pasado

#### createDynamicMessage
Funciones que generan mensajes personalizados con nombre del cliente:
- `clientAdd(nombre)`, `clientEdit(nombre)`, `clientDeleted(nombre)`
- `shiftCreate(nombre)`, `shiftUpdate(nombre)`, `turnoDeleted(nombre)`

## Modales (SweetAlert2)

### Tema (`utils/swalTheme.js`)
ThemedSwal es un mixin de Swal con clases CSS custom que aplican el tema oscuro dorado.

### Consistencia de botones
Todos los modales con Confirmar/Cancelar usan `reverseButtons: true`:
- Cancelar a la izquierda
- Accion principal a la derecha

### Tipos de modales
| Modal | Tipo | Botones |
|---|---|---|
| ClientFormPrompt (agregar) | Formulario | Cancelar / Agregar |
| ClientFormPrompt (editar) | Formulario | Cancelar / Actualizar |
| ShiftFormPrompt | Formulario | Cancelar / Crear Turno |
| ModifyShiftFormPrompt | Formulario | Cancelar / Modificar Turno |
| ConfirmDelete | Confirmacion | Cancelar / Si, eliminar |
| ConfirmLogOut | Confirmacion | Cancelar / Si, cerrar sesion |
| ConfirmModify | Confirmacion | Cancelar / Si, modificar |
| ShiftDetailsSidebar | Detalle | Modificar / Eliminar (footer) |
| ReminderMessagePrompt | Formulario | Cancelar / Guardar |
| ReminderAntelacionPrompt | Formulario | Cancelar / Guardar |
| AlertError | Alerta | Cerrar |
