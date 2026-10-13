// =========================================================
//  Catálogo de Productos - NovaTech
//  Capas: Estado · Datos puros · Render · Eventos · Arranque
//  La pantalla siempre se pinta desde el objeto "estado".
// =========================================================

// ---------- Referencias al DOM ----------
const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const selectCategoria = document.getElementById("categoria");
const contador = document.getElementById("contador");
const alerta = document.getElementById("alerta");
const carrito = document.getElementById("carrito");

// ---------- Estado único ----------
const estado = { busqueda: "", categoria: "todas", agregados: 0 };

// ---------- Alerta temporal ----------
const DURACION_ALERTA_MS = 3000;
let temporizadorAlerta;

// ---------- Iconos (SVG de trazo, uno por categoría de producto por id) ----------
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

// ---------- Datos: función pura (misma entrada, misma salida) ----------
function obtenerVisibles() {
  const texto = estado.busqueda.trim().toLowerCase();
  return datos.productos.filter((p) =>
    p.nombre.toLowerCase().includes(texto) &&
    (estado.categoria === "todas" || p.categoria === estado.categoria)
  );
}

function formatearPrecio(valor) {
  return datos.moneda + valor.toLocaleString("en-US");
}

// ---------- Render ----------
// Crea nodos con textContent (nunca innerHTML con datos) para no inyectar HTML.
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function crearIcono(id, tamano) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", tamano);
  svg.setAttribute("height", tamano);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICONOS[id] || ""; // contenido propio del código, no de los datos
  return svg;
}

function crearTarjeta(producto) {
  const tarjeta = crear("li", "card");

  const media = crear("div", "card__media");
  media.style.setProperty("--producto-color", producto.color);
  media.append(crearIcono(producto.id, 40));
  if (producto.destacado) media.append(crear("span", "badge", "Destacado"));

  const cuerpo = crear("div", "card__body");
  const pie = crear("div", "card__footer");

  const boton = crear("button", "btn");
  boton.type = "button";
  boton.append("+ Agregar");
  boton.setAttribute("aria-label", "Agregar " + producto.nombre);
  boton.addEventListener("click", agregar);

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

function mostrarProductos(lista) {
  catalogo.replaceChildren(...lista.map(crearTarjeta));
  contador.textContent = lista.length + (lista.length === 1 ? " producto" : " productos");
}

function mostrarAlerta(texto, esError) {
  alerta.hidden = !texto;
  alerta.textContent = texto || "";
  alerta.classList.toggle("alert--error", Boolean(esError));
}

// El error depende del estado y se mantiene; el aviso de categoría es un evento
// puntual (ver avisarCategoria) y por eso render() solo lo limpia al cambiar la lista.
function render() {
  const lista = obtenerVisibles();
  mostrarProductos(lista);

  clearTimeout(temporizadorAlerta);
  if (lista.length === 0) {
    mostrarAlerta("Su nombre no coincide con ningún producto", true);
  } else {
    mostrarAlerta("");
  }
  carrito.textContent = estado.agregados;
}

function avisarCategoria() {
  if (estado.categoria === "todas") return;
  const total = obtenerVisibles().length;
  if (total === 0) return; // el error de render() ya explica el vacío
  mostrarAlerta("Mostrando: " + estado.categoria + " · " + total + (total === 1 ? " producto" : " productos"));
  temporizadorAlerta = setTimeout(() => mostrarAlerta(""), DURACION_ALERTA_MS);
}

// ---------- Categorías ----------
function cargarCategorias() {
  datos.categorias.forEach((nombre) => {
    selectCategoria.append(new Option(nombre, nombre));
  });
}

// ---------- Eventos: solo actualizan el estado y vuelven a pintar ----------
function agregar() {
  estado.agregados += 1;
  carrito.textContent = estado.agregados; // sin render() completo para no reconstruir las tarjetas
}

buscador.addEventListener("input", () => {
  estado.busqueda = buscador.value;
  render();
});

selectCategoria.addEventListener("change", () => {
  estado.categoria = selectCategoria.value;
  render();
  avisarCategoria();
});

// ---------- Arranque ----------
cargarCategorias();
render();
