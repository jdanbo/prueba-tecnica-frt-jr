// Rellena la guía leyendo los tokens reales de style.css, para que nunca se desfase.
const estilos = getComputedStyle(document.documentElement);

document.querySelectorAll("[data-token]").forEach((el) => {
  const nombre = el.dataset.token;
  const valor = estilos.getPropertyValue(nombre).trim();

  if (el.classList.contains("sg-swatch")) {
    const color = document.createElement("div");
    color.className = "sg-swatch__color";
    color.style.background = "var(" + nombre + ")";
    const etiqueta = document.createElement("div");
    etiqueta.className = "sg-swatch__label";
    etiqueta.append(nombre);
    const detalle = document.createElement("span");
    detalle.textContent = valor;
    etiqueta.append(detalle);
    el.append(color, etiqueta);
  } else {
    el.textContent = "data-name-only" in el.dataset || el.hasAttribute("data-name-only")
      ? nombre
      : nombre + " · " + valor;
  }
});

// Colores de producto: salen de data.js
const productos = document.getElementById("sg-productos");
datos.productos.forEach((p) => {
  const muestra = document.createElement("div");
  muestra.className = "sg-swatch";
  const color = document.createElement("div");
  color.className = "sg-swatch__color";
  color.style.background = p.color;
  const etiqueta = document.createElement("div");
  etiqueta.className = "sg-swatch__label";
  etiqueta.append(p.nombre);
  const detalle = document.createElement("span");
  detalle.textContent = p.color;
  etiqueta.append(detalle);
  muestra.append(color, etiqueta);
  productos.append(muestra);
});
