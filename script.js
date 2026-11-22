(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const header = document.querySelector('.site-header');
  const toTopButton = document.querySelector('.to-top-button');
  const yearElement = document.getElementById('current-year');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!menuToggle || !primaryNav) return;
    const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'فتح قائمة التنقل');
    primaryNav.classList.remove('open');
    if (restoreFocus && wasOpen) menuToggle.focus();
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'فتح قائمة التنقل' : 'إغلاق قائمة التنقل');
      primaryNav.classList.toggle('open', !isOpen);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
      }
    });

    document.addEventListener('click', (event) => {
      if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const updateScrollUI = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', scrollY > 10);
    if (toTopButton) toTopButton.classList.toggle('visible', scrollY > 520);
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  if (toTopButton) {
    toTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const matches = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', matches);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
      revealElements.forEach((element) => revealObserver.observe(element));
      document.documentElement.classList.add('js-reveal-ready');
    } catch (error) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    }
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Hide the compact navigation only after its event handlers are initialized.
  document.documentElement.classList.add('js-ready');
})();
