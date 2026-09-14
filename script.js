/* ============================================================
   FOKUS FREAKS CREATIONS — site behaviour
   Four small jobs, nothing more:
     1. the Menu button on phones
     2. giving the header a background once you scroll
     3. the click-to-enlarge lightbox on the gallery pages
     4. the fade between pages
   ============================================================ */

/* ---------- 1. MENU BUTTON ---------- */
var nav = document.getElementById('nav');
var navToggle = document.getElementById('navToggle');

if (navToggle) {
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.textContent = open ? 'Close' : 'Menu';
  });
}

/* ---------- 2. HEADER BACKGROUND ON SCROLL ----------
   Over the hero film the header is see-through. Once you've
   scrolled past it, it gets a solid background so the links
   stay readable over photographs. */
var head = document.querySelector('.site-head');

function updateHeader() {
  if (window.scrollY > 80) {
    head.classList.add('is-stuck');
  } else {
    head.classList.remove('is-stuck');
  }
}

/* gallery pages start below the header, so they are "stuck" from the top */
if (document.querySelector('.hero')) {
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
} else {
  head.classList.add('is-stuck');
}

/* ---------- 3. LIGHTBOX ----------
   Runs only on pages that actually have a gallery. */
var gallery = document.querySelector('.gallery');

if (gallery) {
  var photos = Array.prototype.slice.call(gallery.querySelectorAll('img'));
  var current = 0;

  /* build the overlay once and keep it hidden until it's needed */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Photograph');
  box.innerHTML =
    '<button class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>' +
    '<button class="lightbox__btn lightbox__prev"  aria-label="Previous photograph">&#8249;</button>' +
    '<button class="lightbox__btn lightbox__next"  aria-label="Next photograph">&#8250;</button>' +
    '<img alt="">';
  document.body.appendChild(box);

  var boxImage = box.querySelector('img');

  function show(index) {
    /* wrap around at either end */
    current = (index + photos.length) % photos.length;
    boxImage.src = photos[current].src;
    boxImage.alt = photos[current].alt;
  }

  function open(index) {
    show(index);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  photos.forEach(function (photo, index) {
    photo.addEventListener('click', function () { open(index); });
  });

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', function (e) {
    e.stopPropagation();
    show(current - 1);
  });
  box.querySelector('.lightbox__next').addEventListener('click', function (e) {
    e.stopPropagation();
    show(current + 1);
  });

  /* clicking the dark area closes it */
  box.addEventListener('click', function (e) {
    if (e.target === box) { close(); }
  });

  /* keyboard: Escape closes, arrows move */
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) { return; }
    if (e.key === 'Escape')     { close(); }
    if (e.key === 'ArrowLeft')  { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }
  });
}

/* ---------- 4. PAGE TRANSITION ----------
   The fade IN is a CSS animation on <body>, so it happens without any help
   from this file — if the script fails, the page is still visible.

   All this does is the fade OUT: catch a click on a link that stays inside
   the site, dim the page, then let the browser go. */

var FADE_MS = 260;

function isInternalPage(link) {
  /* a plain left click, no modifier keys, no new tab */
  if (link.target && link.target !== '_self') { return false; }
  if (link.hasAttribute('download')) { return false; }

  var href = link.getAttribute('href') || '';
  /* #contact, tel:, mailto:, wa.me and the rest are not page loads */
  if (href === '' || href.charAt(0) === '#') { return false; }
  if (/^(tel:|mailto:|javascript:)/i.test(href)) { return false; }

  /* same site, and a different address than the one we are on */
  if (link.origin !== window.location.origin) { return false; }
  if (link.pathname === window.location.pathname && link.hash) { return false; }

  return true;
}

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', function (e) {
  if (e.defaultPrevented) { return; }
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }

  var link = e.target.closest ? e.target.closest('a') : null;
  if (!link || !isInternalPage(link)) { return; }

  /* nothing to fade if the visitor asked for less movement */
  if (reducedMotion.matches) { return; }

  e.preventDefault();
  var destination = link.href;
  document.body.classList.add('is-leaving');

  window.setTimeout(function () {
    window.location.href = destination;
  }, FADE_MS);
});

/* Coming back with the browser's Back button restores the page exactly as it
   was left — including the fade-out class, which would leave it invisible.
   Clear it, and put the menu back to a closed state, every time the page is
   shown. */
window.addEventListener('pageshow', function () {
  document.body.classList.remove('is-leaving');

  if (nav && nav.classList.contains('is-open')) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = 'Menu';
  }
});

/* ---------- 5. ONE FILM AT A TIME ----------
   Listens to the video element's own 'play' event, so it works whether the
   visitor uses the native controls, the keyboard, or the picture-in-picture
   window. Scoped to .films, so the silent hero video is never touched.
   Paused films keep their position — nothing is rewound. */

var films = document.querySelectorAll('.films video');

if (films.length > 1) {
  Array.prototype.forEach.call(films, function (film) {
    film.addEventListener('play', function () {
      Array.prototype.forEach.call(films, function (other) {
        if (other !== film && !other.paused) {
          other.pause();
        }
      });
    });
  });
}
