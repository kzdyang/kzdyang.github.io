(function () {
  'use strict';

  /* =====================================================================
     KONFIGURASI LINK KY PROJECT
     ===================================================================== */
  var KY_LINKS = {
    github: 'https://github.com/kzdyang',
    privacyPolicy: 'https://kzdyang.github.io/dompetrumah-privacy/',
    email: '7kzd.yang@gmail.com'
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  function wireSocialLinks() {
    var map = {
      github: KY_LINKS.github,
      privacy: KY_LINKS.privacyPolicy
    };
    document.querySelectorAll('[data-ky-link]').forEach(function (el) {
      var key = el.getAttribute('data-ky-link');
      if (map[key]) el.setAttribute('href', map[key]);
    });
  }

  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('kyToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 2400);
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var email = btn.getAttribute('data-copy-email') || KY_LINKS.email;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            showToast('Email disalin: ' + email);
          }).catch(function () {
            showToast('Email: ' + email);
          });
        } else {
          showToast('Email: ' + email);
        }
      });
    });
  }

  function initMobileNav() {
    var toggle = document.getElementById('menuToggle');
    var drawer = document.getElementById('mobileDrawer');
    if (!toggle || !drawer) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------------- Interactive DompetRumah Stage ---------------- */
  var SCREENS = {
    beranda: {
      note: 'Ringkasan total saldo, pemasukan, dan pengeluaran bulan ini.',
      darkImg: '08-beranda-gelap.png',
      lightImg: '01-beranda.png',
      alt: 'Layar Beranda DompetRumah'
    },
    dompet: {
      note: 'Semua rekening bank, e-wallet, dan uang tunai dalam satu daftar.',
      darkImg: '05-dompet.png',
      lightImg: '05-dompet.png',
      alt: 'Daftar dompet DompetRumah'
    },
    catat: {
      note: 'Catat transaksi cepat dengan pratinjau sisa saldo sebelum simpan.',
      darkImg: '02-catat-transaksi.png',
      lightImg: '02-catat-transaksi.png',
      alt: 'Form catat transaksi DompetRumah'
    },
    laporan: {
      note: 'Distribusi kategori, tren arus kas, rasio belanja, & rincian 12 bulan.',
      darkImg: '03-laporan.png',
      lightImg: '03-laporan.png',
      alt: 'Laporan keuangan DompetRumah'
    },
    tema: {
      note: '9 palet warna nyaman (terang & gelap) yang lolos kontras WCAG AA.',
      darkImg: '07-tema.png',
      lightImg: '07-tema.png',
      alt: 'Pilihan 9 tema warna DompetRumah'
    }
  };

  function initProductStage() {
    var wrap = document.getElementById('stagePhoneWrap');
    var phone = document.getElementById('showcasePhone');
    var img = document.getElementById('showcaseImg');
    var noteEl = document.getElementById('stageNote');
    var modeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-stage-mode]'));
    var screenTabs = Array.prototype.slice.call(document.querySelectorAll('[data-screen-key]'));
    if (!phone || !img) return;

    var basePath = img.getAttribute('data-asset-base') || './assets/';
    var activeMode = 'dark';
    var activeKey = 'beranda';

    function renderStage() {
      var item = SCREENS[activeKey] || SCREENS.beranda;
      var nextFile = activeMode === 'light' ? item.lightImg : item.darkImg;

      phone.setAttribute('data-mode', activeMode);
      if (wrap) wrap.setAttribute('data-mode', activeMode);
      modeBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-stage-mode') === activeMode ? 'true' : 'false');
      });

      screenTabs.forEach(function (t) {
        var on = t.getAttribute('data-screen-key') === activeKey;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });

      phone.classList.add('is-switching');
      setTimeout(function () {
        img.src = basePath + nextFile;
        img.alt = item.alt;
        if (noteEl) noteEl.textContent = item.note;
        phone.classList.remove('is-switching');
      }, reduceMotion ? 0 : 100);
    }

    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeMode = btn.getAttribute('data-stage-mode') || 'dark';
        if (activeKey !== 'beranda') activeKey = 'beranda';
        renderStage();
      });
    });

    screenTabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        activeKey = tab.getAttribute('data-screen-key') || 'beranda';
        renderStage();
      });
      tab.addEventListener('keydown', function (ev) {
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        ev.preventDefault();
        var next = ev.key === 'ArrowRight' ? (idx + 1) % screenTabs.length : (idx - 1 + screenTabs.length) % screenTabs.length;
        screenTabs[next].focus();
        activeKey = screenTabs[next].getAttribute('data-screen-key') || 'beranda';
        renderStage();
      });
    });
  }

  function initFaq() {
    document.querySelectorAll('.faq-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
      });
    });
  }

  /* ---------------- Pointer Atmosphere Glow (Ringan) ---------------- */
  function initPointerGlow() {
    if (reduceMotion || coarsePointer) return;
    var rootStyle = document.documentElement.style;
    var ticking = false;
    var lx = 50;
    var ly = 24;

    window.addEventListener('pointermove', function (ev) {
      lx = Math.round((ev.clientX / window.innerWidth) * 100);
      ly = Math.round((ev.clientY / window.innerHeight) * 100);
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        rootStyle.setProperty('--mx', lx + '%');
        rootStyle.setProperty('--my', ly + '%');
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- Canvas Atmosphere Vertical Folds ---------------- */
  function initAtmosphereCanvas() {
    if (reduceMotion) return;
    var canvas = document.getElementById('atmosphereCanvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = 0;
    var h = 0;
    var rafId = 0;
    var paused = false;

    var folds = [
      { x: 0.18, width: 0.24, speed: 0.22, amp: 0.04, phase: 0.5, color: 'rgba(226, 178, 133, 0.07)' },
      { x: 0.45, width: 0.28, speed: 0.16, amp: 0.05, phase: 1.9, color: 'rgba(52, 211, 153, 0.055)' },
      { x: 0.72, width: 0.25, speed: 0.20, amp: 0.04, phase: 3.1, color: 'rgba(226, 178, 133, 0.085)' },
      { x: 0.90, width: 0.22, speed: 0.18, amp: 0.03, phase: 4.7, color: 'rgba(226, 178, 133, 0.10)' }
    ];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      if (paused) {
        rafId = 0;
        return;
      }
      var t = now * 0.00042;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'screen';

      for (var i = 0; i < folds.length; i++) {
        var f = folds[i];
        var cx = (f.x + Math.sin(t * f.speed + f.phase) * f.amp) * w;
        var halfW = f.width * w * 0.5;
        var g = ctx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.5, f.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - halfW, 0, halfW * 2, h);
      }

      rafId = window.requestAnimationFrame(draw);
    }

    resize();
    rafId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
      if (!paused && !rafId) rafId = window.requestAnimationFrame(draw);
    });
  }

  /* ---------------- Lenis + GSAP Motion + Progress Bar ---------------- */
  function splitPlainTextHeading(el) {
    if (!el || el.getAttribute('data-split-ready') === 'true') return [];
    if (el.children.length > 0) return [];
    var text = (el.textContent || '').trim();
    if (!text) return [];
    el.setAttribute('aria-label', text);
    var parts = text.split(/(\s+)/);
    el.textContent = '';

    var words = [];
    parts.forEach(function (part) {
      if (!part.trim()) {
        el.appendChild(document.createTextNode(part));
        return;
      }
      var mask = document.createElement('span');
      var inner = document.createElement('span');
      mask.className = 'word-mask';
      mask.setAttribute('aria-hidden', 'true');
      inner.className = 'word-inner';
      inner.textContent = part;
      mask.appendChild(inner);
      el.appendChild(mask);
      words.push(inner);
    });
    el.setAttribute('data-split-ready', 'true');
    return words;
  }

  function initMotion() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis && !coarsePointer) {
      var lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.92 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);

      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (ev) {
          var id = anchor.getAttribute('href');
          if (!id || id === '#') return;
          var target = document.querySelector(id);
          if (!target) return;
          ev.preventDefault();
          lenis.scrollTo(target, { offset: -68 });
        });
      });
    }

    var progress = document.getElementById('scrollProgress');
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.25 }
      });
    }

    gsap.utils.toArray('[data-masked-reveal]').forEach(function (el) {
      var words = splitPlainTextHeading(el);
      if (words.length) {
        gsap.from(words, {
          yPercent: 105,
          opacity: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.028,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      } else {
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      }
    });

    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    if (!coarsePointer) {
      gsap.utils.toArray('[data-magnetic]').forEach(function (el) {
        var xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power3.out' });
        var yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power3.out' });
        el.addEventListener('pointermove', function (ev) {
          var r = el.getBoundingClientRect();
          xTo((ev.clientX - r.left - r.width / 2) * 0.14);
          yTo((ev.clientY - r.top - r.height / 2) * 0.14);
        });
        el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
      });

      var stageWrap = document.getElementById('stagePhoneWrap');
      var phoneEl = document.getElementById('showcasePhone');
      if (stageWrap && phoneEl) {
        var rxTo = gsap.quickTo(phoneEl, 'rotationY', { duration: 0.55, ease: 'power3.out' });
        var ryTo = gsap.quickTo(phoneEl, 'rotationX', { duration: 0.55, ease: 'power3.out' });
        stageWrap.addEventListener('pointermove', function (ev) {
          var r = stageWrap.getBoundingClientRect();
          rxTo(((ev.clientX - r.left) / r.width - 0.5) * 9);
          ryTo(-((ev.clientY - r.top) / r.height - 0.5) * 7);
        });
        stageWrap.addEventListener('pointerleave', function () { rxTo(0); ryTo(0); });
      }
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  wireSocialLinks();
  initCopyButtons();
  initMobileNav();
  initProductStage();
  initFaq();
  initPointerGlow();
  initAtmosphereCanvas();
  initMotion();
})();
