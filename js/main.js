/**
 * PT MAAL — maal.id Landing Page
 * Navigation, scroll effects, counters, animations
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav__link, .footer__nav a, .hero__actions a[href^="#"]');

  /* Scroll: header, progress bar, back-to-top */
  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    header.classList.toggle('header--scrolled', scrollY > 20);

    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 600);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Mobile navigation */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* Fade-in on scroll */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* Counter animation for stats */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const duration = 1800;
    const start = performance.now();

    function formatValue(val) {
      if (decimals > 0) {
        return val.toFixed(decimals).replace('.', ',') + suffix;
      }
      return Math.round(val) + suffix;
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = formatValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatValue(target);
      }
    }

    requestAnimationFrame(tick);
  }

  const statNumbers = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window && statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* Active nav link */
  const sections = document.querySelectorAll('section[id]');
  const navMenuLinks = document.querySelectorAll('.nav__menu .nav__link:not(.nav__link--cta)');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    navMenuLinks.forEach(function (link) {
      link.classList.toggle('nav__link--active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* Theme & language toggles */
  var langToggle = document.getElementById('langToggle');
  var themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', window.MAAL_toggleTheme);
    window.MAAL_updateThemeIcon();
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = localStorage.getItem('maal-lang') || 'id';
      var next = current === 'id' ? 'en' : 'id';
      window.MAAL_applyLang(next);
    });
  }

  /* Init saved language */
  var savedLang = localStorage.getItem('maal-lang');
  if (savedLang && savedLang !== 'id' && window.MAAL_applyLang) {
    window.MAAL_applyLang(savedLang);
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('faq-item--open');

      document.querySelectorAll('.faq-item--open').forEach(function (openItem) {
        openItem.classList.remove('faq-item--open');
        openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* WhatsApp float */
  window.MAAL_getWhatsAppUrl = function () {
    var cfg = window.MAAL_CONFIG || {};
    var lang = localStorage.getItem('maal-lang') || 'id';
    var msg = (cfg.whatsappMessage && cfg.whatsappMessage[lang]) || cfg.whatsappMessage.id || '';
    return 'https://wa.me/' + (cfg.whatsappPhone || '628131415835') + '?text=' + encodeURIComponent(msg);
  };

  window.MAAL_initWhatsApp = function () {
    var wa = document.getElementById('whatsappFloat');
    if (!wa) return;
    wa.href = window.MAAL_getWhatsAppUrl();
  };

  window.MAAL_showToast = function (message) {
    var toast = document.getElementById('toast');
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('toast--visible');
    clearTimeout(window._maalToastTimer);
    window._maalToastTimer = setTimeout(function () {
      toast.classList.remove('toast--visible');
    }, 4200);
  };

  window.MAAL_initStoreBadges = function () {
    var cfg = window.MAAL_CONFIG || {};
    var lang = localStorage.getItem('maal-lang') || 'id';
    var t = window.MAAL_I18N && window.MAAL_I18N[lang];
    var ios = document.getElementById('appStoreBadge');
    var android = document.getElementById('googlePlayBadge');

    function bindBadge(el, url) {
      if (!el) return;
      var soon = el.querySelector('.store-badge__soon');
      if (url) {
        el.href = url;
        el.removeAttribute('data-store-pending');
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        if (soon) soon.style.display = 'none';
      } else {
        el.href = window.MAAL_getWhatsAppUrl();
        el.setAttribute('data-store-pending', 'true');
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        if (soon) soon.style.display = '';
      }
    }

    bindBadge(ios, cfg.appStoreUrl);
    bindBadge(android, cfg.googlePlayUrl);

    [ios, android].forEach(function (el) {
      if (!el || el.dataset.storeBound) return;
      el.dataset.storeBound = 'true';
      el.addEventListener('click', function (e) {
        if (!el.getAttribute('data-store-pending')) return;
        if (t && t.download && t.download.soonToast) {
          window.MAAL_showToast(t.download.soonToast);
        }
      });
    });
  };

  window.MAAL_initWhatsApp();
  window.MAAL_initStoreBadges();
})();
