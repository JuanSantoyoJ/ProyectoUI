// Total de horas libres que debe cumplir el estudiante
const HORAS_REQUERIDAS = 96;

// Actividades registradas (datos de ejemplo).
// Para registrar una nueva actividad, agrega un objeto a este arreglo
// (más adelante estos datos pueden venir de un servidor).
const actividades = [
  { nombre: 'Jornada de voluntariado ambiental', tipo: 'Participación social', hora: '08:00 – 14:00', fecha: '2026-10-24', lugar: 'Campus El Jardín', horas: 6 },
  { nombre: 'Taller de expresión corporal',      tipo: 'Arte y cultura',       hora: '08:00 – 12:00', fecha: '2026-10-17', lugar: 'Salón de danza · Bienestar', horas: 4 },
  { nombre: 'Charla de bienestar emocional',     tipo: 'Desarrollo personal',  hora: '14:00 – 16:00', fecha: '2026-10-09', lugar: 'Auditorio Jesús Alberto Rey', horas: 2 },
];

// Ranking de ejemplo para mostrar los estudiantes con mayor acumulado.
const estudiantesRanking = [
  { nombre: 'María Fernanda Gómez', programa: 'Administración de Empresas', horas: 96 },
  { nombre: 'Juan Sebastián Pérez', programa: 'Ingeniería de Sistemas', horas: 92 },
  { nombre: 'Laura Sofía Martínez', programa: 'Diseño Industrial', horas: 88 },
  { nombre: 'Andrés Felipe Rojas', programa: 'Derecho', horas: 84 },
  { nombre: 'Valentina Torres', programa: 'Psicología', horas: 80 },
];

const MESES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
const formatoFecha = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MESES[m - 1]} ${a}`;
};
const numero = (n) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });

// Evita insertar HTML desde los datos
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render() {
  const lista = [...actividades].sort((a, b) => b.fecha.localeCompare(a.fecha)); // más recientes primero
  const total = lista.reduce((suma, a) => suma + a.horas, 0);
  const pct = Math.min(100, (total / HORAS_REQUERIDAS) * 100);
  const faltan = Math.max(0, HORAS_REQUERIDAS - total);

  // Ranking de estudiantes
  const ranking = document.getElementById('ranking-estudiantes');
  ranking.innerHTML = estudiantesRanking.map((estudiante, index) => {
    const iniciales = estudiante.nombre
      .split(' ')
      .map((palabra) => palabra[0])
      .slice(0, 2)
      .join('');

    return `
      <tr>
        <td><span class="ranking__position ranking__position--${index + 1}">${index + 1}</span></td>
        <td>
          <div class="ranking__student">
            <span class="ranking__avatar">${esc(iniciales)}</span>
            <span class="ranking__name">${esc(estudiante.nombre)}</span>
          </div>
        </td>
        <td>${esc(estudiante.programa)}</td>
        <td class="num"><span class="ranking__hours">${numero(estudiante.horas)} h</span></td>
      </tr>`;
  }).join('');

  // Tabla
  const tbody = document.getElementById('actividades');
  tbody.innerHTML = lista.length
    ? lista.map((a) => `
        <tr>
          <td><div class="act__name">${esc(a.nombre)}</div><div class="act__type">${esc(a.tipo)}</div></td>
          <td>${esc(a.hora)}</td>
          <td>${formatoFecha(a.fecha)}</td>
          <td>${esc(a.lugar)}</td>
          <td class="num"><span class="hl-pill">${a.horas} h</span></td>
        </tr>`).join('')
    : '<tr><td colspan="5" class="hl__empty">Aún no tienes actividades registradas.</td></tr>';

  // Resumen
  const n = lista.length;
  document.getElementById('resumen').textContent =
    `${n} ${n === 1 ? 'actividad registrada' : 'actividades registradas'} · ${total} ${total === 1 ? 'hora libre acreditada' : 'horas libres acreditadas'}`;

  // Progreso
  document.getElementById('horas-hechas').textContent = total;
  document.getElementById('horas-total').textContent = HORAS_REQUERIDAS;
  document.getElementById('porcentaje').textContent = `${numero(pct)} % completado`;
  document.getElementById('faltantes').textContent = faltan > 0
    ? `Te ${faltan === 1 ? 'falta 1 hora' : `faltan ${faltan} horas`} para completar el requisito.`
    : '¡Completaste el requisito de horas libres!';

  const barra = document.querySelector('.bar');
  barra.setAttribute('aria-valuemax', HORAS_REQUERIDAS);
  barra.setAttribute('aria-valuenow', Math.min(total, HORAS_REQUERIDAS));
  // Pequeño retraso para que la barra se anime al cargar
  requestAnimationFrame(() => { document.getElementById('barra').style.width = pct + '%'; });
}

render();
