// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Mobile menu =====
(function () {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

// ===== Header border on scroll + scroll indicator fade =====
(function () {
  const header = document.getElementById('header');
  const indicator = document.getElementById('scrollIndicator');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (indicator) indicator.style.opacity = window.scrollY > 120 ? '0' : '0.55';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== Smooth scroll with sticky-header offset =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const header = document.getElementById('header');
    const offset = (header ? header.offsetHeight : 0) + 8;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== FAQ show more =====
(function () {
  const toggle = document.getElementById('faqToggle');
  const more = document.getElementById('faqMore');
  if (!toggle || !more) return;
  toggle.addEventListener('click', () => {
    const open = more.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Toon minder vragen' : 'Toon alle vragen (+9)';
  });
})();

// ===== Scroll-spy: active nav link =====
(function () {
  const links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  const map = links
    .map(a => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
    .filter(o => o.sec)
    .sort((p, q) => p.sec.offsetTop - q.sec.offsetTop);
  if (!map.length) return;
  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY + (document.getElementById('header')?.offsetHeight || 0) + 40;
    let current = null;
    for (const o of map) {
      if (o.sec.offsetTop <= y) current = o;
    }
    links.forEach(a => a.classList.remove('active'));
    if (current) current.a.classList.add('active');
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  update();
})();

// ===== Contact form =====
// No backend: composes a prefilled e-mail and shows a confirmation.
// To use a real endpoint (e.g. Formspree), set form.action + method="POST"
// and remove the e.preventDefault() branch below.
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');
  const naam = form.querySelector('#cf-naam');
  const email = form.querySelector('#cf-email');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    [naam, email].forEach(f => {
      const valid = f.value.trim() && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) { naam.value.trim() ? email.focus() : naam.focus(); return; }

    const data = new FormData(form);
    const body =
      'Naam: ' + (data.get('naam') || '') + '\n' +
      'Organisatie: ' + (data.get('organisatie') || '') + '\n' +
      'E-mail: ' + (data.get('email') || '') + '\n' +
      'Type dossier: ' + (data.get('type') || '') + '\n\n' +
      (data.get('bericht') || '');
    const href = 'mailto:info@kineticmedical.nl'
      + '?subject=' + encodeURIComponent('Aanvraag verkennend gesprek — ' + (data.get('naam') || ''))
      + '&body=' + encodeURIComponent(body);

    form.style.display = 'none';
    if (success) success.classList.add('show');
    window.location.href = href;
  });

  form.querySelectorAll('input').forEach(f =>
    f.addEventListener('input', () => f.classList.remove('invalid')));
})();

// ===== Modal =====
(function () {
  const modal = document.getElementById('examplesModal');
  if (!modal) return;
  const open = () => { modal.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };

  const thumb = document.getElementById('openExamples');
  const btn = document.getElementById('openExamplesBtn');
  if (thumb) {
    thumb.addEventListener('click', open);
    thumb.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  }
  if (btn) btn.addEventListener('click', open);
  document.getElementById('closeModal').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) close(); });

  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const t = tab.dataset.tab;
      document.querySelectorAll('.modal-tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.mockup-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + t).classList.add('active');
    });
  });
})();
