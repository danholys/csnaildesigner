const filters = [...document.querySelectorAll('.filter-chip')];
const cards = [...document.querySelectorAll('.service-card')];
const serviceGrid = document.querySelector('#service-grid');
const serviceCurrent = document.querySelector('#service-current');
const serviceTotal = document.querySelector('#service-total');
const carouselArrows = [...document.querySelectorAll('.carousel-arrow')];

function visibleServiceCards() {
  return cards.filter(card => !card.hidden);
}

function updateCarouselPosition() {
  const visibleCards = visibleServiceCards();
  if (!visibleCards.length || !serviceCurrent || !serviceTotal) return;
  const gridBounds = serviceGrid.getBoundingClientRect();
  const center = gridBounds.left + serviceGrid.clientWidth / 2;
  const index = visibleCards.reduce((closest, card, i) => {
    const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - center);
    return distance < closest.distance ? { index: i, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  serviceCurrent.textContent = String(index + 1).padStart(2, '0');
  serviceTotal.textContent = String(visibleCards.length).padStart(2, '0');
  carouselArrows.forEach(button => {
    button.disabled = button.dataset.carousel === 'prev' ? index === 0 : index === visibleCards.length - 1;
  });
}

filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-selected', String(active));
  });
  cards.forEach(card => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
  serviceGrid.scrollTo({ left: 0, behavior: 'smooth' });
  updateCarouselPosition();
}));

carouselArrows.forEach(button => button.addEventListener('click', () => {
  const visibleCards = visibleServiceCards();
  if (!visibleCards.length) return;
  const gridBounds = serviceGrid.getBoundingClientRect();
  const center = gridBounds.left + serviceGrid.clientWidth / 2;
  const index = visibleCards.reduce((closest, card, i) => {
    const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - center);
    return distance < closest.distance ? { index: i, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  const nextIndex = Math.max(0, Math.min(visibleCards.length - 1, index + (button.dataset.carousel === 'next' ? 1 : -1)));
  visibleCards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}));

let carouselFrame = 0;
serviceGrid.addEventListener('scroll', () => {
  if (carouselFrame) cancelAnimationFrame(carouselFrame);
  carouselFrame = requestAnimationFrame(() => {
    updateCarouselPosition();
    carouselFrame = 0;
  });
}, { passive: true });
window.addEventListener('resize', updateCarouselPosition);
updateCarouselPosition();

document.querySelectorAll('.select-service').forEach(button => button.addEventListener('click', () => {
  const service = button.dataset.service;
  const text = `Olá, Camila! Gostaria de agendar o serviço: ${service}.`;
  window.open(`https://wa.me/5561991581175?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}));

const links = [...document.querySelectorAll('.mobile-link')];
const sections = links.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  links.forEach(link => {
    const active = link.dataset.section === visible.target.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-22% 0px -58% 0px', threshold: [0, .2, .5] });
sections.forEach(section => observer.observe(section));

const welcomeScreen = document.querySelector('#welcome-screen');
if (welcomeScreen) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let welcomeTimer;
  let welcomeCloseTimer;
  const closeWelcome = () => {
    if (welcomeTimer) clearTimeout(welcomeTimer);
    if (reducedMotion) {
      welcomeScreen.remove();
      return;
    }
    welcomeScreen.classList.add('is-leaving');
    if (welcomeCloseTimer) clearTimeout(welcomeCloseTimer);
    welcomeCloseTimer = setTimeout(() => {
      welcomeScreen.remove();
      document.body.classList.remove('welcome-active');
      document.querySelector('main')?.focus({ preventScroll: true });
    }, 460);
  };
  if (reducedMotion) {
    welcomeScreen.remove();
  } else {
    document.body.classList.add('welcome-active');
    welcomeScreen.focus({ preventScroll: true });
    enterButtons.forEach(button => button.addEventListener('click', closeWelcome));
    welcomeScreen.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeWelcome();
      if (event.key === 'Tab') event.preventDefault();
    });
    welcomeTimer = setTimeout(closeWelcome, 3550);
  }
}
