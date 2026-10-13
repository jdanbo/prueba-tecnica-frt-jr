// =========================================================
//  Catálogo de Productos - NovaTech
//  Capas: Estado · Datos puros · Render · Carrito · Eventos · Arranque
//  La pantalla siempre se pinta desde el objeto "estado".
// =========================================================

// ---------- Referencias al DOM ----------
const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const selectCategoria = document.getElementById("categoria");
const contador = document.getElementById("contador");
const alerta = document.getElementById("alerta");
const aviso = document.getElementById("aviso");
const carritoBtn = document.getElementById("carrito-btn");
const carritoMenu = document.getElementById("carrito-menu");
const carritoContador = document.getElementById("carrito-contador");
const carritoLista = document.getElementById("carrito-lista");
const carritoVacio = document.getElementById("carrito-vacio");
const carritoTotal = document.getElementById("carrito-total");

// ---------- Estado único ----------
// carrito: Map id de producto -> cantidad (todo lo demás del carrito se deriva de aquí)
const estado = { busqueda: "", categoria: "todas", carrito: new Map() };

const DURACION_AVISO_MS = 2500;
let temporizadorAviso;

// ---------- Iconos (SVG de trazo, uno por producto según su id) ----------
const ICONOS = {
  1: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="2"/><rect x="17" y="14" width="4" height="7" rx="2"/>',
  2: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="14.5" r="3.5"/><circle cx="12" cy="7" r="1"/>',
  3: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10"/>',
  4: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
  5: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  6: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  7: '<circle cx="12" cy="10" r="7"/><circle cx="12" cy="10" r="3"/><path d="M8 21h8M12 17v4"/>',
  8: '<path d="M4 20 20 4M20 4h-4M20 4v4M4 20v-4M4 20h4M12 12l3 3"/><circle cx="9" cy="9" r="1.5"/>',
  9: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  10: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
};

// ---------- Datos: funciones puras (misma entrada, misma salida) ----------
function obtenerVisibles() {
  const texto = estado.busqueda.trim().toLowerCase();
  return datos.productos.filter((p) =>
    p.nombre.toLowerCase().includes(texto) &&
    (estado.categoria === "todas" || p.categoria === estado.categoria)
  );
}

function buscarProducto(id) {
  return datos.productos.find((p) => p.id === id);
}

function contarUnidades() {
  let unidades = 0;
  estado.carrito.forEach((cantidad) => { unidades += cantidad; });
  return unidades;
}

function calcularTotal() {
  let total = 0;
  estado.carrito.forEach((cantidad, id) => { total += buscarProducto(id).precio * cantidad; });
  return total;
}

function formatearPrecio(valor) {
  return datos.moneda + valor.toLocaleString("en-US");
}

function plural(cantidad, singular, pluralTexto) {
  return cantidad + " " + (cantidad === 1 ? singular : pluralTexto);
}

// ---------- Render ----------
// Crea nodos con textContent (nunca innerHTML con datos) para no inyectar HTML.
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function crearSvg(contenido, tamano, grosor) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", tamano);
  svg.setAttribute("height", tamano);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", grosor);
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = contenido; // contenido propio del código, no de los datos
  return svg;
}

function crearTarjeta(producto) {
  const tarjeta = crear("li", "card");

  const media = crear("div", "card__media");
  media.style.setProperty("--producto-color", producto.color);
  media.append(crearSvg(ICONOS[producto.id] || "", 40, 1.5));
  if (producto.destacado) media.append(crear("span", "badge", "Destacado"));

  const cuerpo = crear("div", "card__body");
  const pie = crear("div", "card__footer");

  const boton = crear("button", "btn", "+ Agregar");
  boton.type = "button";
  boton.setAttribute("aria-label", "Agregar " + producto.nombre);
  boton.addEventListener("click", () => agregar(producto.id));

  pie.append(crear("span", "card__price", formatearPrecio(producto.precio)), boton);
  cuerpo.append(
    crear("h3", "card__name", producto.nombre),
    crear("span", "chip", producto.categoria),
    crear("p", "card__desc", producto.descripcion),
    pie
  );

  tarjeta.append(media, cuerpo);
  return tarjeta;
}

function render() {
  const lista = obtenerVisibles();
  catalogo.replaceChildren(...lista.map(crearTarjeta));
  contador.textContent = plural(lista.length, "producto", "productos");
  alerta.hidden = lista.length > 0; // el error depende del estado, por eso es permanente
}

// Aviso flotante para eventos puntuales (categoría, agregado, eliminado)
function avisar(texto) {
  aviso.textContent = texto;
  aviso.classList.add("toast--visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("toast--visible"), DURACION_AVISO_MS);
}

// ---------- Carrito ----------
function crearItemCarrito(id, cantidad) {
  const producto = buscarProducto(id);
  const item = crear("li", "cart-item");

  const info = crear("div");
  info.append(
    crear("span", "cart-item__name", producto.nombre),
    crear("span", "cart-item__detail", cantidad + " × " + formatearPrecio(producto.precio))
  );

  const quitar = crear("button", "cart-item__remove");
  quitar.type = "button";
  quitar.setAttribute("aria-label", "Quitar " + producto.nombre);
  quitar.append(crearSvg('<path d="M18 6 6 18M6 6l12 12"/>', 16, 2));
  quitar.addEventListener("click", () => quitarDelCarrito(id));

  item.append(info, crear("span", "cart-item__price", formatearPrecio(producto.precio * cantidad)), quitar);
  return item;
}

function renderCarrito() {
  const unidades = contarUnidades();
  carritoContador.textContent = unidades;
  carritoContador.hidden = unidades === 0;
  carritoBtn.setAttribute("aria-label", "Carrito, " + plural(unidades, "producto", "productos"));

  carritoLista.replaceChildren(...[...estado.carrito].map(([id, cantidad]) => crearItemCarrito(id, cantidad)));
  carritoVacio.hidden = unidades > 0;
  carritoTotal.textContent = formatearPrecio(calcularTotal());
}

function agregar(id) {
  estado.carrito.set(id, (estado.carrito.get(id) || 0) + 1);
  renderCarrito();
  avisar(buscarProducto(id).nombre + " agregado al carrito");
}

function quitarDelCarrito(id) {
  estado.carrito.delete(id);
  renderCarrito();
  avisar(buscarProducto(id).nombre + " eliminado del carrito");
}

function alternarMenu(abrir) {
  carritoMenu.hidden = !abrir;
  carritoBtn.setAttribute("aria-expanded", String(abrir));
}

// ---------- Categorías ----------
function cargarCategorias() {
  datos.categorias.forEach((nombre) => {
    selectCategoria.append(new Option(nombre, nombre));
  });
}

// ---------- Eventos: solo actualizan el estado y vuelven a pintar ----------
buscador.addEventListener("input", () => {
  estado.busqueda = buscador.value;
  render();
});

selectCategoria.addEventListener("change", () => {
  estado.categoria = selectCategoria.value;
  render();
  const total = obtenerVisibles().length;
  if (total === 0) return; // el bloque de error ya explica el vacío
  const nombre = estado.categoria === "todas" ? "todas las categorías" : estado.categoria;
  avisar("Mostrando " + nombre + " · " + plural(total, "producto", "productos"));
});

carritoBtn.addEventListener("click", () => alternarMenu(carritoMenu.hidden));

// Cierra el menú al hacer clic fuera o con Escape (y devuelve el foco al botón).
// Se usa composedPath() porque al quitar un producto el botón pulsado se reemplaza
// en el DOM y e.target.closest() ya no lo encontraría dentro del carrito.
const carrito = carritoBtn.parentElement;
document.addEventListener("click", (e) => {
  if (!carritoMenu.hidden && !e.composedPath().includes(carrito)) alternarMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !carritoMenu.hidden) {
    alternarMenu(false);
    carritoBtn.focus();
  }
});

// ---------- Arranque ----------
cargarCategorias();
render();
renderCarrito();
