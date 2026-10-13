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
| 12 | Design system | `styleguide.html` + `styleguide.css` + `styleguide.js`: cargan el **mismo** `style.css` y leen los tokens con `getComputedStyle`, así la guía no se desfasa | Un solo origen de verdad | Documentar valores a mano | supuesto |

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

## Pendiente
- Comparar con el archivo de Figma: las medidas salen de las capturas, no de Dev Mode.
- Decidir el tamaño del precio (24px o ~22px) cuando haya acceso a Figma.
- En móvil el select muestra "Todas l…" (recortado) para mantener el encabezado en una fila.
- Probar foco por teclado y hover en el navegador real.
- Revisión final (Checklist 4) y repaso de explicación (Checklist 5).
