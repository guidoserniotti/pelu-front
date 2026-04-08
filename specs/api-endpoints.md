# API Endpoints

Todas las llamadas pasan por Axios con interceptor que agrega `Authorization: Bearer {token}`.
En 401, el interceptor hace logout automatico.

## Autenticacion

| Metodo | Endpoint | Body | Respuesta |
|---|---|---|---|
| POST | `/api/auth/login` | `{ email, contrasena }` | `{ id, data: token, role }` |

## Clientes

| Metodo | Endpoint | Body / Params | Respuesta |
|---|---|---|---|
| GET | `/api/cliente?pagina=1&limite=100` | - | `{ listado_clientes: [{ id, nombre_completo, telefono, esta_eliminado }] }` |
| POST | `/api/cliente/registrar` | `{ nombre_completo, telefono }` | `{ data: { id, nombre_completo, telefono, esta_eliminado } }` |
| PATCH | `/api/cliente/editar/{id}` | `{ nombre_completo, telefono }` | Cliente actualizado |
| DELETE | `/api/cliente/eliminar/{id}` | - | - |

## Turnos

| Metodo | Endpoint | Body / Params | Respuesta |
|---|---|---|---|
| GET | `/api/turno/listar?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD` | - | `{ listado_turnos: [{ id, nro_turno, fecha_hora_inicio_turno, fecha_hora_fin_turno, observaciones, es_sobreturno, cliente: { nombre_completo, telefono }, tomadoPor: { nombre_completo } }] }` |
| POST | `/api/turno/registrar` | `{ fecha_hora_inicio_turno, fecha_hora_fin_turno, cliente_id, usuario_id, es_sobreturno, observaciones? }` | Turno creado |
| PUT | `/api/turno/editar/{id}` | `{ fecha_hora_inicio_turno, fecha_hora_fin_turno, observaciones }` | Turno actualizado |
| DELETE | `/api/turno/eliminar/{id}` | - | - |

## Recordatorios

| Metodo | Endpoint | Body | Respuesta |
|---|---|---|---|
| GET | `/api/recordatorio/mensaje` | - | `{ mensaje }` |
| PUT | `/api/recordatorio/mensaje` | `{ mensaje }` | Mensaje actualizado |
| GET | `/api/recordatorio/antelacion` | - | `{ horas_antelacion }` |
| PUT | `/api/recordatorio/antelacion` | `{ horas_antelacion }` | Antelacion actualizada |

## Notas

- `usuario_id` se obtiene del JWT decodificado via `getUserId()`
- Las fechas se envian en formato ISO 8601 (`.toISOString()`)
- El rango de carga de turnos es 1 mes atras a 11 meses adelante
- Telefono siempre se envia con prefijo `+` (ej: `+5491112345678`)
