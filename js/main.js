// Carrusel de destacados
const slides = [
  { tag: 'Somos comunidad', texto: 'Descubre la vida universitaria' },
  { tag: 'Bienestar', texto: 'Conoce los servicios para cuidar de ti' },
  { tag: 'Biblioteca', texto: 'Explora los recursos digitales' },
];
let actual = 0;

const tag = document.getElementById('hero-tag');
const link = document.getElementById('hero-link');
const dots = document.getElementById('dots');
const counter = document.getElementById('counter');

slides.forEach(() => { const d = document.createElement('span'); d.className = 'dot'; dots.appendChild(d); });

function mostrar(i) {
  actual = (i + slides.length) % slides.length;
  tag.textContent = slides[actual].tag;
  link.firstChild.textContent = slides[actual].texto + ' ';
  [...dots.children].forEach((d, n) => d.setAttribute('aria-current', String(n === actual)));
  counter.textContent = `0${actual + 1} / 0${slides.length}`;
}
document.getElementById('prev').addEventListener('click', () => mostrar(actual - 1));
document.getElementById('next').addEventListener('click', () => mostrar(actual + 1));
mostrar(0);

// Menú de navegación (estado abierto/cerrado; falta agregar los submenús)
document.querySelectorAll('.nav button').forEach((btn) => {
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') !== 'true'));
});
