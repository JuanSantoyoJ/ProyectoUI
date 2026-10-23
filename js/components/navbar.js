document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.dropdown-toggle');
  const dropdowns = document.querySelectorAll('.dropdown-menu');

  toggles.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const targetMenu = document.getElementById(targetId);

      // Cerrar cualquier otro menú abierto
      dropdowns.forEach((menu) => {
        if (menu.id !== targetId) {
          menu.classList.remove('show');
        }
      });

      // Alternar el menú actual
      if (targetMenu) {
        targetMenu.classList.toggle('show');
      }
    });
  });

  // Cerrar menús si el usuario hace clic fuera de ellos
  document.addEventListener('click', () => {
    dropdowns.forEach((menu) => menu.classList.remove('show'));
  });
});