// ---------- Datos de ejemplo ----------
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HORA_INICIO = 6;   // el calendario va de 06:00
const HORA_FIN = 22;     // a 22:00

// "detalle": null = sin nota registrada (se muestra "—" en la tabla y no hay lupa).
// Evaluaciones: fecha ISO, peso en %, nota de 0 a 5 (null = pendiente).
const CURSOS = [
  { codigo: '21345', nombre: 'Integrales', creditos: 4, tipo: 'Asig. del plan', color: 'azul', lugar: 'Aula D-302',
    detalle: {
      docente: { nombre: 'María Camacho', cargo: 'Profesora titular', correo: 'm.camacho@unab.edu.co', consulta: 'Miércoles · 14:00' },
      evaluaciones: [
        { fecha: '2026-08-15', nombre: 'Integrales definidas',      peso: 20, nota: 4.2 },
        { fecha: '2026-08-29', nombre: 'Integrales indefinidas',    peso: 25, nota: 3.9 },
        { fecha: '2026-09-12', nombre: 'Aplicaciones y ejercicios', peso: 30, nota: 3.7 },
        { fecha: '2026-09-26', nombre: 'Parcial y consolidación',   peso: 25, nota: null },
      ],
      observaciones: [
        'Las notas se actualizan al cierre de cada evaluación y pueden variar hasta la publicación final del periodo.',
        'Si identificas una inconsistencia, comunícate con el docente o consulta el Centro de ayuda del portal.',
      ] } },
  { codigo: '21402', nombre: 'Programación orientada a objetos', creditos: 3, tipo: 'Asig. del plan', color: 'celeste', lugar: 'Laboratorio L-204', detalle: null },
  { codigo: '21320', nombre: 'Álgebra lineal', creditos: 3, tipo: 'Asig. del plan', color: 'verde', lugar: 'Aula D-205',
    detalle: {
      docente: { nombre: 'Carlos Ortiz', cargo: 'Profesor asociado', correo: 'c.ortiz@unab.edu.co', consulta: 'Martes · 15:00' },
      evaluaciones: [
        { fecha: '2026-08-22', nombre: 'Parcial 1',    peso: 25, nota: 4.2 },
        { fecha: '2026-09-05', nombre: 'Talleres',     peso: 20, nota: 4.5 },
        { fecha: '2026-09-19', nombre: 'Parcial 2',    peso: 25, nota: 3.6 },
        { fecha: '2026-10-10', nombre: 'Examen final', peso: 30, nota: null },
      ],
      observaciones: [
        'Las notas se actualizan al cierre de cada evaluación y pueden variar hasta la publicación final del periodo.',
        'Si identificas una inconsistencia, comunícate con el docente o consulta el Centro de ayuda del portal.',
      ] } },
  { codigo: '21901', nombre: 'Inglés II', creditos: 2, tipo: 'Asig. del plan', color: 'ambar', lugar: 'Aula C-103', detalle: null },
];

// dias: 0 = lunes ... 6 = domingo. inicio y fin en horas (admite 8.5 = 08:30)
const SESIONES = [
  { curso: '21345', dias: [0, 2], inicio: 8,  fin: 10 },
  { curso: '21402', dias: [1, 3], inicio: 10, fin: 12 },
  { curso: '21320', dias: [0, 2], inicio: 14, fin: 16 },
  { curso: '21901', dias: [4],    inicio: 16, fin: 18 },
];

// ---------- Utilidades ----------
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MESES[m - 1]}`; };
const iniciales = (nombre) => nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
const porCodigo = (codigo) => CURSOS.find((c) => c.codigo === codigo);

// ---------- Calendario semanal ----------
function renderCalendario() {
  const horas = [];
  for (let h = HORA_INICIO; h <= HORA_FIN; h++) horas.push(h);

  const columnas = DIAS.map((_, d) => {
    const eventos = SESIONES.filter((s) => s.dias.includes(d)).map((s) => {
      const c = porCodigo(s.curso);
      return `<div class="ev c-${c.color}" style="top: calc(${s.inicio - HORA_INICIO} * var(--h) + 4px); height: calc(${s.fin - s.inicio} * var(--h) - 8px);">
        <div class="ev__time">${hhmm(s.inicio)} – ${hhmm(s.fin)}</div>
        <div class="ev__name">${esc(c.nombre)}</div>
        <div class="ev__place">${c.codigo} · ${esc(c.lugar)}</div>
      </div>`;
    }).join('');
    return `<div class="cal__day">${eventos}</div>`;
  }).join('');

  document.getElementById('calendario').innerHTML = `
    <div class="cal__row cal__top"><div>Hora</div>${DIAS.map((d) => `<div>${d}</div>`).join('')}</div>
    <div class="cal__row cal__body">
      <div class="cal__hours">${horas.map((h) => `<span style="top: calc(${h - HORA_INICIO} * var(--h));">${hhmm(h)}</span>`).join('')}</div>
      ${columnas}
    </div>`;

  document.getElementById('leyenda').innerHTML =
    CURSOS.map((c) => `<li class="c-${c.color}">${esc(c.nombre)}</li>`).join('');
}

// ---------- Tabla de cursos ----------
function renderCursos() {
  const creditos = CURSOS.reduce((suma, c) => suma + c.creditos, 0);
  document.getElementById('resumen-cursos').textContent =
    `${CURSOS.length} asignaturas · ${creditos} créditos · Periodo 2026-II`;

  document.getElementById('cursos').innerHTML = CURSOS.map((c) => `
    <tr>
      <td>${c.codigo}</td>
      <td><span class="curso__bar c-${c.color}"></span>${esc(c.nombre)}</td>
      <td class="c">${c.creditos}</td>
      <td>${esc(c.tipo)}</td>
      <td class="c">${c.detalle
        ? `<button type="button" class="lupa" data-codigo="${c.codigo}" aria-label="Ver calificaciones de ${esc(c.nombre)}">
             <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>`
        : '<span class="nada" aria-label="Sin nota registrada">—</span>'}</td>
    </tr>`).join('');
}

// ---------- Ventana emergente de notas ----------
const dialogo = document.getElementById('dialogo-notas');
const contenedor = document.getElementById('np');
let cursoAbierto = null;

function renderNotas(c) {
  const { docente, evaluaciones, observaciones } = c.detalle;

  // Cálculos a partir de las evaluaciones
  const publicadas = evaluaciones.filter((e) => e.nota !== null);
  const pendientes = evaluaciones.length - publicadas.length;
  const pesoPub = publicadas.reduce((s, e) => s + e.peso, 0);
  const promedio = pesoPub ? publicadas.reduce((s, e) => s + e.nota * e.peso, 0) / pesoPub : null;
  const ultima = publicadas.reduce((a, e) => (!a || e.fecha > a.fecha ? e : a), null);
  const nUltima = ultima ? evaluaciones.indexOf(ultima) + 1 : null;
  const prom = promedio === null ? '—' : promedio.toFixed(1);
  const tipo = c.tipo === 'Asig. del plan' ? 'Asignatura del plan' : c.tipo;

  const filas = evaluaciones.map((e, i) => `
    <tr>
      <td>${fechaCorta(e.fecha)}</td>
      <td>Evaluación ${i + 1} · ${esc(e.nombre)}</td>
      <td>${e.peso}%</td>
      <td>${e.nota === null ? '—' : e.nota.toFixed(1)}</td>
      <td><span class="estado ${e.nota === null ? 'estado--pend' : 'estado--pub'}">${e.nota === null ? 'Pendiente' : 'Publicada'}</span></td>
    </tr>`).join('');

  contenedor.innerHTML = `
    <div class="np__top">
      <div class="np__head">
        <div>
          <h2 id="np-titulo">Notas registradas · ${c.codigo}</h2>
          <p>Consulta las calificaciones publicadas de ${esc(c.nombre)} para este periodo académico.</p>
        </div>
        <button type="button" class="np__x" data-cerrar-notas aria-label="Cerrar notas">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
        </button>
      </div>
      <div class="np__course">
        <div class="np__id"><div><strong>${esc(c.nombre)}</strong><span>Código ${c.codigo} · Periodo 2026-II · ${esc(tipo)}</span></div></div>
        <span class="np__score">${prom} / 5.0</span>
      </div>
    </div>

    <div class="np__body">
      <div class="np__main">
        <section class="np__card">
          <h3>Resumen académico</h3>
          <div class="np__stats">
            <div class="np__stat"><span>Promedio actual</span><strong>${prom}</strong><small>Escala 0.0 a 5.0</small></div>
            <div class="np__stat"><span>Evaluaciones</span><strong>${evaluaciones.length}</strong><small>${publicadas.length} ${publicadas.length === 1 ? 'publicada' : 'publicadas'} · ${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}</small></div>
            <div class="np__stat"><span>Última actualización</span><strong>${ultima ? fechaCorta(ultima.fecha) : '—'}</strong><small>${ultima ? `Evaluación ${nUltima} publicada` : 'Sin notas publicadas'}</small></div>
          </div>
        </section>

        <section class="np__card">
          <div class="np__cardhead"><h3>Evaluaciones</h3><span>Datos de ejemplo para esta propuesta</span></div>
          <div class="np__scroll">
            <table class="np__table">
              <thead><tr><th>Fecha</th><th>Evaluación</th><th>Peso</th><th>Nota</th><th>Estado</th></tr></thead>
              <tbody>${filas}</tbody>
            </table>
          </div>
        </section>
      </div>

      <aside class="np__side">
        <section class="np__card">
          <h3>Docente</h3>
          <div class="np__teacher">
            <span class="np__avatar" aria-hidden="true">${esc(iniciales(docente.nombre))}</span>
            <div><strong>${esc(docente.nombre)}</strong><span>${esc(docente.cargo)}</span></div>
          </div>
          <dl>
            <div class="np__kv"><dt>Correo</dt><dd>${esc(docente.correo)}</dd></div>
            <div class="np__kv"><dt>Consulta</dt><dd>${esc(docente.consulta)}</dd></div>
          </dl>
        </section>

        <section class="np__card">
          <h3>Observaciones</h3>
          <ul class="np__obs">${observaciones.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
        </section>

        <section class="np__card">
          <h3>Acciones rápidas</h3>
          <button type="button" class="np__btn" data-accion="descargar">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>Descargar comprobante
          </button>
          <button type="button" class="np__btn" data-accion="correo">
            <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>Enviar a mi correo
          </button>
          <p class="np__status" id="np-estado" role="status" aria-live="polite"></p>
        </section>
      </aside>
    </div>`;
}

// Descarga un CSV con las notas (se abre bien en Excel)
function descargarComprobante(c) {
  const celda = (t) => `"${String(t).replace(/"/g, '""')}"`;
  const lineas = [['Fecha', 'Evaluación', 'Peso (%)', 'Nota', 'Estado']].concat(
    c.detalle.evaluaciones.map((e, i) => [e.fecha, `Evaluación ${i + 1} · ${e.nombre}`, e.peso, e.nota === null ? '' : e.nota.toFixed(1), e.nota === null ? 'Pendiente' : 'Publicada'])
  ).map((fila) => fila.map(celda).join(','));
  const blob = new Blob(['\ufeff' + lineas.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `notas-${c.codigo}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function abrirNotas(codigo) {
  const c = porCodigo(codigo);
  if (!c || !c.detalle) return;
  cursoAbierto = c;
  renderNotas(c);
  dialogo.showModal();            // se centra solo, bloquea el fondo y se cierra con Esc
  contenedor.scrollTop = 0;
}

// Clic en la lupa de la tabla
document.getElementById('cursos').addEventListener('click', (e) => {
  const boton = e.target.closest('.lupa');
  if (boton) abrirNotas(boton.dataset.codigo);
});

// Clics dentro de la ventana: cerrar, descargar, enviar
dialogo.addEventListener('click', (e) => {
  if (e.target === dialogo) return dialogo.close();            // clic sobre el fondo oscuro
  if (e.target.closest('[data-cerrar-notas]')) return dialogo.close();
  const accion = e.target.closest('[data-accion]')?.dataset.accion;
  const estado = document.getElementById('np-estado');
  if (accion === 'descargar' && cursoAbierto) {
    descargarComprobante(cursoAbierto);
    estado.textContent = 'Comprobante descargado.';
  } else if (accion === 'correo') {
    estado.textContent = 'Te enviaremos el comprobante a tu correo institucional (simulado).';
  }
});

renderCalendario();
renderCursos();