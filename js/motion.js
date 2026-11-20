(function () {
  'use strict';

  /* =====================================================================
     KONFIGURASI LINK KY PROJECT
     ===================================================================== */
  var KY_LINKS = {
    github: 'https://github.com/kzdyang',
    privacyPolicy: 'https://kzdyang.github.io/dompetrumah-privacy/'
  };

  /* Disusun hanya saat pengguna mengklik tombol kontak (anti-scraper HTML) */
  var CONTACT_CODES = [55, 107, 122, 100, 46, 121, 97, 110, 103, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
  function resolveContactEmail() {
    return String.fromCharCode.apply(null, CONTACT_CODES);
  }

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
    document.querySelectorAll('[data-contact-email]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var addr = resolveContactEmail();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(addr).then(function () {
            showToast('Alamat email dukungan disalin ke clipboard.');
          }).catch(function () {
            window.location.href = 'mailto:' + addr;
          });
        } else {
          window.location.href = 'mailto:' + addr;
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
      darkImg: 'phone-beranda-dark.png',
      lightImg: 'phone-beranda-light.png',
      alt: 'Layar Beranda DompetRumah'
    },
    dompet: {
      note: 'Semua rekening bank, e-wallet, dan uang tunai dalam satu daftar.',
      darkImg: 'phone-dompet-dark.png',
      lightImg: 'phone-dompet-light.png',
      alt: 'Daftar dompet DompetRumah'
    },
    catat: {
      note: 'Catat transaksi cepat dengan pratinjau sisa saldo sebelum simpan.',
      darkImg: 'phone-catat-dark.png',
      lightImg: 'phone-catat-light.png',
      alt: 'Form catat transaksi DompetRumah'
    },
    laporan: {
      note: 'Distribusi kategori, tren arus kas, rasio belanja, & rincian 12 bulan.',
      darkImg: 'phone-laporan-dark.png',
      lightImg: 'phone-laporan-light.png',
      alt: 'Laporan keuangan DompetRumah'
    },
    tema: {
      note: '9 palet warna nyaman (terang & gelap) yang lolos kontras WCAG AA.',
      darkImg: 'phone-tema-dark.png',
      lightImg: 'phone-tema-light.png',
      alt: 'Pilihan 9 tema warna DompetRumah'
    }
  };

  var SCREEN_ORDER = ['beranda', 'dompet', 'catat', 'laporan', 'tema'];

  function preloadStageAssets(basePath) {
    var seen = {};
    SCREEN_ORDER.forEach(function (k) {
      var item = SCREENS[k];
      if (!item) return;
      [item.darkImg, item.lightImg].forEach(function (file) {
        if (!file || seen[file]) return;
        seen[file] = true;
        var loader = new Image();
        loader.src = basePath + file;
      });
    });
  }

  function triggerGlassSweep(sweepEl, durationSec) {
    if (!sweepEl || !window.gsap || reduceMotion) return;
    window.gsap.killTweensOf(sweepEl);
    window.gsap.fromTo(
      sweepEl,
      { xPercent: -140, opacity: 0 },
      { xPercent: 270, opacity: 0.85, duration: durationSec || 0.72, ease: 'power2.inOut', onComplete: function () {
        window.gsap.set(sweepEl, { opacity: 0 });
      } }
    );
  }

  function initProductStage() {
    var wrap = document.getElementById('stagePhoneWrap');
    var phone = document.getElementById('showcasePhone');
    var img = document.getElementById('showcaseImg');
    var ghost = document.getElementById('showcaseGhost');
    var sweepEl = document.getElementById('phoneSweep');
    var noteEl = document.getElementById('stageNote');
    var modeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-stage-mode]'));
    var screenTabs = Array.prototype.slice.call(document.querySelectorAll('[data-screen-key]'));
    if (!phone || !img) return;

    var basePath = img.getAttribute('data-asset-base') || './assets/';
    preloadStageAssets(basePath);

    var activeMode = 'dark';
    var activeKey = 'beranda';
    var prevOrder = 0;

    function renderStage(opts) {
      opts = opts || {};
      var item = SCREENS[activeKey] || SCREENS.beranda;
      var nextFile = activeMode === 'light' ? item.lightImg : item.darkImg;
      var nextSrc = basePath + nextFile;
      var prevSrc = img.getAttribute('src') || nextSrc;
      var nextOrder = SCREEN_ORDER.indexOf(activeKey);
      if (nextOrder < 0) nextOrder = 0;
      var dir = nextOrder >= prevOrder ? 1 : -1;
      prevOrder = nextOrder;

      phone.setAttribute('data-mode', activeMode);
      phone.setAttribute('data-screen', activeKey);
      if (wrap) {
        wrap.setAttribute('data-mode', activeMode);
        wrap.setAttribute('data-screen', activeKey);
      }
      modeBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-stage-mode') === activeMode ? 'true' : 'false');
      });

      screenTabs.forEach(function (t) {
        var on = t.getAttribute('data-screen-key') === activeKey;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });

      if (noteEl && noteEl.textContent !== item.note) {
        noteEl.textContent = item.note;
        if (window.gsap && !reduceMotion) {
          window.gsap.fromTo(noteEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' });
        }
      }

      if (prevSrc === nextSrc && img.getAttribute('alt') === item.alt) {
        return;
      }

      var gsap = window.gsap;
      if (gsap && !reduceMotion && ghost) {
        gsap.killTweensOf([img, ghost, phone]);
        ghost.setAttribute('src', prevSrc);
        img.setAttribute('src', nextSrc);
        img.setAttribute('alt', item.alt);

        if (opts.isModeSwitch) {
          gsap.fromTo(ghost,
            { opacity: 1, xPercent: 0, scale: 1, filter: 'blur(0px)' },
            { opacity: 0, xPercent: 0, scale: 1.035, filter: 'blur(7px)', duration: 0.62, ease: 'power3.inOut' }
          );
          gsap.fromTo(img,
            { opacity: 0.35, xPercent: 0, scale: 0.955 },
            { opacity: 1, xPercent: 0, scale: 1, duration: 0.72, ease: 'expo.out' }
          );
          gsap.fromTo(phone,
            { rotationX: 4, scale: 0.976 },
            { rotationX: 0, scale: 1, duration: 0.78, ease: 'expo.out' }
          );
          triggerGlassSweep(sweepEl, 0.85);
        } else {
          gsap.fromTo(ghost,
            { opacity: 1, xPercent: 0, scale: 1, filter: 'blur(0px)' },
            { opacity: 0, xPercent: -dir * 34, scale: 0.94, filter: 'blur(4px)', duration: 0.48, ease: 'power3.inOut' }
          );
          gsap.fromTo(img,
            { opacity: 0, xPercent: dir * 38, scale: 1.04 },
            { opacity: 1, xPercent: 0, scale: 1, duration: 0.58, ease: 'expo.out' }
          );
          gsap.fromTo(phone,
            { rotationY: dir * 6.5 },
            { rotationY: 0, duration: 0.72, ease: 'expo.out' }
          );
          triggerGlassSweep(sweepEl, 0.66);
        }
        return;
      }

      phone.classList.add('is-switching');
      setTimeout(function () {
        img.src = nextSrc;
        img.alt = item.alt;
        phone.classList.remove('is-switching');
      }, reduceMotion ? 0 : 100);
    }

    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetMode = btn.getAttribute('data-stage-mode') || 'dark';
        if (targetMode === activeMode) return;
        activeMode = targetMode;
        renderStage({ isModeSwitch: true });
      });
    });

    screenTabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        var nextKey = tab.getAttribute('data-screen-key') || 'beranda';
        if (nextKey === activeKey) return;
        activeKey = nextKey;
        renderStage({ isModeSwitch: false });
      });
      tab.addEventListener('keydown', function (ev) {
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        ev.preventDefault();
        var next = ev.key === 'ArrowRight' ? (idx + 1) % screenTabs.length : (idx - 1 + screenTabs.length) % screenTabs.length;
        screenTabs[next].focus();
        activeKey = screenTabs[next].getAttribute('data-screen-key') || 'beranda';
        renderStage({ isModeSwitch: false });
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
      var isHero = !!el.closest('.hero');
      var words = splitPlainTextHeading(el);
      if (words.length) {
        gsap.from(words, {
          yPercent: 105,
          opacity: isHero ? 0.85 : 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.028,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      } else {
        gsap.from(el, {
          y: isHero ? 14 : 18,
          opacity: isHero ? 0.92 : 0,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
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

    var stageWrap = document.getElementById('stagePhoneWrap');
    var phoneEl = document.getElementById('showcasePhone');
    var glowEl = stageWrap ? stageWrap.querySelector('.stage-phone-glow') : null;
    var sweepEl = document.getElementById('phoneSweep');

    if (phoneEl) {
      gsap.fromTo(phoneEl,
        { y: 28, scale: 0.93, rotationY: -10, rotationX: 5 },
        { y: 0, scale: 1, rotationY: 0, rotationX: 0, duration: 1.15, ease: 'expo.out' }
      );
      if (glowEl) {
        gsap.fromTo(glowEl,
          { scale: 0.72, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }
        );
      }
      triggerGlassSweep(sweepEl, 1.05);

      var floatTween = gsap.to(phoneEl, {
        y: -5,
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.25
      });

      if (stageWrap && !coarsePointer) {
        stageWrap.addEventListener('pointerenter', function () {
          floatTween.pause();
        });
        stageWrap.addEventListener('pointerleave', function () {
          floatTween.resume();
        });
      }
    }

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

      if (stageWrap && phoneEl) {
        var rxTo = gsap.quickTo(stageWrap, 'rotationY', { duration: 0.55, ease: 'power3.out' });
        var ryTo = gsap.quickTo(stageWrap, 'rotationX', { duration: 0.55, ease: 'power3.out' });
        stageWrap.addEventListener('pointermove', function (ev) {
          var r = stageWrap.getBoundingClientRect();
          var nx = (ev.clientX - r.left) / r.width;
          var ny = (ev.clientY - r.top) / r.height;
          rxTo((nx - 0.5) * 11);
          ryTo(-(ny - 0.5) * 8);
          stageWrap.style.setProperty('--glare-x', Math.round(nx * 100) + '%');
          stageWrap.style.setProperty('--glare-y', Math.round(ny * 100) + '%');
        });
        stageWrap.addEventListener('pointerleave', function () {
          rxTo(0);
          ryTo(0);
          stageWrap.style.setProperty('--glare-x', '28%');
          stageWrap.style.setProperty('--glare-y', '18%');
        });
      }
    }

    /* Sudah dipanggil pada event load; refresh sekali untuk posisi gambar */
    ScrollTrigger.refresh();
  }

  wireSocialLinks();
  initCopyButtons();
  initMobileNav();
  initProductStage();
  initFaq();
  initPointerGlow();
  initAtmosphereCanvas();

  if (document.readyState === 'complete') {
    initMotion();
  } else {
    window.addEventListener('load', initMotion);
  }
})();
