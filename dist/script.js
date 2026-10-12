const dialog = document.querySelector('#booking-dialog');
const openButton = document.querySelector('#open-booking');
const form = document.querySelector('#booking-form');
const status = document.querySelector('.form-status');

openButton.addEventListener('click', () => {
  status.textContent = '';
  dialog.showModal();
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(form);
  const message = `Olá! Meu nome é ${data.get('name')} e gostaria de agendar ${data.get('service')}${data.get('day') ? `, de preferência ${data.get('day')}` : ''}.`;
  try {
    await navigator.clipboard.writeText(message);
    status.textContent = 'Pedido copiado! Agora é só colar e enviar pelo canal de atendimento do estúdio.';
  } catch {
    status.textContent = message;
  }
});

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
}, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .2, .5] });
sections.forEach(section => observer.observe(section));
