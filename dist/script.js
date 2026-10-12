const filters = [...document.querySelectorAll('.filter-chip')];
const cards = [...document.querySelectorAll('.service-card')];
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-selected', String(active));
  });
  cards.forEach(card => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
}));

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
