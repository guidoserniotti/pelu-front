# Sistema de Estilos

## Arquitectura

- **Tailwind CSS v4** con `@theme` para design tokens
- **CSS custom** para overrides de FullCalendar y SweetAlert2
- **No se usa CSS modules ni styled-components**

## Archivos

| Archivo | Contenido |
|---|---|
| `src/styles/App.css` | Tokens, estilos globales, keyframes, utilidades |
| `src/styles/calendar.css` | Overrides de FullCalendar |
| `src/styles/swal.css` | Tema de SweetAlert2, formularios, sidebar, recordatorios |

## Design Tokens (`App.css` @theme)

### Colores - Superficies
| Token | Valor | Uso |
|---|---|---|
| `surface-0` | `#0e0f12` | Fondo mas oscuro, inputs |
| `surface-1` | `#15171b` | Fondo calendario |
| `surface-2` | `#1e2127` | Cards, sidebar, modales |
| `surface-3` | `#2a2f37` | Inputs, botones secundarios |
| `surface-contrast` | `#f7f8fa` | Texto sobre fondos claros |

### Colores - Texto
| Token | Valor | Uso |
|---|---|---|
| `text-strong` | `#0e0f12` | Texto sobre botones dorados |
| `text-muted` | `#6b7280` | Labels, texto secundario |
| `text-inverse` | `#e8eaed` | Texto principal (claro sobre oscuro) |

### Colores - Acento
| Token | Valor | Uso |
|---|---|---|
| `accent` | `#d4af37` | Botones primarios, indicadores, badges |
| `accent-hover` | `#b89b31` | Hover de botones primarios |

### Colores - Estado
| Token | Valor | Uso |
|---|---|---|
| `error` | `#e53935` | Errores, eliminar |
| `error-dark` | `#c62828` | Hover de eliminar |
| `success` | `#00e676` | Toasts de exito |
| `info` | `#00b2ff` | Toasts informativos |

### Tipografia
| Token | Valor | Uso |
|---|---|---|
| `font-sans` | Inter | Cuerpo, inputs, labels |
| `font-title` | Poppins | Titulos, headings |

### Bordes y Sombras
| Token | Valor |
|---|---|
| `border-light` | `rgba(0,0,0,0.08)` |
| `border-dark` | `rgba(255,255,255,0.08)` |
| `shadow-strong` | `0 10px 30px rgba(0,0,0,0.55)` |
| `shadow-card` | `0 10px 25px rgba(0,0,0,0.5)` |
| `radius-sm/md/lg` | `5px / 8px / 12px` |

## Fondo Global

```css
background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
    url("backGround.png") center / cover fixed no-repeat;
```

## Keyframes Custom
- `notif-enter` - Entrada de notificaciones (fade + slide)
- `pulse-delete` - Pulso de la zona de eliminacion
- Respeta `prefers-reduced-motion`

## Responsive

Se usan los prefijos de Tailwind: `max-xl`, `max-lg`, `max-md`, `max-sm`.
El calendario tiene media queries en `calendar.css` para 1024px, 768px y 640px.
