const listaEvaluaciones = document.getElementById('evaluations');
const objetivoInput = document.getElementById('goal');
const totalPorcentaje = document.getElementById('percentage-total');
const resultado = document.getElementById('result');
const insigniaEjemplo = document.getElementById('sample-badge');

const evaluacionesIniciales = [
  { nombre: 'Parcial 1', nota: '4,00', porcentaje: '25' },
  { nombre: 'Parcial 2', nota: '3,00', porcentaje: '20' },
  { nombre: 'Proyecto', nota: '4,00', porcentaje: '15' },
  { nombre: 'Examen final', nota: '', porcentaje: '40' },
];

const escapar = (texto) => String(texto).replace(/[&<>"']/g, (caracter) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[caracter]));

function crearEvaluacion(evaluacion = {}) {
  const fila = document.createElement('div');
  fila.className = 'calc__row';
  fila.innerHTML = `
    <label class="sr-only">Nombre de la evaluación</label>
    <input class="calc__name" type="text" maxlength="60" placeholder="Nombre de evaluación" aria-label="Nombre de la evaluación">
    <label class="sr-only">Nota obtenida; dejar vacía si está pendiente</label>
    <input class="calc__grade" type="text" inputmode="decimal" placeholder="Pendiente" aria-label="Nota obtenida; dejar vacía si está pendiente" autocomplete="off">
    <label class="sr-only">Porcentaje de la evaluación</label>
    <div class="calc__weight"><input class="calc__percentage" type="number" min="0" max="100" step="0.01" aria-label="Porcentaje de la evaluación"><span>%</span></div>
    <button class="calc__remove" type="button" aria-label="Eliminar evaluación"><svg class="icon"><use href="#trash"/></svg></button>`;
  fila.querySelector('.calc__name').value = evaluacion.nombre || '';
  fila.querySelector('.calc__grade').value = evaluacion.nota || '';
  fila.querySelector('.calc__percentage').value = evaluacion.porcentaje ?? '0';
  actualizarPendiente(fila);
  return fila;
}

function actualizarPendiente(fila) {
  const inputNota = fila.querySelector('.calc__grade');
  const pendiente = !inputNota.value.trim();
  inputNota.classList.toggle('is-pending', pendiente);
  inputNota.placeholder = pendiente ? 'Pendiente' : '';
}

function numero(texto) {
  const normalizado = String(texto).trim().replace(',', '.');
  if (!normalizado || !/^\d+(?:\.\d{1,2})?$/.test(normalizado)) return null;
  const valor = Number(normalizado);
  return Number.isFinite(valor) ? valor : null;
}

function formatear(valor, decimales = 2) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}

function obtenerDatos() {
  const filas = [...listaEvaluaciones.querySelectorAll('.calc__row')];
  const porcentajes = filas.map((fila) => {
    const campo = fila.querySelector('.calc__percentage');
    const valor = campo.value.trim() ? Number(campo.value) : null;
    campo.setAttribute('aria-invalid', String(valor === null || !Number.isFinite(valor) || valor < 0 || valor > 100));
    return valor;
  });
  const total = porcentajes.reduce((suma, valor) => suma + (valor ?? 0), 0);

  let acumulado = 0;
  let pendiente = 0;
  let errorNota = false;
  filas.forEach((fila, indice) => {
    const campo = fila.querySelector('.calc__grade');
    const texto = campo.value.trim();
    const porcentaje = porcentajes[indice] ?? 0;
    if (!texto) {
      pendiente += porcentaje;
      campo.removeAttribute('aria-invalid');
      return;
    }
    const nota = numero(texto);
    const valida = nota !== null && nota >= 0 && nota <= 5;
    campo.setAttribute('aria-invalid', String(!valida));
    if (!valida) {
      errorNota = true;
      return;
    }
    acumulado += nota * porcentaje / 100;
  });

  const objetivo = numero(objetivoInput.value);
  const objetivoValido = objetivo !== null && objetivo >= 0 && objetivo <= 5;
  objetivoInput.setAttribute('aria-invalid', String(!objetivoValido));
  return { filas, total, acumulado, pendiente, objetivo, objetivoValido, errorNota, porcentajes };
}

function actualizarTotal(datos) {
  const correcto = Math.abs(datos.total - 100) < 0.001;
  totalPorcentaje.classList.toggle('is-invalid', !correcto);
  totalPorcentaje.innerHTML = `<svg class="icon"><use href="#check-circle"/></svg>${correcto ? 'Porcentaje total:' : 'Porcentaje total:'} <strong>${formatear(datos.total, datos.total % 1 ? 2 : 0)} %</strong>`;
  if (!correcto) totalPorcentaje.setAttribute('aria-label', `Porcentaje total: ${formatear(datos.total)} por ciento. Debe sumar 100 por ciento.`);
  else totalPorcentaje.removeAttribute('aria-label');
}

function actualizarResultado(datos, mostrarErrores = false) {
  actualizarTotal(datos);
  const evaluado = Math.max(0, datos.total - datos.pendiente);
  const pesosValidos = datos.porcentajes.every((valor) => valor !== null && Number.isFinite(valor) && valor >= 0 && valor <= 100);
  let mensaje = '';
  let error = false;

  if (!datos.objetivoValido) {
    mensaje = 'Ingresa una meta entre 0,00 y 5,00.';
    error = true;
  } else if (!pesosValidos) {
    mensaje = 'Ingresa porcentajes válidos entre 0 y 100.';
    error = true;
  } else if (datos.errorNota) {
    mensaje = 'Cada nota debe estar entre 0,00 y 5,00.';
    error = true;
  } else if (Math.abs(datos.total - 100) >= 0.001) {
    mensaje = 'Ajusta los porcentajes para que sumen exactamente 100 %.';
    error = true;
  } else if (datos.pendiente <= 0.001) {
    mensaje = datos.acumulado >= datos.objetivo
      ? '¡Ya alcanzaste tu meta con las evaluaciones registradas!'
      : 'No quedan evaluaciones pendientes. La meta no se alcanza con las notas ingresadas.';
    error = datos.acumulado < datos.objetivo;
  }

  if (error || datos.pendiente <= 0.001) {
    resultado.innerHTML = `<div class="calc__result-head"><h3 id="result-title">Tu resultado</h3><span>${formatear(evaluado, 0)} % evaluado</span></div>
      <p class="calc__result-message${error ? ' is-error' : ''}" role="${mostrarErrores && error ? 'alert' : 'status'}">${escapar(mensaje)}</p>`;
    return;
  }

  const necesaria = (datos.objetivo - datos.acumulado) / datos.pendiente * 100;
  let detalle;
  let estado = '';
  if (necesaria <= 0) {
    detalle = 'Ya alcanzaste tu meta; cualquier nota en lo pendiente mantiene el resultado.';
    estado = 'is-success';
  } else if (necesaria > 5) {
    detalle = `Necesitarías ${formatear(necesaria)} en el porcentaje restante; supera la nota máxima de 5,00.`;
    estado = 'is-error';
  } else {
    detalle = `para alcanzar ${formatear(datos.objetivo)} en la definitiva.`;
  }

  resultado.innerHTML = `
    <div class="calc__result-head"><h3 id="result-title">Tu resultado</h3><span>${formatear(evaluado, 0)} % evaluado · ${formatear(datos.pendiente, 0)} % pendiente</span></div>
    <div class="calc__result-grid">
      <div class="calc__metric"><span class="calc__metric-label">Nota acumulada</span><strong class="calc__metric-value">${formatear(datos.acumulado)}</strong><p class="calc__metric-note">de 5,00 en la definitiva</p></div>
      <div class="calc__metric calc__metric--needed"><span class="calc__metric-label">Necesitas obtener</span><strong class="calc__metric-value">${necesaria <= 0 ? '0,00' : formatear(necesaria)}</strong><span class="calc__metric-note"><strong>en el ${formatear(datos.pendiente, 0)} % restante</strong></span><p class="calc__metric-note ${estado}">${escapar(detalle)}</p></div>
    </div>`;
}

function recalcular(mostrarErrores = false) {
  const datos = obtenerDatos();
  actualizarResultado(datos, mostrarErrores);
}

listaEvaluaciones.addEventListener('input', (evento) => {
  if (evento.target.matches('.calc__grade')) actualizarPendiente(evento.target.closest('.calc__row'));
  insigniaEjemplo.hidden = true;
  recalcular();
});

listaEvaluaciones.addEventListener('click', (evento) => {
  const boton = evento.target.closest('.calc__remove');
  if (!boton) return;
  boton.closest('.calc__row').remove();
  insigniaEjemplo.hidden = true;
  recalcular();
});

document.getElementById('add-evaluation').addEventListener('click', () => {
  const fila = crearEvaluacion({ nombre: `Evaluación ${listaEvaluaciones.children.length + 1}` });
  listaEvaluaciones.appendChild(fila);
  insigniaEjemplo.hidden = true;
  recalcular();
  fila.querySelector('.calc__name').focus();
});

document.getElementById('calculate').addEventListener('click', () => recalcular(true));
objetivoInput.addEventListener('input', () => {
  insigniaEjemplo.hidden = true;
  recalcular();
});

document.getElementById('clear-data').addEventListener('click', () => {
  listaEvaluaciones.replaceChildren();
  objetivoInput.value = '3,50';
  insigniaEjemplo.hidden = true;
  recalcular();
});

evaluacionesIniciales.forEach((evaluacion) => listaEvaluaciones.appendChild(crearEvaluacion(evaluacion)));
recalcular();
