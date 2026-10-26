// Abre y cierra los desplegables del header (uno a la vez).
// Cada botón con aria-controls="id" abre el panel que tenga ese id.
const botones = [...document.querySelectorAll('.header [aria-controls^="panel-"]')]
  .map((boton) => {
    const id = boton.getAttribute("aria-controls");
    const panel = document.getElementById(id);
    if (!panel) console.warn(`navbar.js: no existe un panel con id="${id}"`);
    return { boton, panel };
  })
  .filter((par) => par.panel);

// En escritorio, cada panel se alinea bajo el botón que lo abre.
// En pantallas pequeñas el CSS lo extiende a todo el ancho.
const escritorio = window.matchMedia("(min-width: 901px)");
function posicionar(boton, panel) {
  if (!escritorio.matches) {
    panel.style.left = "";
    panel.style.right = "";
    return;
  }
  const contenedor = panel.parentElement.getBoundingClientRect();
  const b = boton.getBoundingClientRect();
  const ancho = panel.offsetWidth;
  // El panel de perfil se alinea por su borde derecho; los demás, por el izquierdo.
  let izq = panel.classList.contains("panel--perfil")
    ? b.right - contenedor.left - ancho
    : b.left - contenedor.left;
  izq = Math.max(0, Math.min(izq, contenedor.width - ancho));
  panel.style.left = izq + "px";
  panel.style.right = "auto";
}

function cerrarTodos(devolverFoco = false) {
  botones.forEach(({ boton, panel }) => {
    if (!panel.hidden && devolverFoco) boton.focus();
    panel.hidden = true;
    boton.setAttribute("aria-expanded", "false");
  });
}

botones.forEach(({ boton, panel }) => {
  boton.addEventListener("click", () => {
    const estabaAbierto = !panel.hidden;
    cerrarTodos();
    if (!estabaAbierto) {
      panel.hidden = false;
      posicionar(boton, panel);
      boton.setAttribute("aria-expanded", "true");
    }
  });
});

document.querySelectorAll("[data-cerrar]").forEach((boton) => {
  boton.addEventListener("click", () => cerrarTodos(true));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) cerrarTodos();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarTodos(true);
});

// Botón hamburguesa (pantallas pequeñas): muestra u oculta los enlaces principales.
const toggleMenu = document.querySelector("[data-nav-toggle]");
const navPrincipal = document.getElementById("nav-principal");
if (toggleMenu && navPrincipal) {
  toggleMenu.addEventListener("click", () => {
    const abrir = toggleMenu.getAttribute("aria-expanded") !== "true";
    toggleMenu.setAttribute("aria-expanded", String(abrir));
    navPrincipal.classList.toggle("is-open", abrir);
    if (!abrir) cerrarTodos();
  });
}

// Si cambia el tamaño de la ventana, reubica el panel que esté abierto.
window.addEventListener("resize", () => {
  botones.forEach(({ boton, panel }) => {
    if (!panel.hidden) posicionar(boton, panel);
  });
});