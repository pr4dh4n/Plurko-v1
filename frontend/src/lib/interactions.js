// Ported from the original index.html inline script. Runs once after mount.
// GSAP + ScrollTrigger are loaded as globals via index.html.
let _inited = false;
export function initInteractions() {
  if (_inited) return; _inited = true;
  'use strict';
  try {

  var storedThemeEarly = localStorage.getItem('plurko-theme');
  if (storedThemeEarly) {
    document.documentElement.setAttribute('data-theme', storedThemeEarly);
  }

  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch) {
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  if (!isTouch && cursorDot) {
    (function animateCursor() {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursorDot.style.transform = 'translate3d(' + (curX - 6) + 'px,' + (curY - 6) + 'px,0)';
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .product-card, .step-card, .capability-card, .blog-card, .problem-card, input, select, textarea').forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursorDot.classList.add('hovering'); });
      el.addEventListener('mouseleave', function() { cursorDot.classList.remove('hovering'); });
    });
  }

  (function() {
    if (isTouch || window.innerWidth < 768) return;
    var hero = document.getElementById('hero');
    var canvas = document.getElementById('pixelTrail');
    if (!hero || !canvas) return;
    var ctx = canvas.getContext('2d');

    var SQ = 8;
    var RADIUS = 2;
    var DECAY = 0.004;
    var cols, rows, grid;
    var dpr = window.devicePixelRatio || 1;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    function resize() {
      var w = hero.offsetWidth;
      var h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / SQ);
      rows = Math.ceil(h / SQ);
      grid = new Float32Array(cols * rows);
    }
    resize();
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    var observer = new MutationObserver(function() {
      isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cc = Math.floor(x / SQ);
      var cr = Math.floor(y / SQ);
      for (var dr = -RADIUS; dr <= RADIUS; dr++) {
        for (var dc = -RADIUS; dc <= RADIUS; dc++) {
          var r = cr + dr, c = cc + dc;
          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
          var dist = Math.sqrt(dr * dr + dc * dc);
          var strength = Math.max(0, 1 - dist / (RADIUS + 0.5));
          var idx = r * cols + c;
          if (strength > grid[idx]) grid[idx] = strength;
        }
      }
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      var baseR = 232, baseG = 184, baseB = 75;
      var glowR = 255, glowG = 232, glowB = 120;
      var maxAlpha = isDark ? 0.85 : 0.55;

      for (var i = 0; i < grid.length; i++) {
        if (grid[i] < 0.005) { grid[i] = 0; continue; }
        var a = grid[i];
        var col = i % cols;
        var row = (i - col) / cols;
        var blend = a;
        var cr = baseR + (glowR - baseR) * blend * 0.3;
        var cg = baseG + (glowG - baseG) * blend * 0.3;
        var cb = baseB + (glowB - baseB) * blend * 0.3;
        ctx.fillStyle = 'rgba(' + (cr|0) + ',' + (cg|0) + ',' + (cb|0) + ',' + (a * maxAlpha).toFixed(3) + ')';
        ctx.fillRect(col * SQ, row * SQ, SQ - 1, SQ - 1);
        grid[i] -= DECAY;
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  const smoothWrapper = document.getElementById('smooth-wrapper');
  const smoothContent = document.getElementById('smooth-content');

  if (!isTouch && smoothWrapper && smoothContent) {
    let current = 0;
    let target = 0;
    let ease = 0.1;

    function setBodyHeight() {
      document.body.style.height = smoothContent.scrollHeight + 'px';
    }
    setBodyHeight();
    window.addEventListener('resize', function() {
      setBodyHeight();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
    // Keep the scroll height in sync when content resizes (e.g. inquiry-form step change)
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function() { setBodyHeight(); }).observe(smoothContent);
    }

    window.addEventListener('scroll', function() {
      target = window.scrollY;
    }, { passive: true });

    (function smoothScroll() {
      current += (target - current) * ease;
      smoothContent.style.transform = 'translate3d(0,' + (-current) + 'px,0)';
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      requestAnimationFrame(smoothScroll);
    })();
  }

  var header = document.getElementById('siteHeader');
  var headerLogo = document.getElementById('headerLogo');
  var lastHeaderY = window.scrollY || 0;
  var headerAcc = 0;

  function updateHeader() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Slide the header away on scroll, with hysteresis so momentum jitter never flickers it
    var delta = y - lastHeaderY;
    if ((delta > 0) !== (headerAcc > 0)) headerAcc = 0; // direction changed -> reset accumulator
    headerAcc += delta;
    if (y <= 80) {
      header.classList.remove('header-hidden');           // always visible near the top
    } else if (headerAcc > 70) {
      header.classList.add('header-hidden');              // sustained scroll down -> hide
      headerAcc = 0;
    } else if (headerAcc < -45) {
      header.classList.remove('header-hidden');           // sustained scroll up -> reveal
      headerAcc = 0;
    }
    lastHeaderY = y;
    if (headerLogo) headerLogo.src = isDark ? 'assets/images/logo-dark.png' : 'assets/images/logo-light.png';
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  var hamburger = document.getElementById('hamburgerBtn');
  var menuOverlay = document.getElementById('menuOverlay');
  var menuBackdrop = document.getElementById('menuBackdrop');
  var menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active', menuOpen);
    menuOverlay.classList.toggle('open', menuOpen);
    menuBackdrop.classList.toggle('visible', menuOpen);
    header.classList.toggle('menu-open', menuOpen);
    smoothWrapper.classList.toggle('pushed', menuOpen);

    if (menuOpen) {
      menuOverlay.querySelector('a').focus();
    }
  }
  hamburger.addEventListener('click', toggleMenu);

  menuBackdrop.addEventListener('click', function() {
    if (menuOpen) toggleMenu();
  });

  menuOverlay.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      if (menuOpen) toggleMenu();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOpen) toggleMenu();
  });

  (function() {
    var l1 = document.getElementById('megaL1');
    var l2 = document.getElementById('megaL2');
    var l3 = document.getElementById('megaL3');
    var ipCoresLink = document.querySelector('.menu-overlay nav a[data-mega="ip-cores"]');
    if (!l1 || !ipCoresLink) return;

    var megaActive = false;
    var hideTimeout = null;
    var activeL1Key = null;
    var activeL2Key = null;
    var l1Built = false;

    var CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

    function shortLabel(cat) {
      return cat
        .replace(/ IP Cores?$/i, '')
        .replace(/^High speed interface$/i, 'Interface')
        .replace(/^Peripheral and Cryptographic$/i, 'Peripheral & Crypto');
    }

    function countLeaves(obj) {
      if (Array.isArray(obj)) return obj.length;
      var n = 0;
      Object.keys(obj).forEach(function(k) { n += countLeaves(obj[k]); });
      return n;
    }

    function ensureL1() {
      if (l1Built) return;
      l1Built = true;
      var head = document.createElement('div');
      head.className = 'mega-col-head';
      head.textContent = 'Product Categories';
      l1.appendChild(head);

      // Single level: hovering Product reveals only the categories (each its own button)
      Object.keys(PRODUCT_TREE).forEach(function(cat) {
        var row = document.createElement('a');
        row.className = 'mega-row';
        row.href = 'ip-core-products.html';
        row.innerHTML = '<span>' + shortLabel(cat) + '</span>';
        l1.appendChild(row);
      });
    }

    function selectL1(cat) {
      if (activeL1Key === cat) return;
      activeL1Key = cat;
      activeL2Key = null;

      l1.querySelectorAll('.mega-row').forEach(function(r) {
        r.classList.toggle('active', r.getAttribute('data-key') === cat);
      });

      l3.classList.remove('open');
      l2.innerHTML = '';
      var head = document.createElement('div');
      head.className = 'mega-col-head';
      head.textContent = shortLabel(cat);
      l2.appendChild(head);

      var data = PRODUCT_TREE[cat];

      if (Array.isArray(data)) {
        data.forEach(function(product) {
          var row = document.createElement('a');
          row.className = 'mega-row';
          row.href = '#';
          row.innerHTML = '<span>' + product + '</span>';
          row.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateToProduct(product);
          });
          l2.appendChild(row);
        });
      } else {
        Object.keys(data).forEach(function(sub) {
          var row = document.createElement('div');
          row.className = 'mega-row';
          row.setAttribute('data-key', sub);
          var count = data[sub].length;
          row.innerHTML = '<span>' + sub + '<span class="mega-count">' + count + '</span></span>' + CHEVRON;
          row.addEventListener('mouseenter', function() { selectL2(cat, sub); });
          l2.appendChild(row);
        });
      }

      l2.classList.add('open');
    }

    function selectL2(cat, sub) {
      if (activeL2Key === sub) return;
      activeL2Key = sub;

      l2.querySelectorAll('.mega-row').forEach(function(r) {
        r.classList.toggle('active', r.getAttribute('data-key') === sub);
      });

      l3.innerHTML = '';
      var head = document.createElement('div');
      head.className = 'mega-col-head';
      head.textContent = sub;
      l3.appendChild(head);

      PRODUCT_TREE[cat][sub].forEach(function(product) {
        var row = document.createElement('a');
        row.className = 'mega-row';
        row.href = 'product-pcie-gen5.html';
        row.innerHTML = '<span>' + product + '</span>';
        l3.appendChild(row);
      });

      l3.classList.add('open');
    }

    function navigateToProduct(name) {
      closeAll();
      if (menuOpen) toggleMenu();
      var sec = document.getElementById('offerings');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      setTimeout(function() {
        var input = document.getElementById('headerSearchInput');
        if (input) {
          input.value = name;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      }, 600);
    }

    function showMega() {
      clearTimeout(hideTimeout);
      if (megaActive) return;
      megaActive = true;
      activeL1Key = null;
      activeL2Key = null;
      ensureL1();
      l1.querySelectorAll('.mega-row').forEach(function(r) { r.classList.remove('active'); });
      l2.classList.remove('open');
      l3.classList.remove('open');
      l1.classList.add('open');
    }

    function hideMega() {
      hideTimeout = setTimeout(closeAll, 250);
    }

    function closeAll() {
      megaActive = false;
      activeL1Key = null;
      activeL2Key = null;
      l1.classList.remove('open');
      l2.classList.remove('open');
      l3.classList.remove('open');
    }

    function cancelHide() { clearTimeout(hideTimeout); }

    ipCoresLink.addEventListener('mouseenter', showMega);
    ipCoresLink.addEventListener('mouseleave', hideMega);
    [l1, l2, l3].forEach(function(col) {
      col.addEventListener('mouseenter', cancelHide);
      col.addEventListener('mouseleave', hideMega);
    });
    ipCoresLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!megaActive) showMega(); else closeAll();
    });
    var megaObs = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class' && !menuOverlay.classList.contains('open') && megaActive) {
          closeAll();
        }
      });
    });
    megaObs.observe(menuOverlay, { attributes: true });
  })();

  (function() {
    var section = document.querySelector('.marquee-section');
    var track = document.getElementById('marqueeTrack');
    if (!section || !track) return;

    var speed = 0.4;
    var direction = -1;
    var pos = 0;
    var halfW = 0;
    var currentSpeed = speed;
    var targetSpeed = speed;

    function measure() {
      halfW = track.scrollWidth / 2;
    }
    measure();
    window.addEventListener('resize', measure);

    section.addEventListener('mouseenter', function() { targetSpeed = 0; });
    section.addEventListener('mouseleave', function() { targetSpeed = speed; });

    function tick() {
      currentSpeed += (targetSpeed - currentSpeed) * 0.04;
      var spd = currentSpeed;
      pos += direction * spd;
      if (pos <= -halfW) pos += halfW;
      if (pos >= 0) pos -= halfW;
      track.style.transform = 'translate3d(' + pos.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  (function() {
    var track = document.querySelector('.protocol-ticker-track');
    if (!track) return;
    var pos = 0;
    var halfW = track.scrollWidth / 2;
    window.addEventListener('resize', function() { halfW = track.scrollWidth / 2; });
    function tick() {
      pos -= 0.4;
      if (pos <= -halfW) pos += halfW;
      track.style.transform = 'translate3d(' + pos.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        if (el.classList.contains('gsap-up')) { revealObserver.unobserve(el); return; }
        var delay = el.style.getPropertyValue('--i');
        if (delay) {
          el.style.transitionDelay = (parseInt(delay) * 0.1) + 's';
        }
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el) { revealObserver.observe(el); });

  var splitWords = document.querySelectorAll('.split-word');
  var splitObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var spans = el.querySelectorAll('span');
        spans.forEach(function(span, i) {
          span.style.transitionDelay = (i * 0.12) + 's';
        });
        el.classList.add('visible');
        splitObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  splitWords.forEach(function(el) { splitObserver.observe(el); });

  var countEls = document.querySelectorAll('[data-count]');
  var countObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var current = 0;
      var step = Math.ceil(target / 45);
      var iv = setInterval(function() {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(iv);
      }, 25);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.3 });
  countEls.forEach(function(el) { countObserver.observe(el); });

  // How It Works: animated line reveal + stagger cards
  var hiwGrid = document.querySelector('.howitworks-grid');
  if (hiwGrid) {
    var hiwObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          hiwGrid.classList.add('line-revealed');
          // Stagger the cards
          hiwGrid.querySelectorAll('.howitworks-card').forEach(function(card, i) {
            card.style.transitionDelay = (i * 0.15) + 's';
          });
          hiwObserver.unobserve(hiwGrid);
        }
      });
    }, { threshold: 0.3 });
    hiwObserver.observe(hiwGrid);
  }

  var barFills = document.querySelectorAll('.progress-fill, .bar-fill, .table-progress-fill');
  var barObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var w = el.getAttribute('data-width');
        el.style.width = w + '%';
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  barFills.forEach(function(el) { barObserver.observe(el); });

  var stackCards = document.querySelectorAll('.stack-card');
  if (stackCards.length) {
    var stackObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var el = entry.target;
        var idx = parseInt(el.getAttribute('data-stack'));
        if (entry.isIntersecting) {
          var ratio = entry.intersectionRatio;
          stackCards.forEach(function(card, i) {
            if (i < idx) {
              var pushBack = (idx - i) * 0.03;
              card.style.transform = 'scale(' + (1 - pushBack) + ') translateY(' + (-(idx - i) * 10) + 'px)';
              card.style.opacity = 1 - (idx - i) * 0.15;
            }
          });
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    stackCards.forEach(function(card) { stackObserver.observe(card); });
  }

  var parallaxEls = document.querySelectorAll('[data-speed]');
  if (parallaxEls.length && !isTouch) {
    var parallaxTicking = false;
    window.addEventListener('scroll', function() {
      if (!parallaxTicking) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          parallaxEls.forEach(function(el) {
            var speed = parseFloat(el.getAttribute('data-speed'));
            var yPos = -(scrollY * speed);
            el.style.transform = 'translate3d(0,' + yPos + 'px,0)';
          });
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    var introTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    introTL.fromTo('.hero-slide.active .hero-slide-bg', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0);
    /* bg image scale intro disabled — caused vibration */
    introTL.fromTo('.hero-orb--1', { opacity: 0, scale: 0.5 }, {
      opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out'
    }, 0.3);
    introTL.fromTo('.hero-orb--2', { opacity: 0, scale: 0.4 }, {
      opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out'
    }, 0.5);
    introTL.fromTo('.hero-orb--3', { opacity: 0, scale: 0.3 }, {
      opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out'
    }, 0.7);
    introTL.fromTo('.hero-glow', { opacity: 0, scale: 0.6 }, {
      opacity: 0.6, scale: 1, duration: 1.4, ease: 'power2.out'
    }, 0.4);
    introTL.to('.site-header', {
      opacity: 1, y: 0, duration: 0.7, clearProps: 'all'
    }, 0.3);
    introTL.fromTo('.header-logo', { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.6, clearProps: 'all'
    }, 0.5);
    introTL.fromTo('.header-right', { opacity: 0, x: 20 }, {
      opacity: 1, x: 0, duration: 0.6, clearProps: 'all'
    }, 0.5);
    introTL.fromTo('.hero-tag', {
      clipPath: 'inset(0 100% 0 0)', opacity: 0
    }, {
      clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, clearProps: 'clipPath'
    }, 0.6);
    var heroSpans = document.querySelectorAll('#heroHeadline span');
    heroSpans.forEach(function(span, i) {
      introTL.fromTo(span, { y: '110%', opacity: 0 }, {
        y: '0%', opacity: 1, duration: 0.7, ease: 'power4.out'
      }, 0.75 + i * 0.08);
    });
    introTL.fromTo('.hero-slide.active .hero-sub', { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7
    }, 2.05);
    introTL.fromTo('.hero-slide.active .hero-cta', { scale: 0.8, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)', clearProps: 'transform'
    }, 2.85);
    introTL.fromTo('.hero-dots', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.6
    }, 3.3);
    introTL.fromTo('.hero-arrows', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.6
    }, 3.3);
    introTL.fromTo('.hero-visual', { opacity: 0, scale: 0.85, rotation: -5 }, {
      opacity: 0.12, scale: 1, rotation: 0, duration: 1.2, ease: 'power2.out'
    }, 0.9);
    introTL.fromTo('.hero-grain', { opacity: 0 }, {
      opacity: 0.035, duration: 1.5
    }, 0.8);
    introTL.fromTo('.section-divider:first-of-type', { scaleX: 0 }, {
      scaleX: 1, duration: 1, ease: 'power2.inOut', clearProps: 'transform'
    }, 1.6);
    introTL.call(function() {
      var heroBg = document.querySelector('.hero-slide.active .hero-slide-bg');
      /* drift disabled */
    }, null, 2);
    introTL.call(function() {
      document.getElementById('heroHeadline').classList.add('visible');
      document.querySelectorAll('.hero .reveal').forEach(function(el) {
        el.classList.add('visible');
      });
      document.querySelectorAll('.intro-hidden').forEach(function(el) {
        el.classList.remove('intro-hidden');
      });
    }, null, 1.5);

    gsap.utils.toArray('.gsap-up').forEach(function(el) {
      var staggerIndex = parseInt(getComputedStyle(el).getPropertyValue('--i')) || 0;
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: staggerIndex * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onComplete: function() {
            gsap.set(el, { clearProps: 'all' });
            el.classList.remove('gsap-up');
          }
        }
      );
    });

    gsap.utils.toArray('.section-divider').forEach(function(el) {
      gsap.fromTo(el,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        }
      );
    });

    gsap.utils.toArray('.section-reveal').forEach(function(el) {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });

    gsap.utils.toArray('.wipe-in').forEach(function(el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function() { el.classList.add('revealed'); }
      });
    });

    gsap.utils.toArray('.stagger-child').forEach(function(el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function() { el.classList.add('visible'); }
      });
    });

  }

  document.querySelectorAll('.form-input, .form-select').forEach(function(input) {
    var group = input.closest('.form-group');
    if (!group) return;
    input.addEventListener('input', function() {
      group.classList.toggle('has-value', input.value.length > 0);
    });
    input.addEventListener('change', function() {
      group.classList.toggle('has-value', input.value.length > 0);
    });
  });

  var isDarkTheme = function() { return document.documentElement.getAttribute('data-theme') === 'dark'; };
  document.querySelectorAll('.form-select').forEach(function(sel) {
    sel.addEventListener('focus', function() {
      var color = isDarkTheme() ? 'rgba(255,209,102,1)' : 'rgba(116,72,151,1)';
      sel.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='" + encodeURIComponent(color) + "' stroke-width='2'%3E%3Cpath d='M18 15l-6-6-6 6'/%3E%3C/svg%3E\")";
    });
    sel.addEventListener('blur', function() {
      var color = isDarkTheme() ? 'rgba(255,255,255,0.4)' : 'rgba(34,34,34,0.4)';
      sel.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='" + encodeURIComponent(color) + "' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";
    });
  });

  // Multi-step form
  var form = document.getElementById('inquiryForm');
  var stepFill = document.getElementById('stepFill');
  var stepLabels = document.querySelectorAll('.step-label');
  var formSteps = document.querySelectorAll('.form-step');
  var currentStep = 0;
  var totalSteps = formSteps.length;

  function goToStep(idx) {
    var startH = form.offsetHeight;
    formSteps[currentStep].classList.remove('active');
    stepLabels[currentStep].classList.remove('active');
    stepLabels[currentStep].classList.add('done');
    currentStep = idx;
    formSteps[currentStep].classList.add('active');
    // Update labels
    stepLabels.forEach(function(l, i) {
      l.classList.remove('active', 'done');
      if (i < currentStep) l.classList.add('done');
      if (i === currentStep) l.classList.add('active');
    });
    // Update progress bar
    stepFill.style.width = ((currentStep + 1) / totalSteps * 100) + '%';
    // Re-init floating labels for new step
    formSteps[currentStep].querySelectorAll('.form-input, .form-select').forEach(function(input) {
      var group = input.closest('.form-group');
      if (group && input.value && input.value.length > 0) group.classList.add('has-value');
    });
    // Smoothly animate the form height between steps (no jump, no empty gap)
    form.style.height = 'auto';
    var endH = form.offsetHeight;
    form.style.height = startH + 'px';
    void form.offsetHeight; // force reflow
    form.style.height = endH + 'px';
  }
  if (form) form.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'height') form.style.height = '';
  });

  document.querySelectorAll('.form-next-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var next = parseInt(this.getAttribute('data-next'));
      goToStep(next);
    });
  });
  document.querySelectorAll('.form-back-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var back = parseInt(this.getAttribute('data-back'));
      goToStep(back);
    });
  });
  // Step headings are clickable to jump between steps
  stepLabels.forEach(function(label) {
    label.addEventListener('click', function() {
      var s = parseInt(this.getAttribute('data-step'));
      if (!isNaN(s) && s !== currentStep) goToStep(s);
    });
  });

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = {};
      form.querySelectorAll('input, select, textarea').forEach(function(el) {
        if (el.id || el.name) data[el.id || el.name] = el.value;
      });
      console.log('PlurkoTech Inquiry Submitted:', data);
      alert('Thank you for your inquiry! Our engineering team will be in touch shortly.');
      form.reset();
      form.querySelectorAll('.form-group').forEach(function(g) { g.classList.remove('has-value'); });
      form.querySelectorAll('.license-card input').forEach(function(r) { r.checked = false; });
      goToStep(0);
    });
  }

  var PRODUCT_TREE = {
    "High speed interface IP Core": {
      "PCIe": ["PCIe Gen 5 Controller","PCIe Gen 4 Controller","PCIe Gen 3 Controller","PCIe Gen 2 Controller","PCIe Gen 5 PHY","PCIe Gen 4 PHY","PCIe Gen 3 PHY","PCIe Gen 2 PHY","PCIe Gen 5 Switch"],
      "USB": ["USB4 Host Controller","USB 3.2 Controller","USB 2.0 OTG Controller","USB 2.0 PHY","USB 3.2 PHY","USB Type-C Controller","USB PD Controller"],
      "Ethernet": ["10G Ethernet MAC","25G Ethernet MAC","100G Ethernet MAC","10G Ethernet PHY","25G Ethernet PHY","1G Ethernet MAC","1G SGMII PHY","TSN Ethernet Switch"],
      "MIPI": ["MIPI D-PHY","MIPI C-PHY","MIPI CSI-2 Controller","MIPI DSI-2 Controller","MIPI M-PHY","MIPI UniPro"],
      "SerDes": ["28G LR SerDes","56G PAM4 SerDes","112G PAM4 SerDes","16G SR SerDes"],
      "CXL": ["CXL 2.0 Controller","CXL 3.0 Controller","CXL 2.0 PHY"],
      "UCIe": ["UCIe 1.1 Controller","UCIe 1.1 PHY"],
      "Die-to-Die": ["BoW Die-to-Die Interface","HBI 2.0 Die-to-Die"]
    },
    "Memory IP Core": {
      "DDR": ["DDR5 Controller","DDR4 Controller","DDR5 PHY","DDR4 PHY","LPDDR5 Controller","LPDDR5 PHY","LPDDR4X Controller","LPDDR4X PHY"],
      "HBM": ["HBM3 Controller","HBM3 PHY","HBM2E Controller","HBM2E PHY"],
      "GDDR": ["GDDR6 Controller","GDDR6 PHY","GDDR7 Controller"],
      "Flash / Storage": ["eMMC 5.1 Controller","UFS 4.0 Controller","NVMe Controller","ONFI Flash Controller","SD/SDIO Controller"],
      "SRAM / ROM": ["High-Density SRAM Compiler","Ultra-Low-Power SRAM","ROM Compiler","Register File Compiler","Multi-Port SRAM"]
    },
    "Peripheral and Cryptographic IP Core": {
      "Security": ["AES-128/256 Engine","SHA-2/SHA-3 Engine","RSA/ECC Public Key Accelerator","TRNG (True Random Number Generator)","Inline AES-XTS for Storage","MACsec Engine","IPsec Engine","Crypto Coprocessor"],
      "AMBA / Bus": ["AXI4 Interconnect","AHB-Lite Bridge","APB Bridge","AXI-to-AHB Bridge","NOC (Network on Chip)"],
      "Peripheral": ["I2C Controller","SPI Controller","UART Controller","I3C Controller","CAN-FD Controller","GPIO Controller","Timer / Watchdog","DMA Controller","Interrupt Controller"],
      "Display": ["HDMI 2.1 TX Controller","HDMI 2.1 RX Controller","DisplayPort 2.0 TX","DisplayPort 2.0 RX","LVDS TX/RX","eDP 1.4 Controller"]
    },
    "Analog IP Core": {
      "ADC/DAC": ["12-bit 8 GSPS ADC","14-bit 600 MSPS ADC","12-bit 200 MSPS ADC","10-bit 2.5 GSPS ADC","16-bit 5 MSPS DAC","12-bit 1.6 GSPS DAC","14-bit 8 GSPS DAC","6-bit 1 GSPS ADC","12-bit 4 GSPS IQ ADC","7-bit 64 GSPS ADC"],
      "PLL": ["High Performance PLL 3.5GHz","Low Jitter 250 MHz PLL","200-500 MHz PLL","GNSS ADPLL L1","GNSS ADPLL L5"],
      "AFE": ["8-Ch 2.4 GSPS AFE","16 ADC + 18 DAC Integrated AFE","14-bit Swift ADC + PGA AFE","8-Ch 10-bit 2.5 GS/s AFE"],
      "LDO": ["LDO 1.1V 30mA","LDO 1.8V 300mA","LDO Capless 25mA","LDO 5V-3.3V Input"],
      "PVT / Sensor": ["Temperature Voltage Monitor","PVT Monitor with Interrupt","Latch-Up Protection Module"],
      "Oscillator": ["16 MHz RC Oscillator","32.768 kHz RC Oscillator","16 MHz Temp-Stable Oscillator"]
    },
    "Verification IP Cores": ["CAN VIP","LIN VIP","SPI VIP","UART VIP","A-PHY VIP","UCIe VIP","USB4 VIP","GDDR6 UVM VIP","CPRI VIP","JESD204B VIP","MIPI I3C UVM VIP","AXI VIP","AHB Lite VIP","LPC Controller VIP"],
    "EDA Tools": ["SoC Generator","Chip Agent — Agentic AI for Chip Design"]
  };

  function flattenTree(obj, category, subcategory, path) {
    var results = [];
    if (Array.isArray(obj)) {
      obj.forEach(function(name) { results.push({ name: name, category: category || '', subcategory: subcategory || '', path: path.concat([name]) }); });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(function(key) {
        results = results.concat(flattenTree(obj[key], category || key, key, path.concat([key])));
      });
    }
    return results;
  }
  var IP_DATABASE = flattenTree(PRODUCT_TREE, '', '', []);

  var topCatMap = {
    'High speed interface IP Core': 'interface',
    'Memory IP Core': 'memory',
    'Peripheral and Cryptographic IP Core': 'security',
    'Analog IP Core': 'analog',
    'Verification IP Cores': 'security',
    'EDA Tools': 'analog'
  };

  var ipDatabase = IP_DATABASE.map(function(ip) {
    return { name: ip.name, cat: topCatMap[ip.category] || 'interface', desc: ip.path.slice(0, -1).join(' > ') };
  });

  var hsWrap = document.getElementById('headerSearch');
  var hsInput = document.getElementById('headerSearchInput');
  var hsClear = document.getElementById('headerSearchClear');
  var hsResults = document.getElementById('headerSearchResults');
  var hsActiveIdx = -1;
  var hsExpanded = false;

  function hsHighlight(text, query) {
    if (!query) return text;
    var esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>');
  }

  function hsRender(query) {
    var q = (query || '').toLowerCase().trim();
    var filtered = ipDatabase;
    if (q) {
      filtered = ipDatabase.filter(function(ip) {
        return ip.name.toLowerCase().indexOf(q) !== -1 || ip.desc.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filtered.length === 0) {
      hsResults.innerHTML = '<div class="hs-empty">No IP cores found for \u201c' + (query || '').replace(/</g, '&lt;') + '\u201d</div>';
      hsActiveIdx = -1;
      return;
    }
    var shown = filtered.slice(0, 30);
    var html = '<div class="hs-count">' + filtered.length + ' result' + (filtered.length !== 1 ? 's' : '') + '</div>';
    shown.forEach(function(ip, i) {
      html += '<div class="hs-item" data-idx="' + i + '">'
        + '<span class="hs-cat hs-cat--' + ip.cat + '">' + ip.cat + '</span>'
        + '<div class="hs-body">'
        +   '<div class="hs-name">' + hsHighlight(ip.name, q) + '</div>'
        +   '<div class="hs-desc">' + hsHighlight(ip.desc, q) + '</div>'
        + '</div>'
        + '<svg class="hs-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>'
        + '</div>';
    });
    if (filtered.length > 30) {
      html += '<div class="hs-empty">+ ' + (filtered.length - 30) + ' more results...</div>';
    }
    html += '<div class="hs-footer"><kbd>Ctrl+K</kbd> full search</div>';
    hsResults.innerHTML = html;
    hsActiveIdx = -1;
  }

  function hsExpand() {
    if (hsExpanded) return;
    hsExpanded = true;
    hsWrap.classList.add('expanded');
    setTimeout(function() { hsInput.focus(); }, 200);
    if (hsInput.value.trim().length > 0) {
      hsRender(hsInput.value);
      hsResults.classList.add('visible');
    }
  }

  function hsCollapse() {
    if (!hsExpanded) return;
    hsExpanded = false;
    hsWrap.classList.remove('expanded', 'has-value');
    hsInput.value = '';
    hsInput.blur();
    hsResults.classList.remove('visible');
  }

  hsWrap.addEventListener('mouseenter', hsExpand);
  hsWrap.querySelector('.header-search__icon').addEventListener('click', function() {
    if (!hsExpanded) hsExpand();
    else hsInput.focus();
  });
  hsWrap.addEventListener('mouseleave', function() {
    if (document.activeElement !== hsInput) hsCollapse();
  });
  hsInput.addEventListener('blur', function() {
    setTimeout(function() {
      if (!hsWrap.matches(':hover')) hsCollapse();
    }, 200);
  });
  hsInput.addEventListener('input', function() {
    var v = hsInput.value;
    hsWrap.classList.toggle('has-value', v.length > 0);
    hsRender(v);
    if (v.length > 0) hsResults.classList.add('visible');
  });

  hsClear.addEventListener('click', function(e) {
    e.stopPropagation();
    hsInput.value = '';
    hsWrap.classList.remove('has-value');
    hsRender('');
    hsInput.focus();
  });

  hsInput.addEventListener('keydown', function(e) {
    var items = hsResults.querySelectorAll('.hs-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      hsActiveIdx = hsActiveIdx >= items.length - 1 ? 0 : hsActiveIdx + 1;
      items.forEach(function(el) { el.classList.remove('active'); });
      if (items[hsActiveIdx]) { items[hsActiveIdx].classList.add('active'); items[hsActiveIdx].scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      hsActiveIdx = hsActiveIdx <= 0 ? items.length - 1 : hsActiveIdx - 1;
      items.forEach(function(el) { el.classList.remove('active'); });
      if (items[hsActiveIdx]) { items[hsActiveIdx].classList.add('active'); items[hsActiveIdx].scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'Enter' && hsActiveIdx >= 0 && items[hsActiveIdx]) {
      e.preventDefault();
      var name = items[hsActiveIdx].querySelector('.hs-name').textContent;
      hsInput.value = name;
      hsCollapse();
    } else if (e.key === 'Escape') {
      hsCollapse();
    }
  });

  hsResults.addEventListener('click', function(e) {
    var item = e.target.closest('.hs-item');
    if (item) {
      var name = item.querySelector('.hs-name').textContent;
      hsInput.value = name;
      hsCollapse();
    }
  });
  hsResults.addEventListener('mousemove', function(e) {
    var item = e.target.closest('.hs-item');
    if (item) {
      hsResults.querySelectorAll('.hs-item').forEach(function(el) { el.classList.remove('active'); });
      item.classList.add('active');
      hsActiveIdx = parseInt(item.dataset.idx, 10);
    }
  });

  var searchPopup = document.getElementById('searchPopup');
  var searchPopupQuery = document.getElementById('searchPopupQuery');
  var searchPopupBtn = document.getElementById('searchPopupBtn');
  var popupBuffer = '';
  var popupTimer = null;
  var heroSection = document.querySelector('.hero');

  function showPopup() {
    searchPopupQuery.textContent = popupBuffer;
    searchPopup.style.left = Math.min(mouseX + 16, window.innerWidth - 260) + 'px';
    searchPopup.style.top = Math.max(mouseY - 50, 8) + 'px';
    searchPopup.classList.add('visible');
  }

  function hidePopup() {
    searchPopup.classList.remove('visible');
    popupBuffer = '';
    clearTimeout(popupTimer);
  }

  function commitSearch() {
    if (!popupBuffer.trim()) return;
    hsExpand();
    hsInput.value = popupBuffer.trim();
    hsWrap.classList.add('has-value');
    hsRender(popupBuffer.trim());
    hidePopup();
  }

  function isInHeroZone() {
    if (!heroSection) return false;
    var rect = heroSection.getBoundingClientRect();
    return rect.bottom > 0 && mouseY <= rect.bottom;
  }

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (hsExpanded) hsCollapse();
      else hsExpand();
      return;
    }

    if (e.key === 'Escape') {
      if (hsExpanded) hsCollapse();
      hidePopup();
      return;
    }
    if (hsExpanded) return;
    var active = document.activeElement;
    var isField = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);
    if (isField) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (isInHeroZone()) {
      if (e.key.length === 1) {
        e.preventDefault();
        hsExpand();
        hsInput.value = e.key;
        hsWrap.classList.add('has-value');
        hsRender(e.key);
      }
      return;
    }

    if (e.key === 'Enter' && popupBuffer) { e.preventDefault(); commitSearch(); return; }
    if (e.key === 'Backspace' && popupBuffer) {
      e.preventDefault();
      popupBuffer = popupBuffer.slice(0, -1);
      if (!popupBuffer) { hidePopup(); return; }
      showPopup();
      clearTimeout(popupTimer);
      popupTimer = setTimeout(hidePopup, 4000);
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      popupBuffer += e.key;
      showPopup();
      clearTimeout(popupTimer);
      popupTimer = setTimeout(hidePopup, 4000);
    }
  });

  searchPopupBtn.addEventListener('click', commitSearch);

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('plurko-theme', next);
      if (headerLogo) {
        headerLogo.src = next === 'dark' ? 'assets/images/logo-dark.png' : 'assets/images/logo-light.png';
      }
      var footerLogo = document.getElementById('footerLogo');
      if (footerLogo) footerLogo.src = 'assets/images/logo-dark.png';
    });
  }

  var hasSmoother = !isTouch && smoothWrapper && smoothContent;
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        if (hasSmoother) {
          window.scrollTo({ top: top, behavior: 'auto' });
        } else {
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // Expand panels — Offerings (hover to expand)
  (function() {
    var panels = document.querySelectorAll('.expand-panel');
    if (!panels.length) return;
    panels.forEach(function(panel) {
      panel.addEventListener('mouseenter', function() {
        if (panel.classList.contains('active')) return;
        panels.forEach(function(p) { p.classList.remove('active'); });
        panel.classList.add('active');
      });
    });
  })();

  // Why showcase — tabbed
  (function() {
    var tabs = document.querySelectorAll('.why-tab');
    var slides = document.querySelectorAll('.why-showcase-slide');
    if (!tabs.length) return;

    function showSlide(idx) {
      tabs.forEach(function(t, i) {
        t.classList.remove('active');
        if (i < idx) t.classList.add('done');
        else t.classList.remove('done');
      });
      slides.forEach(function(s) { s.classList.remove('active'); });
      // Force reflow so progress bar restarts from 0
      void tabs[idx].offsetWidth;
      tabs[idx].classList.add('active');
      slides[idx].classList.add('active');
    }

    tabs.forEach(function(tab, i) {
      tab.addEventListener('click', function() { current = i; showSlide(i); });
    });

    // Trigger first tab's progress bar
    void tabs[0].offsetWidth;
    tabs[0].classList.remove('active');
    void tabs[0].offsetWidth;
    tabs[0].classList.add('active');

    // Auto-rotate every 4s
    var current = 0;
    var auto = setInterval(function() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 4000);
    var showcase = document.getElementById('whyShowcase');
    if (showcase) {
      showcase.addEventListener('mouseenter', function() { clearInterval(auto); });
      showcase.addEventListener('mouseleave', function() {
        auto = setInterval(function() {
          current = (current + 1) % slides.length;
          showSlide(current);
        }, 4000);
      });
    }
  })();

  // Blog coverflow carousel
  (function(){
    var stage = document.getElementById('blogStage');
    var cf = document.getElementById('blogCoverflow');
    if (!stage || !cf) return;
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.blog-card'));
    var n = cards.length;
    if (!n) return;
    var dotsWrap = document.getElementById('blogDots');
    var prevBtn = document.getElementById('blogPrev');
    var nextBtn = document.getElementById('blogNext');
    var current = 0, timer = null, DELAY = 5000, FAST = 1200, hoverDir = 0, hovering = false;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = [];
    if (dotsWrap) {
      cards.forEach(function(_, i){
        var d = document.createElement('button');
        d.className = 'blog-dot';
        d.setAttribute('aria-label', 'Show insight ' + (i + 1));
        d.addEventListener('click', function(){ go(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function rel(i){
      var o = i - current;
      while (o > n / 2) o -= n;
      while (o < -n / 2) o += n;
      return o;
    }
    function render(){
      cards.forEach(function(card, i){
        var o = rel(i), ao = Math.abs(o), dir = o < 0 ? -1 : 1;
        var tx, sc, ry, op, z, fl, pe;
        if (ao === 0)      { tx = 0;         sc = 1;    ry = 0;         op = 1;    z = 40; fl = 'none';             pe = 'auto'; }
        else if (ao === 1) { tx = dir * 52;  sc = 0.84; ry = -dir * 30; op = 0.9;  z = 32; fl = 'brightness(0.85)'; pe = 'auto'; }
        else if (ao === 2) { tx = dir * 96;  sc = 0.68; ry = -dir * 40; op = 0.7;  z = 24; fl = 'brightness(0.62)'; pe = 'auto'; }
        else if (ao === 3) { tx = dir * 134; sc = 0.54; ry = -dir * 48; op = 0.4;  z = 16; fl = 'brightness(0.45)'; pe = 'auto'; }
        else               { tx = dir * 165; sc = 0.48; ry = -dir * 52; op = 0;    z = 5;  fl = 'brightness(0.4)';  pe = 'none'; }
        card.style.transform = 'translate(-50%,-50%) translateX(' + tx + '%) scale(' + sc + ') rotateY(' + ry + 'deg)';
        card.style.opacity = op;
        card.style.zIndex = z;
        card.style.filter = fl;
        card.style.pointerEvents = pe;
        card.classList.toggle('is-active', ao === 0);
      });
      dots.forEach(function(d, i){ d.classList.toggle('active', i === current); });
    }
    function go(i){ current = ((i % n) + n) % n; render(); applyTimer(); }
    function step(d){ go(current + d); }
    function stop(){ if (timer) { clearInterval(timer); timer = null; } }
    function applyTimer(){
      stop();
      if (reduce || n <= 1) return;
      if (hovering) {
        // Hovering a side -> scrub toward it (faster); hovering center -> paused
        if (hoverDir !== 0) timer = setInterval(function(){ step(hoverDir); }, FAST);
      } else {
        timer = setInterval(function(){ step(1); }, DELAY);
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', function(){ step(1); });
    if (prevBtn) prevBtn.addEventListener('click', function(){ step(-1); });
    cards.forEach(function(card, i){
      card.addEventListener('click', function(){ if (rel(i) !== 0) go(i); });
    });

    // Hover the left/right side to scrub the carousel that way; center is a pause zone
    cf.addEventListener('mousemove', function(e){
      hovering = true;
      var r = cf.getBoundingClientRect();
      var p = (e.clientX - r.left) / r.width;
      var ndir = p < 0.4 ? -1 : (p > 0.6 ? 1 : 0);
      if (ndir !== hoverDir) {
        hoverDir = ndir;
        if (hoverDir !== 0 && !reduce) step(hoverDir); // immediate feedback; go() re-arms the fast timer
        else applyTimer();
      }
    });
    cf.addEventListener('mouseleave', function(){ hovering = false; hoverDir = 0; applyTimer(); });

    var sx = null;
    cf.addEventListener('pointerdown', function(e){ sx = e.clientX; stop(); });
    window.addEventListener('pointerup', function(e){
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { step(dx < 0 ? 1 : -1); } else { applyTimer(); }
    });

    cf.setAttribute('tabindex', '0');
    cf.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    window.addEventListener('resize', render);
    render();
    applyTimer();
  })();

  // Floating CTA visibility
  var floatingCta = document.getElementById('floatingCta');
  if (floatingCta) {
    var heroEl = document.getElementById('hero');
    var contactEl = document.getElementById('contact');
    function updateFloatingCta() {
      var heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      var contactTop = contactEl ? contactEl.getBoundingClientRect().top : Infinity;
      var show = heroBottom < 0 && contactTop > window.innerHeight * 0.5;
      floatingCta.classList.toggle('visible', show);
    }
    window.addEventListener('scroll', updateFloatingCta, { passive: true });
    updateFloatingCta();
  }

  // Hero Carousel with progress bars + staggered text
  (function() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    var bars = document.querySelectorAll('.hero-progress-bar');
    var label = document.querySelector('.hero-progress-label');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var current = 0;
    var total = slides.length;
    var interval;
    var INTERVAL_MS = 6000;

    function padNum(n) { return (n < 10 ? '0' : '') + n; }

    function animateSlideText(slide) {
      var h1 = slide.querySelector('h1');
      var sub = slide.querySelector('.hero-sub');
      var cta = slide.querySelector('.hero-cta');
      if (h1) { h1.style.opacity = '0'; h1.style.transform = 'translateY(30px)'; }
      if (sub) { sub.style.opacity = '0'; sub.style.transform = 'translateY(20px)'; }
      if (cta) { cta.style.opacity = '0'; cta.style.transform = 'translateY(15px)'; }
      requestAnimationFrame(function() {
        if (h1) { h1.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out'; h1.style.opacity = '1'; h1.style.transform = 'translateY(0)'; }
        setTimeout(function() {
          if (sub) { sub.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; sub.style.opacity = '1'; sub.style.transform = 'translateY(0)'; }
        }, 200);
        setTimeout(function() {
          if (cta) { cta.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'; cta.style.opacity = '1'; cta.style.transform = 'translateY(0)'; }
        }, 400);
      });
    }

    function resetBars() {
      bars.forEach(function(bar) { bar.classList.remove('active', 'done'); });
    }

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');

      // Update progress bars
      resetBars();
      for (var i = 0; i < current; i++) bars[i].classList.add('done');
      bars[current].classList.add('active');

      // Update label
      if (label) label.textContent = padNum(current + 1) + ' / ' + padNum(total);

      // Staggered text animation
      animateSlideText(slides[current]);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      document.documentElement.style.setProperty('--hero-interval', INTERVAL_MS + 'ms');
      resetBars();
      for (var i = 0; i < current; i++) bars[i].classList.add('done');
      // Force reflow then activate
      bars[current].classList.remove('active');
      void bars[current].offsetWidth;
      bars[current].classList.add('active');
      interval = setInterval(next, INTERVAL_MS);
    }
    function stopAuto() { clearInterval(interval); }

    if (prevBtn) prevBtn.addEventListener('click', function() { stopAuto(); prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { stopAuto(); next(); startAuto(); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { stopAuto(); goTo(i); startAuto(); });
    });
    bars.forEach(function(bar, i) {
      bar.addEventListener('click', function() { stopAuto(); goTo(i); startAuto(); });
    });

    startAuto();
  })();

  } catch(e) {
    console.error('MAIN SCRIPT ERROR:', e.message, 'at line', e.stack);
    document.body.classList.remove('js-ready');
    document.querySelectorAll('.intro-hidden').forEach(function(el){ el.classList.remove('intro-hidden'); });
  }
}
