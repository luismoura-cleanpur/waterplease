/* Water Please — interações v2 */

// ---- Bolhas de hidrogénio (geradas) ----
document.querySelectorAll('[data-bubbles]').forEach(box => {
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = 6 + (i * 37 % 16);
    b.style.width = b.style.height = size + 'px';
    b.style.left = (12 + (i * 53 % 70)) + '%';
    b.style.setProperty('--dur', (6 + (i * 31 % 50) / 10) + 's');
    b.style.setProperty('--del', ((i * 47 % 60) / 10) + 's');
    box.appendChild(b);
  }
});

// ---- Header sombra ao rolar ----
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---- Menu mobile (toggle + X) ----
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('x');
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const a = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// WhatsApp placeholder — Luis: troca WPP_NUMERO pelo número real (formato 351XXXXXXXXX)
const WPP_NUMERO = '351937597148';
const WPP_MSG = encodeURIComponent('Olá! Tenho interesse nos equipamentos de água hidrogenada da Water Please.');
document.querySelectorAll('[data-wpp]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    if (!WPP_NUMERO) { alert('WhatsApp por configurar — Luis, adiciona o número em assets/app.js (WPP_NUMERO).'); return; }
    window.open(`https://wa.me/${WPP_NUMERO}?text=${WPP_MSG}`, '_blank');
  });
});

// Fecha menu mobile ao navegar
document.querySelectorAll('.nav__menu a').forEach(a =>
  a.addEventListener('click', () => {
    navMenu && navMenu.classList.remove('open');
    navToggle && navToggle.classList.remove('x');
  })
);


// ---- Parallax suave do hero (estilo KM0) ----
const heroArt = document.querySelector('.hero__art');
if (heroArt && matchMedia('(pointer:fine)').matches) {
  const hero = heroArt.closest('.hero');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - .5;
    const dy = (e.clientY - r.top) / r.height - .5;
    heroArt.style.transform = `translate(${dx * 18}px, ${dy * 14}px)`;
  });
  hero.addEventListener('mouseleave', () => { heroArt.style.transform = ''; });
}


// ---- Menu lateral: fechar no X; ?menu=1 abre (testes) ----
document.querySelectorAll('.nav__close').forEach(b => b.addEventListener('click', () => {
  navMenu && navMenu.classList.remove('open');
  navToggle && navToggle.classList.remove('x');
}));
if (location.search.includes('menu=1')) navMenu && navMenu.classList.add('open');
