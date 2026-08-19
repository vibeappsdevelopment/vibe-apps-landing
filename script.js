/* Vibe Apps — progressive enhancement.
   Every widget on this page mirrors what the app it advertises actually does.
   The page reads and works with this file blocked. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     Today, as data — the whole studio in one number
     ------------------------------------------------------------------ */
  var now = new Date();
  var year = now.getFullYear();
  var startOfYear = new Date(year, 0, 1);
  var dayOfYear = Math.floor((now - startOfYear) / 86400000) + 1;
  var daysInYear = (new Date(year, 1, 29).getMonth() === 1) ? 366 : 365;

  (function stamp() {
    var el = document.getElementById('stamp');
    if (!el) return;
    el.textContent = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) + ' · day ' + dayOfYear;
  })();

  /* ------------------------------------------------------------------
     Hero: this year, one dot per day
     ------------------------------------------------------------------ */
  (function yearField() {
    var grid = document.getElementById('year-grid');
    if (!grid) return;

    var frag = document.createDocumentFragment();
    for (var d = 1; d <= daysInYear; d++) {
      var dot = document.createElement('span');
      dot.className = 'year__dot';
      if (d < dayOfYear) {
        dot.classList.add('is-on');
        // Older days sit further back, the way they do in the app's own grid.
        dot.style.opacity = (0.4 + 0.6 * (d / dayOfYear)).toFixed(2);
      }
      if (d === dayOfYear) dot.classList.add('is-today');
      if (!reduceMotion.matches) {
        dot.style.setProperty('--i', d);
        dot.classList.add('is-lit');
      }
      frag.appendChild(dot);
    }
    grid.appendChild(frag);

    var dayEl = document.getElementById('year-day');
    var pctEl = document.getElementById('year-pct');
    if (dayEl) dayEl.textContent = 'Day ' + dayOfYear + ' of ' + daysInYear;
    if (pctEl) pctEl.textContent = Math.round((dayOfYear / daysInYear) * 100) + '% of ' + year;
  })();

  /* ------------------------------------------------------------------
     Widget: 365 Vibe Days — this month, filled to today
     ------------------------------------------------------------------ */
  (function monthDots() {
    var host = document.getElementById('month-dots');
    if (!host) return;

    var daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    var today = now.getDate();
    var frag = document.createDocumentFragment();

    for (var d = 1; d <= daysInMonth; d++) {
      var dot = document.createElement('span');
      dot.style.setProperty('--i', d);
      if (d < today) dot.className = 'is-on';
      if (d === today) dot.className = 'is-today';
      frag.appendChild(dot);
    }
    host.appendChild(frag);
  })();

  /* ------------------------------------------------------------------
     Widget: Vibe Eyes — the app's whole job, running on the page
     ------------------------------------------------------------------ */
  (function eyes() {
    var host = document.getElementById('eyes');
    if (!host) return;

    var pupils = host.querySelectorAll('.eye__pupil');
    var pending = false;
    var pointer = { x: 0, y: 0 };

    function look() {
      pending = false;
      for (var i = 0; i < pupils.length; i++) {
        var socket = pupils[i].parentElement.getBoundingClientRect();
        if (!socket.width) continue;
        var cx = socket.left + socket.width / 2;
        var cy = socket.top + socket.height / 2;
        var dx = pointer.x - cx;
        var dy = pointer.y - cy;
        var angle = Math.atan2(dy, dx);
        var reach = Math.min(Math.sqrt(dx * dx + dy * dy) / 6, 13);
        pupils[i].style.setProperty('--px', (Math.cos(angle) * reach).toFixed(1) + 'px');
        pupils[i].style.setProperty('--py', (Math.sin(angle) * reach).toFixed(1) + 'px');
      }
    }

    if (!reduceMotion.matches) {
      window.addEventListener('mousemove', function (e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        if (!pending) { pending = true; requestAnimationFrame(look); }
      }, { passive: true });

      // Blink, so they look alive when nothing is moving.
      setInterval(function () {
        if (document.hidden) return;
        host.classList.add('is-blinking');
        setTimeout(function () { host.classList.remove('is-blinking'); }, 130);
      }, 4800);
    }
  })();

  /* ------------------------------------------------------------------
     Widget: Vibe Flip — a new card each time you flip
     ------------------------------------------------------------------ */
  (function flip() {
    var card = document.getElementById('flip');
    var quote = document.getElementById('flip-quote');
    if (!card || !quote) return;

    var lines = [
      'Start small. Today counts.',
      'The boring day is still a day.',
      'One thing, done, beats five planned.',
      'You are allowed a slow week.',
      'Look up. That was the whole trick.'
    ];
    var i = 0;
    var host = card.closest('.card');
    if (!host) return;

    function next() {
      i = (i + 1) % lines.length;
      // Swap while the back face is hidden mid-rotation.
      setTimeout(function () { quote.textContent = lines[i]; }, 210);
    }

    host.addEventListener('mouseenter', next);
    host.addEventListener('focusin', next);
  })();

  /* ------------------------------------------------------------------
     Entrance: one orchestrated reveal, once
     ------------------------------------------------------------------ */
  (function reveal() {
    var items = document.querySelectorAll('.rise');
    if (!items.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  })();

  /* ------------------------------------------------------------------
     Footer + analytics
     ------------------------------------------------------------------ */
  (function wiring() {
    var cookies = document.getElementById('cookie-settings');
    if (cookies) {
      cookies.addEventListener('click', function () {
        if (typeof window.vibeResetConsent === 'function') window.vibeResetConsent();
      });
    }

    // data-app keeps its original spelling so the PostHog series stays continuous
    document.querySelectorAll('.card__link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof posthog === 'undefined' || typeof posthog.capture !== 'function') return;
        posthog.capture('clicked_app_card', { app_name: link.dataset.app || 'Unknown App' });
      });
    });
  })();

})();
