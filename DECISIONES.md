# Decisiones · NovaTech

Estados: **supuesto** (valor por defecto de la Ronda 1, sin confirmar) · **medida/estimada** (de las capturas).

| # | Decisión | Qué hice | Por qué | Descartado | Estado |
|---|---|---|---|---|---|
| 1 | Alcance | Una sola pantalla | Lo pide el enunciado | Páginas extra | supuesto |
| 2 | Fuente de diseño | Solo las 2 capturas de `assets/capturasNovaTech` | Sin Dev Mode ni conector | Medir en Figma | supuesto |
| 3 | Estructura | `index.html`, `style.css`, `script.js`, `data.js` planos | Es lo que pide el enunciado | Carpetas `css/` y `js/` del kit | supuesto |
| 4 | Agentes del kit | No; todo en la sesión principal | Proyecto chico | `bootstrap.ps1` y 5 agentes | supuesto |
| 5 | Tipografía | Inter (Google Fonts) con fallback a fuente del sistema | Se parece a la captura | Solo fuente del sistema | supuesto |
| 6 | Iconos | SVG inline de trazo, en `script.js` (`ICONOS`) | Sin imágenes ni dependencias | Librería de iconos | supuesto |
| 7 | Alerta de categoría | Aviso arriba de la grilla: "Mostrando: Audio · 3 productos"; se oculta a los 3 s (`DURACION_ALERTA_MS`) y solo sale al cambiar el select, no al escribir | Es un evento puntual; el error de "sin resultados" sí depende del estado y se queda | Toast flotante | supuesto |
| 8 | Carrito | Contador "Agregados" en el encabezado | Pedido en ENTENDIMIENTO.md | Panel de carrito | supuesto |
| 9 | Error de búsqueda | "Su nombre no coincide con ningún producto" | Texto de ENTENDIMIENTO.md | Texto propio | confirmada |
| 10 | Breakpoints | 4 col ≥1200 · 3 col ≥900 · 2 col ≥600 · 1 col <600; en móvil el buscador baja a otra fila | El diseño no trae tablet ni móvil | Grilla `auto-fill` | supuesto |

## Revisión por secciones (referencia x 1.385 = 1440px)
Factor: `HOME.PNG` mide 1040px de ancho y la tarjeta ampliada da 2.34x; ambos llevan a un frame de 1440px.

| Sección | Referencia | Resultado | Estado |
|---|---|---|---|
| Contenedor | 1200px | 1200px | ok |
| Encabezado | ~98px | 98px | ok |
| Logo / marca | 36px / ~22px | 36px / 22px | ok |
| Buscador | ~336x44 | 336x44 | ok |
| Select | ~230x44 | 230x44 | ok |
| Título "Catálogo" | 32px/700 | 32px/700 | ok |
| Tarjeta | 282x~277 | 282x284 | ok (+7px) |
| Bloque de color | 96px | 96px | ok |
| Botón Agregar | ~100x40, radio ~10 | 100x40, radio 10 | ok |
| Etiqueta Destacado | ~69x22, a 12px del borde | ~69x22, 12px | ok |
| Chip | ~47x20, fuente 11px | ~47x20, 11px | ok |
| Precio | ~56px de ancho | 64px (24px/700) | diferencia: la captura sugiere ~21-22px de fuente, pero la altura de las cifras sugiere 24px |

El contador "Agregados" no está en el diseño, así que empuja el buscador y el select hacia la izquierda respecto a la captura.

## Arquitectura de `script.js`
Estado único (`estado`) → `obtenerVisibles()` (función pura) → `render()`. Los eventos solo cambian el estado y vuelven a pintar. El texto de los datos entra con `textContent`.
`agregar()` actualiza solo el contador, sin reconstruir las tarjetas.

## Pendiente
- Comparar con el archivo de Figma: las medidas salen de las capturas, no de Dev Mode.
- Decidir el tamaño del precio (24px o ~22px) cuando haya acceso a Figma.
- Revisión final (Checklist 4) y repaso de explicación (Checklist 5).
