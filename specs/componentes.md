# Componentes

## Paginas

### LoginForm (`src/pages/LoginForm.jsx`)
- Formulario de login con email y contrasena
- Validacion con Zod (min/max caracteres, formato email)
- react-hook-form para manejo de estado del formulario
- Layout: logo a la izquierda, formulario a la derecha (responsive)

### Clients (`src/pages/Clients.jsx`)
- Dashboard principal: sidebar de clientes + calendario
- Layout: grid de 2 columnas (`300px | 1fr`)
- Maneja CRUD de clientes y coordinacion con el calendario
- Botones de gestion de recordatorios (mensaje y antelacion)
- Muestra skeleton loader durante carga inicial
- Toast de bienvenida cuando clientes y turnos terminan de cargar

## Componentes de UI

### FullCalendar (`src/components/FullCalendar.jsx`)
- Calendario semanal/diario/mensual con FullCalendar
- Timezone: America/Argentina/Buenos_Aires
- Slot de 15 minutos, rango 06:00-22:00
- Drag & drop para mover turnos
- Click en slot vacio → crear turno
- Click en evento → ver detalles (sidebar lateral)
- Drag a DeleteZone → eliminar turno
- Carga turnos: 1 mes atras a 11 meses adelante

### ClientList (`src/components/ClientList.jsx`)
- Lista de clientes con drag & drop (FullCalendar Draggable)
- Cada cliente se puede arrastrar al calendario para crear turno (30min default)
- Botones de editar/eliminar por cliente
- Estado vacio con boton "Agregar cliente"

### DeleteZone (`src/components/DeleteZone.jsx`)
- Zona de eliminacion que aparece al arrastrar un evento del calendario
- Animacion pulse, icono de basura
- Soporte para touch events (mobile)
- Reemplaza el sidebar de clientes mientras se arrastra

### ButtonClientsList (`src/components/ButtonClientsList.jsx`)
- Boton circular con icono (img)
- Variantes: btn-edit, btn-delete, btn-add, btn-logout
- Hover con colores segun variante (accent o error)

### Notification (`src/components/Notification.jsx`)
- Muestra mensajes de error de validacion de formularios
- Acepta string o array de mensajes
- Animacion de entrada (fade in + slide down)

## Modales (NotificationWindows)

### ClientFormPrompt (`utils/NotificationWindows/ClientFormPrompt.js`)
- Formularios para agregar y editar clientes
- Validacion con Zod: nombre (2-32 chars), telefono argentino (+54...)
- Detecta si no hubo cambios al editar

### ShiftFormPrompt (`utils/NotificationWindows/ShiftFormPrompt.js`)
- Formulario para crear turnos
- Combobox de clientes: input de busqueda + select filtrable
- Fecha/hora de inicio con datetime-local
- Duracion con botones +/- (paso de 15min, rango 15min-4h)
- Calcula fecha fin = inicio + duracion (la API recibe inicio y fin)

### ModifyShiftFormPrompt (`utils/NotificationWindows/ModifyShiftFormPrompt.js`)
- Formulario para editar turnos existentes
- Cliente mostrado pero no editable
- Detecta si no hubo cambios (boton deshabilitado)
- Validacion de fechas en tiempo real

### ShiftDetailsSidebar (`utils/NotificationWindows/ShiftDetailsSidebar.js`)
- Sidebar lateral izquierdo con detalles del turno
- Muestra: cliente, telefono, nro turno, inicio, fin, observaciones, sobreturno
- Botones de Modificar y Eliminar en el footer
- Animacion slideIn/slideOut desde la izquierda

### ReminderMessagePrompt (`utils/NotificationWindows/ReminderMessagePrompt.js`)
- Formulario para ver y editar el mensaje de recordatorio
- Textarea fijo (sin resize), validacion 2-200 caracteres
- Contador de caracteres en tiempo real
- Detecta si no hubo cambios

### ReminderAntelacionPrompt (`utils/NotificationWindows/ReminderAntelacionPrompt.js`)
- Formulario para ver y editar las horas de antelacion del recordatorio
- Control con botones -/+ (rango 1-24 horas, entero)
- Botones se deshabilitan en los limites
- Detecta si no hubo cambios

### ConfirmDelete / ConfirmLogOut / ConfirmModify
- Dialogos de confirmacion con reverseButtons: true
- ConfirmDelete advierte sobre eliminacion en cascada de turnos

### AlertError
- Alerta de error con escape HTML (prevencion XSS)
- Lista de errores en el footer
- Mensaje de contactar soporte
