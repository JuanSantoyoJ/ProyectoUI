// Plan de estudios de ejemplo (datos ilustrativos).
// Estados: 'aprobada' | 'reprobada' | 'en-curso' | 'no-vista'
// Para cambiar el avance del estudiante, modificar solo el campo "estado".
const semestres = [
  { nombre: 'Primer semestre', materias: [
    ['Cálculo diferencial', 4, 'aprobada'], ['Fundamentos de programación', 3, 'aprobada'], ['Introducción a la ingeniería', 3, 'aprobada'],
    ['Álgebra lineal', 3, 'aprobada'], ['Expresión oral y escrita', 2, 'aprobada'], ['Inglés I', 2, 'aprobada'], ['Vida universitaria', 1, 'aprobada'] ] },
  { nombre: 'Segundo semestre', materias: [
    ['Cálculo integral', 4, 'aprobada'], ['Física mecánica', 3, 'reprobada'], ['Programación orientada a objetos', 3, 'aprobada'],
    ['Matemáticas discretas', 3, 'aprobada'], ['Comunicación académica', 2, 'aprobada'], ['Inglés II', 2, 'aprobada'], ['Ciudadanía y convivencia', 1, 'aprobada'] ] },
  { nombre: 'Tercer semestre', materias: [
    ['Cálculo multivariable', 4, 'aprobada'], ['Estructuras de datos', 3, 'aprobada'], ['Bases de datos', 3, 'aprobada'],
    ['Probabilidad y estadística', 3, 'en-curso'], ['Arquitectura de computadores', 2, 'en-curso'], ['Inglés III', 2, 'en-curso'], ['Ética profesional', 1, 'en-curso'] ] },
  { nombre: 'Cuarto semestre', materias: [
    ['Ecuaciones diferenciales', 4, 'no-vista'], ['Análisis de algoritmos', 3, 'no-vista'], ['Ingeniería de software I', 3, 'no-vista'],
    ['Sistemas operativos', 3, 'no-vista'], ['Redes de computadores', 2, 'no-vista'], ['Inglés IV', 2, 'no-vista'], ['Creatividad e innovación', 1, 'no-vista'] ] },
  { nombre: 'Quinto semestre', materias: [
    ['Modelado y simulación', 4, 'no-vista'], ['Ingeniería de software II', 3, 'no-vista'], ['Desarrollo web', 3, 'no-vista'],
    ['Sistemas distribuidos', 3, 'no-vista'], ['Interacción humano-computador', 2, 'no-vista'], ['Electiva de formación I', 2, 'no-vista'], ['Emprendimiento', 1, 'no-vista'] ] },
  { nombre: 'Sexto semestre', materias: [
    ['Inteligencia artificial', 4, 'no-vista'], ['Seguridad informática', 3, 'no-vista'], ['Desarrollo móvil', 3, 'no-vista'],
    ['Computación en la nube', 3, 'no-vista'], ['Gestión de proyectos', 2, 'no-vista'], ['Electiva de formación II', 2, 'no-vista'], ['Investigación aplicada', 1, 'no-vista'] ] },
  { nombre: 'Séptimo semestre', materias: [
    ['Proyecto de grado I', 4, 'no-vista'], ['Ciencia de datos', 3, 'no-vista'], ['Arquitectura de software', 3, 'no-vista'],
    ['Electiva profesional I', 3, 'no-vista'], ['Calidad de software', 2, 'no-vista'], ['Gestión tecnológica', 2, 'no-vista'], ['Seminario de investigación', 1, 'no-vista'] ] },
  { nombre: 'Octavo semestre', materias: [
    ['Proyecto de grado II', 4, 'no-vista'], ['Práctica profesional', 3, 'no-vista'], ['Electiva profesional II', 3, 'no-vista'],
    ['Electiva profesional III', 3, 'no-vista'], ['Transformación digital', 2, 'no-vista'], ['Innovación tecnológica', 2, 'no-vista'], ['Seminario de grado', 1, 'no-vista'] ] },
];

// Cómo se ve cada estado: clase CSS, ícono y texto para lectores de pantalla
const ESTADOS = {
  'aprobada':  { clase: 'st--ok',   icono: 'st-ok',   texto: 'Aprobada' },
  'reprobada': { clase: 'st--bad',  icono: 'st-bad',  texto: 'Reprobada' },
  'en-curso':  { clase: 'st--now',  icono: 'st-now',  texto: 'En curso' },
  'no-vista':  { clase: 'st--none', icono: 'st-none', texto: 'No vista' },
};

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render() {
  let totalMaterias = 0;
  let totalCreditos = 0;

  document.getElementById('semestres').innerHTML = semestres.map((s) => {
    const creditos = s.materias.reduce((suma, m) => suma + m[1], 0);
    totalMaterias += s.materias.length;
    totalCreditos += creditos;

    const filas = s.materias.map(([nombre, cred, estado]) => {
      const e = ESTADOS[estado];
      return `<tr class="${e.clase}">
        <td><svg class="icon" aria-hidden="true"><use href="#${e.icono}"/></svg><span>${esc(nombre)}</span><span class="sr-only"> (${e.texto})</span></td>
        <td>${cred}</td>
      </tr>`;
    }).join('');

    return `<article class="sem">
      <header class="sem__head"><h2>${esc(s.nombre)}</h2><span>${creditos} créditos</span></header>
      <table>
        <thead><tr><th>Asignatura</th><th>Créd.</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </article>`;
  }).join('');

  document.getElementById('totales').textContent =
    `${semestres.length} semestres · ${totalMaterias} asignaturas · ${totalCreditos} créditos`;
}

render();