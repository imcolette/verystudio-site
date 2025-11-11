// Very Studio — Minimal Template v1 JS
// Lightbox / Slider / Touch / Keyboard + Portrait Auto Detect

/* ----------------- 自動判斷直幅圖片（首頁用） ----------------- */
document.querySelectorAll('.thumb').forEach(img => {
  img.onload = () => {
    if (img.naturalHeight > img.naturalWidth) {
      img.classList.add('is-portrait');
    }
  };
});

/* ----------------- Lightbox 核心（首頁用） ----------------- */
const cards = document.querySelectorAll('.card');
const lb = document.getElementById('lightbox');
const lbTitle = document.getElementById('lbTitle');
const track = document.getElementById('track');
const viewport = document.getElementById('viewport');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnClose = document.getElementById('btnClose');

let slides = [];
let index = 0;
let dragging = false, startX = 0, lastX = 0;

function setIndex(i) {
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(${(-index * 100)}%)`;
}

function openLightbox(project) {
  track.innerHTML = '';
  slides = [];
  index = 0;

  lbTitle.textContent = project.title;

  project.images.forEach(src => {
    const s = document.createElement('div');
    s.className = 'slide';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src;
    s.appendChild(img);
    track.appendChild(s);
    slides.push(s);
  });

  setIndex(0);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

if (cards.length > 0) {
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.getAttribute('data-project'));
      openLightbox(data);
    });
  });
}

if (btnClose) btnClose.addEventListener('click', closeLightbox);
if (btnPrev) btnPrev.addEventListener('click', () => setIndex(index - 1));
if (btnNext) btnNext.addEventListener('click', () => setIndex(index + 1));

window.addEventListener('keydown', e => {
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') setIndex(index - 1);
  if (e.key === 'ArrowRight') setIndex(index + 1);
  if (e.key === 'Escape') closeLightbox();
});

/* ----------------- Lightbox 拖曳 / Touch 滑動 ----------------- */
function onDown(x) {
  dragging = true;
  startX = x;
  lastX = x;
  track.classList.add('dragging');
}
function onMove(x) {
  if (!dragging) return;
  lastX = x;
  const dx = x - startX;
  track.style.transform = `translateX(${(-index * 100) + (dx / viewport.clientWidth * 100)}%)`;
}
function onUp() {
  if (!dragging) return;
  dragging = false;
  track.classList.remove('dragging');
  const dx = lastX - startX;
  const threshold = viewport.clientWidth * 0.15;
  if (Math.abs(dx) > threshold) {
    setIndex(index + (dx < 0 ? 1 : -1));
  } else {
    setIndex(index);
  }
}

if (viewport) {
  viewport.addEventListener('pointerdown', e => {
    if (!lb.classList.contains('open')) return;
    viewport.setPointerCapture(e.pointerId);
    onDown(e.clientX);
  });
  viewport.addEventListener('pointermove', e => onMove(e.clientX));
  viewport.addEventListener('pointerup', onUp);
  viewport.addEventListener('pointercancel', onUp);
}

/* ----------------- ✅ Project HERO 點擊左右切換 + 箭頭 ----------------- */
const hero = document.getElementById('hero');

if (hero) {
  const heroImgs = hero.querySelectorAll('img');
  const heroCap = document.querySelector('.img-caption');
  const arrowLeft = hero.querySelector('.hero-arrow.left');
  const arrowRight = hero.querySelector('.hero-arrow.right');

  let heroIndex = 0;

  function heroShow(i) {
    heroIndex = (i + heroImgs.length) % heroImgs.length;
    heroImgs.forEach((img, idx) => img.classList.toggle('active', idx === heroIndex));
    if (heroCap) heroCap.textContent = heroImgs[heroIndex].dataset.caption;
  }

  /* ✅ 點擊半區切換 */
  hero.addEventListener('click', e => {
    if (e.target.classList.contains('hero-arrow')) return;
    const box = hero.getBoundingClientRect();
    const isLeft = (e.clientX - box.left) < box.width / 2;
    heroShow(heroIndex + (isLeft ? -1 : 1));
  });

  /* ✅ 點擊箭頭 */
  arrowLeft.addEventListener('click', e => {
    e.stopPropagation();
    heroShow(heroIndex - 1);
  });
  arrowRight.addEventListener('click', e => {
    e.stopPropagation();
    heroShow(heroIndex + 1);
  });
}

// End of file
