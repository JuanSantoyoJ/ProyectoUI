document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('login-alert');
  const createUserBtn = document.getElementById('btn-create-user');
  const togglePasswordBtn = document.getElementById('toggle-password');

  // Funcionalidad para ver/ocultar contraseña con el ícono del ojo
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  }

  // Función común para guardar la sesión y redirigir al index de la raíz
  const accederAlPortal = (usuario) => {
    localStorage.setItem('portal_user', JSON.stringify({
      name: usuario,
      loggedAt: new Date().toISOString()
    }));
    window.location.href = '../index.html';
  };

  // Acción del botón "Acceder" (Submit del formulario)
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        alertBox.style.display = 'block';
        return;
      }

      alertBox.style.display = 'none';
      accederAlPortal(username);
    });
  }

  // Acción del botón "Crear usuario"
  if (createUserBtn) {
    createUserBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        alertBox.textContent = 'Escribe un usuario y contraseña para registrarte.';
        alertBox.style.display = 'block';
        return;
      }

      alertBox.style.display = 'none';
      accederAlPortal(username);
    });
  }
});