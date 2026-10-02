/* ==========================================================================
   Cínthia Lunardi — Estética Odontológica
   Interações: header, menu, revelações, FAQ, antes/depois, WhatsApp
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ ano atual ------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --------------------------- header no scroll -------------------------- */
  var header = document.querySelector('[data-header]');
  var waFloat = document.querySelector('.wa-float');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 32);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 420);
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  onScroll();

  /* ------------------------------- menu ---------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && nav) {
      var first = nav.querySelector('a');
      if (first) window.setTimeout(function () { first.focus(); }, 120);
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('nav-open'));
    });
  }

  if (nav) {
    nav.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A') setMenu(false);
    });

    /* mantém o foco dentro do menu aberto */
    nav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !document.body.classList.contains('nav-open')) return;
      var items = nav.querySelectorAll('a');
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setMenu(false);
      if (burger) burger.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && document.body.classList.contains('nav-open')) setMenu(false);
  });

  /* ---------------------------- revelações ------------------------------- */
  var reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--d', d);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });
  }

  /* -------------------------- link ativo no menu ------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var linkById = {};
    Array.prototype.forEach.call(navLinks, function (a) {
      linkById[a.getAttribute('href').slice(1)] = a;
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkById[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(navLinks, function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Array.prototype.forEach.call(sections, function (s) { spy.observe(s); });
  }

  /* ------------------------------- FAQ ----------------------------------- */
  var accordionBtns = document.querySelectorAll('.acc__btn');

  Array.prototype.forEach.call(accordionBtns, function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc');
      if (!item) return;
      var isOpen = item.classList.contains('is-open');

      Array.prototype.forEach.call(document.querySelectorAll('.acc.is-open'), function (open) {
        open.classList.remove('is-open');
        var b = open.querySelector('.acc__btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------- âncoras com rolagem suave ----------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#') return;

    var dest = document.querySelector(id);
    if (!dest) return;

    e.preventDefault();
    dest.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', id);
  });
})();
