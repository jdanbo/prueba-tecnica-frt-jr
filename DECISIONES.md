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
| 7 | Alertas | **Aviso flotante** (`.toast`, abajo al centro, 2.5 s) para eventos: categoría elegida, producto agregado, producto eliminado. **Bloque de error** (`.alert`, rojo, con icono) para "sin coincidencias", permanente mientras el estado no tenga resultados | El aviso gris en línea pasaba desapercibido; un evento puntual necesita aviso temporal y un estado necesita un mensaje que se quede | Recuadro gris sobre la grilla | confirmada (ajuste pedido) |
| 8 | Carrito | Botón con icono y contador; al pulsarlo abre un minimenú con los productos, cantidad, subtotal, botón × para quitar y **total**. Cierra con clic fuera o Escape. El carrito es un `Map` id → cantidad dentro del estado | Minimalista y simple (ajuste pedido); unidades y total se derivan, no se guardan | Panel lateral, contador suelto | confirmada |
| 9 | Error de búsqueda | "Su nombre no coincide con ningún producto" | Texto de ENTENDIMIENTO.md | Texto propio | confirmada |
| 10 | Responsive | Grilla `repeat(auto-fill, minmax(min(100%, var(--card-min)), 1fr))` con `--card-min: 16rem`: da 4 · 3 · 2 · 1 columnas sin breakpoints. Encabezado **siempre en una fila**: el buscador absorbe el espacio, el select se encoge y en móvil solo queda el logo | Las tarjetas se cortaban: el buscador (336px) y el select (230px) fijos ensanchaban la página, y las columnas fijas no cedían | Columnas fijas por breakpoint; encabezado en dos filas | confirmada |
| 11 | Tamaños de encabezado | 72px de alto y controles de 40px (antes 98 y 44) | Pedido de verlo más compacto; el select ahora tiene flecha propia y 208px | Valores medidos de la captura (98/44) | confirmada (ajuste pedido) |

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
Estado único (`estado`: búsqueda, categoría y `carrito`) → funciones puras (`obtenerVisibles`, `contarUnidades`, `calcularTotal`) → `render()` y `renderCarrito()`. Los eventos solo cambian el estado y vuelven a pintar. El texto de los datos entra con `textContent`.
Agregar o quitar del carrito repinta solo el carrito, sin reconstruir las tarjetas. El cierre del menú usa `composedPath()` porque el botón × se reemplaza al repintar.



## Revisión final

| Punto | Resultado |
|---|---|
| Ningún color, tamaño o espaciado fuera de los tokens | Corregido. Había ~25 valores sueltos en rem y 3 interlineados; ahora son tokens. Quedan solo los bordes de 1px, la técnica `visually-hidden` y los puntos de corte de las media queries (no admiten `var()`) |
| HTML semántico | Ok. `header`, `main`, `ul/li`, `label` en cada control, `h1` > `h2` > `h3`. Se agregó `<form role="search">` alrededor del buscador y el filtro, con `preventDefault` en `submit` para que Enter no recargue la página |
| Imágenes con `width`, `height`, `alt` | No aplica: no hay `<img>`; los SVG son decorativos con `aria-hidden` |
| `:focus-visible` en todo lo interactivo | Ok (regla global). Se agregó el foco al quitar un producto: pasa al siguiente × o al botón del carrito |
| Objetivos táctiles ≥ 24px | Ok: el menor es el × del carrito (28px); botones y campos miden 40px |
| Contraste de texto (4.5:1) | Corregido. El gris tenue `#6b7280` daba 4.47 y 4.23 sobre fondos grises; ahora `#666c7a` da 4.61 como mínimo. Resto de pares: 4.83 a 15.5 |
| Contraste de controles (3:1) | **No cumple, decisión consciente.** El borde del select da 1.25:1 y el fondo del buscador 1.06:1. Es el estilo del diseño; oscurecerlos lo aleja de la captura. Mitigan el icono, el placeholder y el contorno de foco (5.67:1) |
| Iconos blancos sobre el color del producto | El del Hub USB-C (naranja) da 2.48:1. Es decorativo y el nombre del producto está en texto, por eso se deja |
| Sin `console.log`, sin código muerto | Ok. Se quitó el token `--fw-regular` (sin uso) y una regla móvil duplicada. Sin `console.*`, `TODO` ni clases sin usar |
| Probado a 390, 768 y 1280px | Ok: 1, 2 y 4 columnas, sin scroll horizontal, encabezado en una fila, sin tarjetas cortadas |
| Filtros, búsqueda y estado vacío | Ok: 4 categorías, búsqueda sin distinguir mayúsculas, espacios solos, combinación de ambos, error sin resultados |
| Nombres claros y consistentes (BEM) | Ok. `.catalogo__*` pasó a `.catalog__*` para dejar todas las clases en inglés |
| Seguridad | Ok. Los textos de los datos entran con `textContent`; el único `innerHTML` inserta los trazos fijos de los iconos |
| README breve | **Pendiente.** `README.md` es el enunciado de la prueba y no se tocó; el resumen del proyecto está en `ENTENDIMIENTO.md` |

Probado en el navegador integrado del panel, no en un navegador real ni en un teléfono. El foco por teclado se verificó por código y con eventos simulados.
