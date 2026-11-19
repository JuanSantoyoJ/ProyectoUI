const LLAVE_PERFIL = 'unab-demo-profile';
const perfilPredeterminado = {
  name: 'Juan David Santoyo Jaimes',
  program: 'Ingeniería de Sistemas',
  email: 'estudiante.ejemplo@unab.edu.co',
  phone: '',
};

function cargarPerfil() {
  const guardado = localStorage.getItem(LLAVE_PERFIL);
  if (!guardado) return { ...perfilPredeterminado };
  try {
    const datos = JSON.parse(guardado);
    return { ...perfilPredeterminado, ...datos };
  } catch (error) {
    console.error('No se pudo leer el perfil guardado.', error);
    return { ...perfilPredeterminado };
  }
}

const datosPerfil = cargarPerfil();
const formularioPerfil = document.getElementById('edit-profile-form');

if (formularioPerfil) {
  for (const [campo, valor] of Object.entries({
    name: datosPerfil.name,
    email: datosPerfil.email,
    program: datosPerfil.program,
    phone: datosPerfil.phone,
  })) {
    formularioPerfil.elements.namedItem(campo).value = valor;
  }

  formularioPerfil.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formularioPerfil.reportValidity()) return;
    const nuevosDatos = Object.fromEntries(new FormData(formularioPerfil).entries());
    try {
      localStorage.setItem(LLAVE_PERFIL, JSON.stringify({ ...datosPerfil, ...nuevosDatos }));
    } catch (error) {
      const mensaje = document.getElementById('profile-message');
      mensaje.textContent = 'No fue posible guardar los cambios en este navegador.';
      mensaje.classList.add('is-error');
      console.error('No se pudo guardar el perfil.', error);
      return;
    }
    window.location.href = 'perfil.html?guardado=1';
  });
}

const nombres = document.querySelectorAll('[data-profile="name"]');
const programas = document.querySelectorAll('[data-profile="program"]');
const correos = document.querySelectorAll('[data-profile="email"]');
const telefonos = document.querySelectorAll('[data-profile="phone"]');
nombres.forEach((elemento) => { elemento.textContent = datosPerfil.name; });
programas.forEach((elemento) => { elemento.textContent = datosPerfil.program; });
correos.forEach((elemento) => { elemento.textContent = datosPerfil.email; });
telefonos.forEach((elemento) => { elemento.textContent = datosPerfil.phone || 'No registrado'; });

const avisoGuardado = new URLSearchParams(window.location.search).get('guardado');
if (avisoGuardado === '1') {
  const notaPerfil = document.querySelector('.perfil-card__nota');
  if (notaPerfil) {
    notaPerfil.textContent = 'Cambios guardados en este navegador.';
    notaPerfil.setAttribute('role', 'status');
  }
}
