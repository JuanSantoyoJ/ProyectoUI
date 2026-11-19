const formularioRegistro = document.getElementById('signup-form');
const mensajeRegistro = document.getElementById('signup-message');
const passwordRegistro = document.getElementById('signup-password');
const confirmacionRegistro = document.getElementById('signup-confirm');

formularioRegistro.addEventListener('submit', (evento) => {
  evento.preventDefault();
  confirmacionRegistro.setCustomValidity(
    confirmacionRegistro.value === passwordRegistro.value ? '' : 'Las contraseñas no coinciden.'
  );
  mensajeRegistro.textContent = '';
  mensajeRegistro.classList.remove('is-error');

  if (!formularioRegistro.reportValidity()) return;

  mensajeRegistro.textContent = 'Formulario validado. Esta demostración no crea cuentas reales; comunícate con soporte para obtener acceso institucional.';
  formularioRegistro.reset();
  confirmacionRegistro.setCustomValidity('');
});

confirmacionRegistro.addEventListener('input', () => confirmacionRegistro.setCustomValidity(''));
