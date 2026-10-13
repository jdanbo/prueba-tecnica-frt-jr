# Proceso de Entendimiento de Prueba

## Objetivo
Recrear el catalogo de productos de NovaTech

## Single Page Application
    Header
        Nombre de la tienda
        Buscador + input
            Filtrar tarjetas por nombre mientras escribe
        Filtro
            Por categoría
    Grilla de productos
        Nombre producto
        Categoria
        Precio
        Descripcion
        Fotografía de prudcto - solid color
        Etiqueta de Producto Destacado
    Alerta 
        Confirmacion de categoria
        Error - "Su nombre no coincide con ningun producto"
    Cart 
        Contador de agregados - attached con el +
    Responsive
    Categorias
        Audio
        Perífericos
        Pantallas
        Accesorios

### Referir CSS al diseño figma
    Recrear Design System antes
    Datos de producto proporcionados

## Estructura requerida
    index.html
    style.css
    script.js
    data.js
        datos.productos
        novatech-productos.json

## Requerimientos
    Productos se muestran en base al json
    Buscador y Filtro funcionando
    Codigo ordenado por capas
    Se parezca al diseño

### Enlace Figma
https://www.figma.com/design/VCvcwfUKuZzxox2f2k3ES8/Prueba-Tecnica-JR

### SPA Proporcionada
![NovaTech1](assets\image.png)

## Proceso de Creación

Regla: tokens primero, de lo pequeño a lo grande, y cada paso se compara con la captura antes del siguiente.

| # | Paso | Qué se hace | Entrega |
|---|---|---|---|
| 1 | Entendimiento | Leer este archivo, el README y las capturas de `assets/capturasNovaTech` | Lista de componentes y comportamientos (arriba) |
| 2 | Entorno Claude Code | Abrir la carpeta del proyecto, servidor local y navegador para verificar | Entorno listo |
| 3 | Toma de decisiones | Una sola ronda de preguntas con valor por defecto; lo no respondido queda como supuesto | `DECISIONES.md` |
| 4 | Design System | Tokens en dos capas (primitivos y semánticos) y los componentes con sus estados | Capa 1 de `style.css` y `design-system/` |
| 5 | Pantalla base | HTML semántico, grilla y tarjetas generadas desde `data.js` | `index.html`, tarjetas en `script.js` |
| 6 | Buscador y filtro | Estado único, función pura `obtenerVisibles()` y `render()` | Filtra por nombre y por categoría |
| 7 | Alertas | Confirmación de categoría y error de búsqueda sin resultados | Aviso flotante y bloque de error |
| 8 | Carrito | Contador, agregar, quitar y total | Botón con minimenú |
| 9 | Responsive | Grilla fluida y encabezado en una fila, probado de 320 a 1440px | Sin scroll horizontal |
| 10 | Comparación con el diseño | Medir cada sección contra las capturas y registrar las diferencias | Tabla en `DECISIONES.md` |
| 11 | Revisión de código | Checklist: sin valores sueltos fuera de los tokens, foco visible, sin código muerto; ensayar la explicación | Código listo para entregar |

## Estructura final

    index.html            página (estructura requerida)
    style.css             tokens, base, layout, componentes, responsive
    script.js             estado, funciones puras, render, carrito, eventos
    data.js               datos.productos y datos.categorias
    novatech-productos.json
    design-system/        guía visual; usa el mismo style.css de la raíz
        index.html
        styleguide.css
        styleguide.js
    assets/               capturas de referencia y favicon.svg
    DECISIONES.md         registro detallado de cada decisión

## Decisiones propias

Objetivo: el código más parecido posible al diseño original, con las mejoras justas. Lo que el diseño trae se respeta; lo que no trae se decide aquí y se marca como propio.

### Qué viene del diseño y qué es propio

| Elemento | Origen | Nota |
|---|---|---|
| Encabezado, buscador, select, título y contador "10 productos" | Diseño | Encabezado de 72px y controles de 40px (se midió ~98 y 44 en la captura; se compactó a pedido) |
| Tarjeta: color, icono, etiqueta, nombre, chip, descripción, precio y botón | Diseño | Medidas tomadas de las capturas y estimadas |
| Colores, tipografía Inter, radios | Diseño | Ver tokens en `style.css` |
| **Carrito con minimenú** (lista, cantidades, quitar y total) | **Propio** | El diseño solo pide un contador; el menú lo hace útil sin añadir pantallas |
| **Aviso flotante** para categoría, agregado y eliminado | **Propio** | Confirma cada acción sin mover el contenido |
| **Bloque de error** con icono rojo | **Propio** | El diseño no lo muestra; el texto sí viene de los requisitos |
| **Flecha propia del select** | **Propio** | Mismo aspecto en todos los navegadores |
| **Responsive** (4 · 3 · 2 · 1 columnas) | **Propio** | El diseño solo trae desktop. En móvil el minimenú del carrito ocupa el ancho del contenedor, con los mismos márgenes de la página |
| **Favicon y metaetiquetas** (`description`, `theme-color`, Open Graph, Twitter) | **Propio** | El favicon es el logo de NovaTech en `assets/favicon.svg`; el diseño no lo define |
| **Design system en código** (`design-system/`) | **Propio** | Documenta tokens y componentes con el CSS real |

### Sombras

| Token | Valor | Dónde | Origen |
|---|---|---|---|
| `--shadow-header` | `0 1px 3px rgb(0 0 0 / 8%)` | Encabezado | Estimada de la captura |
| `--shadow-card` | `0 1px 3px rgb(0 0 0 / 6%)` + borde de 1px `--color-border` | Tarjeta en reposo | Estimada de la captura |
| `--shadow-card-hover` | `0 6px 18px rgb(0 0 0 / 12%)` + borde de 1px | Tarjeta al pasar el cursor | Propia |
| `--shadow-popover` | `0 8px 24px rgb(0 0 0 / 14%)` + borde de 1px | Minimenú del carrito y aviso flotante | Propia |

### Interacciones

| Elemento | Interacción | Detalle |
|---|---|---|
| Tarjeta | Hover | Sube 2px y gana sombra, 150ms |
| Botón "+ Agregar" | Hover | Fondo `--color-action-hover` |
| Todo lo interactivo | Foco por teclado | Contorno de 2px en `--color-action`, separado 2px |
| Buscador | Escribir | Filtra en cada tecla; sin coincidencias aparece el bloque de error |
| Select | Cambiar | Filtra y muestra el aviso "Mostrando Audio · 3 productos" |
| Botón del carrito | Clic | Abre y cierra el minimenú; el contador solo se ve si hay productos |
| Minimenú | Clic fuera o Escape | Se cierra; con Escape el foco vuelve al botón |
| × de cada producto | Clic | Lo quita, recalcula el total y avisa; hover en rojo |
| Aviso flotante | Automático | Aparece con desvanecido y se oculta a los 2.5s |
| Movimiento | `prefers-reduced-motion` | Se desactivan las transiciones |

Accesibilidad que acompaña: `label` en cada control, `aria-label` en botones de icono, `aria-expanded` en el carrito, `role="alert"` en el error y `aria-live` en el aviso.