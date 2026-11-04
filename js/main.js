/* ============================================================
   RS Properties — Main JavaScript
   ============================================================ */

/* ── NAVBAR ── */
(function () {
  const nav     = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const menu    = document.querySelector('.mobile-menu');
  const close   = document.querySelector('.mobile-close');
  if (!nav) return;

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === '' || currentPage === 'index.html';
  if (isHomePage) {
    const syncNavState = () => {
      if (window.scrollY > 30) nav.classList.add('scrolled'), nav.classList.remove('transparent');
      else                      nav.classList.remove('scrolled'), nav.classList.add('transparent');
    };
    syncNavState();
    window.addEventListener('scroll', syncNavState, { passive: true });
    window.addEventListener('pageshow', syncNavState);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (close && menu) {
    close.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle && toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html') || (page === '' && href === 'index.html'))
      a.classList.add('active');
  });
})();

/* ── HERO SLIDER ── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== current)));
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === current);
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function start() { timer = setInterval(() => goTo(current + 1), 10000); }
  function reset() { clearInterval(timer); start(); }

  start();

  document.querySelector('.hero-prev') && document.querySelector('.hero-prev').addEventListener('click', () => { goTo(current - 1); reset(); });
  document.querySelector('.hero-next') && document.querySelector('.hero-next').addEventListener('click', () => { goTo(current + 1); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));
})();

/* ── ANIMATED COUNTERS ── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur    = 2000;
      const steps  = 60;
      const inc    = target / steps;
      let cur = 0;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= target) { el.textContent = target + suffix; clearInterval(t); }
        else                 el.textContent = Math.floor(cur) + suffix;
      }, dur / steps);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => obs.observe(c));
})();



// Smooth scrolling (Lenis) — respects reduced-motion
function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Lenis = window.Lenis && (window.Lenis.default || window.Lenis);
  if (reduce || typeof Lenis !== 'function') {
    console.warn('[smooth-scroll] skipped:', { reduce, hasLenis: typeof Lenis });
    return;
  }
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  window.lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 });
  });
  console.log('[smooth-scroll] Lenis ready');
}
if (typeof window.Lenis !== 'undefined') {
  initSmoothScroll();
} else {
  window.addEventListener('load', initSmoothScroll);
}

/* ── TESTIMONIAL CAROUSEL ── */
(function () {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.t-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== current)));
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === current);
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function start() { timer = setInterval(() => goTo(current + 1), 5000); }
  function reset() { clearInterval(timer); start(); }

  goTo(current);
  start();

  const prev = document.querySelector('.t-arrow.prev');
  const next = document.querySelector('.t-arrow.next');
  prev && prev.addEventListener('click', () => { goTo(current - 1); reset(); });
  next && next.addEventListener('click', () => { goTo(current + 1); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));
})();

/* ── SCROLL ANIMATIONS ── */
(function () {
  const els = document.querySelectorAll('.animate');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ── PROPERTY FILTERS ── */
(function () {
  const tabs   = document.querySelectorAll('.filter-tab');
  const cards  = document.querySelectorAll('.property-card[data-type]');
  const search = document.getElementById('prop-search');
  if (!tabs.length) return;

  function filter() {
    const active = document.querySelector('.filter-tab.active');
    const type   = active ? active.dataset.filter : 'all';
    const q      = search ? search.value.toLowerCase() : '';
    cards.forEach(c => {
      const typeMatch = type === 'all' || c.dataset.type.toLowerCase() === type.toLowerCase();
      const text      = (c.dataset.title + ' ' + c.dataset.location).toLowerCase();
      const qMatch    = !q || text.includes(q);
      c.style.display = typeMatch && qMatch ? '' : 'none';
    });
  }

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    filter();
  }));
  search && search.addEventListener('input', filter);
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contact-form');
  const succ = document.getElementById('success-message');
  const status = document.getElementById('form-status');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const endpoint = window.APP_CONFIG && window.APP_CONFIG.googleAppsScriptUrl;
    if (!endpoint) {
      if (status) {
        status.textContent = 'This form is not connected yet. Please try again later or call us directly.';
        status.className = 'form-status error';
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    if (status) {
      status.textContent = 'Sending your enquiry...';
      status.className = 'form-status';
    }

    try {
      // Google Apps Script does not expose CORS headers, so this request is sent
      // as a simple form POST. A successful fetch means the submission reached it.
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(form))
      });
      form.style.display = 'none';
      succ && (succ.classList.add('show'));
    } catch (error) {
      if (status) {
        status.textContent = 'We could not send your enquiry. Please try again or call us directly.';
        status.className = 'form-status error';
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "✉ Send Enquiry";
      }
    }
  });
})();

/* â”€â”€ PROJECT SEARCH â”€â”€ */
(function () {
  const tabs = Array.from(document.querySelectorAll('.search-tab[data-project]'));
  const projectType = document.getElementById('hero-project-type');
  const interestSelect = document.getElementById('hero-interest');
  const searchButton = document.getElementById('hero-search');

  const projectInfo = {
    'nature-view-farm': { type: 'Farmland', page: 'nature-view-farm.html', service: 'Farmland Sales' },
    'shree-ramlala-parisar': { type: 'Residential Plots', page: 'shree-ramlala-parisar.html', service: 'Residential Plot Sales' }
  };

  if (searchButton) {
  function selectProject(project) {
    if (!projectInfo[project]) return;
    if (projectType) projectType.value = projectInfo[project].type;
    tabs.forEach(tab => {
      const active = tab.dataset.project === project;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  tabs.forEach(tab => tab.addEventListener('click', () => selectProject(tab.dataset.project)));
  searchButton.addEventListener('click', () => {
    const project = tabs.find(tab => tab.classList.contains('active'))?.dataset.project;
    const info = projectInfo[project];
    if (!info) return;
    const interest = interestSelect ? interestSelect.value : 'details';
    if (interest === 'details') {
      window.location.href = info.page;
      return;
    }
    const query = new URLSearchParams({ project: project, interest: interest });
    window.location.href = `contact.html?${query.toString()}`;
  });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const params = new URLSearchParams(window.location.search);
    const project = params.get('project');
    const interest = params.get('interest');
    const info = projectInfo[project];
    if (info && interest) {
      const interestLabels = {
        'site-visit': 'Arrange a site visit',
        availability: 'Ask about current availability',
        investment: 'Investment consultation'
      };
      const message = document.getElementById('contact-message');
      const service = document.getElementById('contact-service');
      if (service) service.value = interest === 'site-visit' ? 'Site Visit Assistance' : interest === 'investment' ? 'Investment Consultation' : info.service;
      if (message) message.value = `Project: ${project === 'nature-view-farm' ? 'Nature View Farm' : 'Shree Ramlala Parisar'}\nEnquiry: ${interestLabels[interest] || 'Project information'}`;
    }
  }
})();