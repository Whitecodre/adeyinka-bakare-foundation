/* ABF design system preview interactions (vanilla JS, no dependencies).
   In the real app these map to: framer-motion (reveal, hover), Radix Tabs/Accordion, and small client components. */
(function () {
  var d = document, root = d.documentElement;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  // toast
  var toast;
  window.abfToast = function (msg) {
    if (!toast) { toast = d.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); d.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  };

  d.addEventListener('DOMContentLoaded', function () {
    if (window.abfIcons) window.abfIcons();

    // split headline into animated words
    $$('[data-split]').forEach(function (el) {
      var i = 0;
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w" style="--i:' + (i++) + '">' + w + '</span>'; }).join(' ');
      el.classList.add('split');
    });

    // stagger children
    $$('[data-stagger]').forEach(function (p) {
      $$(':scope > .rv', p).forEach(function (c, i) { c.style.setProperty('--d', (i * 90) + 'ms'); });
    });

    // reveal on scroll
    var rv = $$('.rv, .quote');
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      rv.forEach(function (el) { io.observe(el); });
    } else { rv.forEach(function (el) { el.classList.add('in'); }); }

    // progress bar, nav compact, back-to-top
    var bar = $('#progress'), nav = $('.nav'), top = $('.totop');
    function onScroll() {
      var h = root.scrollHeight - innerHeight, y = scrollY;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      if (nav) nav.classList.toggle('compact', y > 24);
      if (top) top.classList.toggle('show', y > 600);
      journey();
    }
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);

    if (top) top.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

    // mobile menu
    var burger = $('.burger'), menu = $('.mobile-menu');
    function setMenu(o) {
      if (!menu) return; menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
      burger.querySelector('i').setAttribute('data-icon', o ? 'x' : 'menu'); window.abfIcons(burger);
      d.body.style.overflow = o ? 'hidden' : '';
    }
    if (burger) {
      burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
      menu.addEventListener('click', function (e) { if (e.target === menu || e.target.closest('a')) setMenu(false); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
      addEventListener('resize', function () { if (innerWidth >= 900) setMenu(false); });
    }

    // scroll spy (nav links + dots)
    var secs = $$('[data-spy]');
    if (secs.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.id;
          $$('[data-spy-link]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { spy.observe(s); });
    }

    // hero parallax (mouse only)
    var hero = $('.hero');
    if (hero && fine && !reduced) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
        hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
    }

    // card tilt + spotlight (mouse only)
    if (fine && !reduced) {
      $$('.card').forEach(function (c) {
        c.addEventListener('mousemove', function (e) {
          var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
          if (c.classList.contains('tilt')) { c.style.setProperty('--ry', ((x - .5) * 8) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 8) + 'deg'); }
        });
        c.addEventListener('mouseleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
      });
      // magnetic buttons
      $$('[data-magnetic]').forEach(function (b) {
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
      });
    }

    // ripple
    d.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.btn'); if (!b || reduced) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = d.createElement('span');
      sp.className = 'ripple'; sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(sp); setTimeout(function () { sp.remove(); }, 700);
    });

    // tabs with sliding indicator + arrow keys
    $$('[data-tabs]').forEach(function (t) {
      var list = $('.tabs', t), btns = $$('button', list), ind = d.createElement('span'); ind.className = 'ind'; list.appendChild(ind);
      function move(b) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)'; }
      function select(i, focus) {
        btns.forEach(function (b, j) { b.setAttribute('aria-selected', i === j); b.tabIndex = i === j ? 0 : -1; });
        $$('.panel', t).forEach(function (p, j) { p.classList.toggle('on', i === j); });
        move(btns[i]); if (focus) btns[i].focus();
      }
      list.setAttribute('role', 'tablist');
      btns.forEach(function (b, i) {
        b.setAttribute('role', 'tab');
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') select((i + 1) % btns.length, true);
          if (e.key === 'ArrowLeft') select((i - 1 + btns.length) % btns.length, true);
        });
      });
      select(0); addEventListener('resize', function () { move(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]); });
      setTimeout(function () { select(0); }, 300);
    });

    // accordion (one open at a time inside a [data-acc] group)
    $$('[data-acc]').forEach(function (g) {
      var items = $$('.acc', g);
      items.forEach(function (a) {
        var b = $('button', a); b.setAttribute('aria-expanded', a.classList.contains('open'));
        b.addEventListener('click', function () {
          var open = !a.classList.contains('open');
          if (g.dataset.acc === 'single') items.forEach(function (o) { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', false); });
          a.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
        });
      });
    });

    // journey: scroll-driven fill + clickable steps
    var jr = $('.journey'), steps = jr ? $$('.step', jr) : [], detail = $('#journey-detail');
    function activate(i) {
      steps.forEach(function (s, j) { s.classList.toggle('active', j === i); });
      if (detail) { var src = $('#jd-' + i); $$('.jd', detail).forEach(function (p) { p.hidden = true; }); if (src) { src.hidden = false; src.style.animation = 'none'; void src.offsetWidth; src.style.animation = ''; } }
    }
    steps.forEach(function (s, i) { s.addEventListener('click', function () { manual = true; activate(i); }); });
    var manual = false;
    function journey() {
      if (!jr) return;
      var r = jr.getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .75 - r.top) / (r.height + vh * .1)));
      jr.style.setProperty('--p', p.toFixed(3));
      if (!manual) activate(Math.min(steps.length - 1, Math.floor(p * steps.length * .999)));
    }
    if (jr) activate(0);

    // copy to clipboard
    $$('[data-copy]').forEach(function (el) {
      el.addEventListener('click', function () {
        var v = el.getAttribute('data-copy');
        (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () { abfToast('Copied: ' + v); }, function () { abfToast(v); });
      });
    });

    // icon search (index)
    var q = $('#icon-q');
    if (q) q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase();
      $$('.icon-cell').forEach(function (c) { c.style.display = c.dataset.name.indexOf(v) > -1 ? '' : 'none'; });
    });

    // device switcher (index)
    $$('[data-w]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-w]').forEach(function (o) { o.classList.remove('default'); o.classList.add('outline'); });
        b.classList.add('default'); b.classList.remove('outline');
        var f = $('#device-frame'); if (f) f.style.width = b.dataset.w + 'px';
      });
    });

    onScroll();
  });
  root.classList.add('js');
})();
