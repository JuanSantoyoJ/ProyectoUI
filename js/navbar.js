// Abre y cierra los desplegables del navbar (uno a la vez).
const botones = document.querySelectorAll(".header [aria-controls]");

function cerrarTodos(devolverFoco = false) {
  botones.forEach((boton) => {
    const panel = document.getElementById(boton.getAttribute("aria-controls"));
    if (!panel.hidden && devolverFoco) boton.focus();
    panel.hidden = true;
    boton.setAttribute("aria-expanded", "false");
  });
}

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const panel = document.getElementById(boton.getAttribute("aria-controls"));
    const estabaAbierto = !panel.hidden;
    cerrarTodos();
    if (!estabaAbierto) {
      panel.hidden = false;
      boton.setAttribute("aria-expanded", "true");
    }
  });
});

// Botón "Cerrar" dentro de cada panel
document.querySelectorAll("[data-cerrar]").forEach((boton) => {
  boton.addEventListener("click", () => cerrarTodos(true));
});

// Clic fuera del header o tecla Escape
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) cerrarTodos();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarTodos(true);
});