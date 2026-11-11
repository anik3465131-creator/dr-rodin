/* =========================================================
   Александр Родин — main.js
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------------------------------------------------
     Scroll progress + header
     --------------------------------------------------------- */
  var progress = document.getElementById('scrollProgress');
  var header = document.getElementById('siteHeader');
  var lastY = window.scrollY;
  var scrollTicking = false;

  function updateScroll() {
    var y = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.width = (docH > 0 ? Math.min(100, (y / docH) * 100) : 0) + '%';
    }

    if (header) {
      header.classList.toggle('is-scrolled', y > 12);

      if (y > 300 && y > lastY + 4) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 160) header.classList.remove('is-hidden');
    }

    lastY = y;
    scrollTicking = false;
  }

  function requestScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScroll);
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  updateScroll();

  /* ---------------------------------------------------------
     Navigation menu
     --------------------------------------------------------- */
  var siteNav = document.getElementById('siteNav');
  var navToggle = document.querySelector('.nav-toggle');
  var subToggles = document.querySelectorAll('.nav-sub-toggle');

  function closeSubMenus(except) {
    document.querySelectorAll('.has-sub.is-open').forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var btn = item.querySelector('.nav-sub-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove('is-open');
    if (navToggle) {
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Открыть меню');
    }
    if (header) header.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    closeSubMenus();
  }

  if (siteNav && navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      if (header) header.classList.toggle('nav-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      if (!isOpen) closeSubMenus();
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', function (e) {
      if (!siteNav.classList.contains('is-open')) return;
      if (siteNav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });
  }

  subToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.has-sub');
      if (!item) return;
      var willOpen = !item.classList.contains('is-open');
      closeSubMenus(item);
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeSubMenus();
    closeNav();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeSubMenus();
  });

  window.addEventListener('scroll', function () {
    if (document.querySelector('.has-sub.is-open')) closeSubMenus();
  }, { passive: true });

  /* ---------------------------------------------------------
     Video lightbox
     --------------------------------------------------------- */
  var videoModal = document.getElementById('videoModal');
  var videoFrame = document.getElementById('videoFrame');

  function closeVideo() {
    if (!videoModal) return;
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('video-open');
    if (videoFrame) videoFrame.innerHTML = '';
  }

  if (videoModal && videoFrame) {
    document.querySelectorAll('[data-video]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-video');
        var id = btn.getAttribute('data-id') || '';
        var src = '';

        if (type === 'yt') {
          src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
        } else if (type === 'vk') {
          var parts = id.split('_');
          src = 'https://vk.com/video_ext.php?oid=' + parts[0] + '&id=' + parts[1] + '&hd=2&autoplay=1';
        }

        if (!src) return;
        videoFrame.innerHTML = '<iframe src="' + src + '" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="Видео"></iframe>';
        videoModal.classList.add('is-open');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('video-open');
      });
    });

    videoModal.querySelectorAll('[data-video-close]').forEach(function (el) {
      el.addEventListener('click', closeVideo);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeVideo();
    });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealItems = document.querySelectorAll('[data-reveal]');

  if (revealItems.length) {
    if (hasIO && !reduceMotion) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

      revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('is-in'); });
    }
  }

  /* ---------------------------------------------------------
     Counters
     --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var duration = 1500;
    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) window.requestAnimationFrame(tick);
      else el.textContent = target;
    }
    window.requestAnimationFrame(tick);
  }

  if (counters.length && hasIO && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) {
      el.textContent = '0';
      countObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Hero parallax
     --------------------------------------------------------- */
  var hero = document.querySelector('.hero');
  var heroVisual = document.getElementById('heroVisual');

  if (heroVisual && hero && finePointer && !reduceMotion) {
    var px = 0;
    var py = 0;
    var targetX = 0;
    var targetY = 0;
    var raf = null;

    function applyParallax() {
      px += (targetX - px) * 0.08;
      py += (targetY - py) * 0.08;
      heroVisual.style.setProperty('--px', px.toFixed(2) + 'px');
      heroVisual.style.setProperty('--py', py.toFixed(2) + 'px');

      if (Math.abs(targetX - px) > 0.1 || Math.abs(targetY - py) > 0.1) {
        raf = window.requestAnimationFrame(applyParallax);
      } else {
        raf = null;
      }
    }

    function onHeroMove(e) {
      var rect = hero.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * 18;
      targetY = ny * 14;
      if (!raf) raf = window.requestAnimationFrame(applyParallax);
    }

    function onHeroLeave() {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = window.requestAnimationFrame(applyParallax);
    }

    hero.addEventListener('pointermove', onHeroMove);
    hero.addEventListener('pointerleave', onHeroLeave);
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var cx = 0;
      var cy = 0;
      var tx = 0;
      var ty = 0;
      var animating = false;

      function loop() {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        el.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';

        if (Math.abs(tx - cx) > 0.15 || Math.abs(ty - cy) > 0.15) {
          window.requestAnimationFrame(loop);
        } else {
          animating = false;
          if (tx === 0 && ty === 0) el.style.transform = '';
        }
      }

      function start() {
        if (animating) return;
        animating = true;
        window.requestAnimationFrame(loop);
      }

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 22;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 14;
        start();
      });

      el.addEventListener('pointerleave', function () {
        tx = 0;
        ty = 0;
        start();
      });
    });
  }

  /* ---------------------------------------------------------
     Tilt cards
     --------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var base = parseFloat(el.getAttribute('data-tilt-rot')) || 0;

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(700px) rotateX(' + (-ny * 8).toFixed(2) + 'deg) rotateY(' +
          (nx * 10).toFixed(2) + 'deg) rotate(' + base + 'deg) scale(1.02)';
      });

      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var ob = other.querySelector('.faq-q');
        var op = other.querySelector('.faq-panel');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.style.maxHeight = '0px';
      });

      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------
     Reviews slider
     --------------------------------------------------------- */
  var track = document.getElementById('reviewsTrack');
  var bar = document.getElementById('reviewsBar');
  var currentLabel = document.getElementById('reviewsCurrent');
  var totalLabel = document.getElementById('reviewsTotal');
  var prevBtn = document.querySelector('.slider-prev');
  var nextBtn = document.querySelector('.slider-next');

  if (track && prevBtn && nextBtn) {
    var cards = Array.prototype.slice.call(track.querySelectorAll('.review'));
    var ticking = false;

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function visibleCards() {
      return cards.filter(function (card) { return !card.hidden; });
    }

    if (totalLabel) totalLabel.textContent = pad(cards.length);

    function step() {
      var list = visibleCards();
      if (!list.length) return 0;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return list[0].getBoundingClientRect().width + gap;
    }

    function currentIndex() {
      var s = step();
      var list = visibleCards();
      if (!s || !list.length) return 0;
      return Math.max(0, Math.min(list.length - 1, Math.round(track.scrollLeft / s)));
    }

    function update() {
      var list = visibleCards();
      var index = currentIndex();
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      var visible = track.clientWidth / (step() || 1);
      var barWidth = Math.max(12, Math.min(100, (visible / (list.length || 1)) * 100));

      if (bar) {
        var travel = Math.max(0, (track.clientWidth - (track.clientWidth * barWidth / 100)));
        var ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
        bar.style.width = barWidth + '%';
        bar.style.transform = 'translateX(' + (ratio * travel) + 'px)';
      }

      if (currentLabel) currentLabel.textContent = pad(index + 1);
      if (totalLabel) totalLabel.textContent = pad(list.length);

      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    track.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });

    update();

    /* reviews topic filter */
    var filterButtons = document.querySelectorAll('.reviews-filter .filter-chip[data-filter]');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterButtons.forEach(function (other) {
          var active = other === btn;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        cards.forEach(function (card) {
          var topics = (card.getAttribute('data-topic') || '').split(/\s+/);
          card.hidden = filter !== 'all' && topics.indexOf(filter) === -1;
        });

        track.scrollTo({ left: 0, behavior: 'auto' });
        requestUpdate();
      });
    });
  }

  /* ---------------------------------------------------------
     Procedure steps cycling
     --------------------------------------------------------- */
  var steps = document.querySelectorAll('.steps .step');

  if (steps.length > 1 && hasIO && !reduceMotion) {
    var activeStep = 0;
    var stepTimer = null;
    var stepsWrap = document.querySelector('.steps');

    function setStep(i) {
      steps.forEach(function (s, idx) {
        s.classList.toggle('is-active', idx === i);
      });
      activeStep = i;
    }

    function startSteps() {
      if (stepTimer) return;
      stepTimer = window.setInterval(function () {
        setStep((activeStep + 1) % steps.length);
      }, 2600);
    }

    function stopSteps() {
      if (!stepTimer) return;
      window.clearInterval(stepTimer);
      stepTimer = null;
    }

    var stepsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startSteps();
        else stopSteps();
      });
    }, { threshold: 0.4 });

    if (stepsWrap) stepsObserver.observe(stepsWrap);
  }

  /* ---------------------------------------------------------
     Recalculate FAQ heights on resize
     --------------------------------------------------------- */
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-item.is-open .faq-panel').forEach(function (panel) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });
})();
