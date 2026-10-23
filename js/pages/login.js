document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('login-alert');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación básica
    if (!email || !password || !email.includes('@')) {
      alertBox.style.display = 'block';
      return;
    }

    alertBox.style.display = 'none';

    // Guardamos una sesión simulada para usarla en el Dashboard
    const userName = email.split('@')[0];
    localStorage.setItem('portal_user', JSON.stringify({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email,
      loggedAt: new Date().toISOString()
    }));

    // Redirigir al dashboard (ambos están dentro de /pages)
    window.location.href = 'dashboard.html';
  });
});