const form = document.getElementById('login-form');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('clave');
const toggle = document.getElementById('toggle-clave');

// Mostrar / ocultar contraseña
toggle.addEventListener('click', () => {
  const visible = clave.type === 'text';
  clave.type = visible ? 'password' : 'text';
  toggle.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
});

function setError(input, mensaje) {
  const field = input.closest('.field');
  field.classList.toggle('field--error', Boolean(mensaje));
  field.querySelector('.field__error').textContent = mensaje || '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;

  if (!usuario.value.trim()) { setError(usuario, 'Ingresa tu usuario.'); ok = false; }
  else setError(usuario, '');

  if (clave.value.length < 6) { setError(clave, 'La contraseña debe tener al menos 6 caracteres.'); ok = false; }
  else setError(clave, '');

  // TODO: reemplazar por la autenticación real
  if (ok) window.location.href = 'index.html';
});
