document.addEventListener('DOMContentLoaded', () => {
  const userInitialSpan = document.getElementById('user-initial');
  const logoutBtn = document.getElementById('btn-logout');

  // Cargar datos del usuario desde localStorage
  const storedUser = localStorage.getItem('portal_user');
  if (storedUser && userInitialSpan) {
    try {
      const user = JSON.parse(storedUser);
      if (user.name) {
        userInitialSpan.textContent = user.name.charAt(0).toUpperCase();
      }
    } catch (e) {
      console.error('Error leyendo sesión:', e);
    }
  }

  // Limpiar sesión al darle a "Cerrar sesión"
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('portal_user');
    });
  }
});