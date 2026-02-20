/* ===================================================
   Global JavaScript — Starfield, Modals, Toasts, Nav
   =================================================== */

/* Starfield Canvas */
(function() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.2 + 0.05,
        twinkle: Math.random() * 0.005 + 0.002,
        dir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.alpha += s.twinkle * s.dir;
      if (s.alpha > 0.9 || s.alpha < 0.05) s.dir *= -1;
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  resize();
  initStars();
  draw();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

/* ── Hamburger Nav ────────────────────────────────── */
(function() {
  const ham = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!ham || !mobileNav) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── PDF Modal ────────────────────────────────────── */
(function() {
  const overlay = document.getElementById('pdf-modal-overlay');
  if (!overlay) return;
  const iframe  = overlay.querySelector('#pdf-iframe');
  const title   = overlay.querySelector('#pdf-modal-title');
  const closeBtn = overlay.querySelector('#pdf-modal-close');

  window.openPDF = function(url, name) {
    iframe.src = url;
    title.textContent = name || 'Document Viewer';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closePDF() {
    overlay.classList.remove('active');
    iframe.src = 'about:blank';
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closePDF);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePDF(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePDF(); });
})();

/* ── Video Modal ──────────────────────────────────── */
(function() {
  const overlay = document.getElementById('video-modal-overlay');
  if (!overlay) return;
  const iframe   = overlay.querySelector('#video-iframe');
  const title    = overlay.querySelector('#video-modal-title');
  const closeBtn = overlay.querySelector('#video-modal-close');

  window.openVideo = function(url, name) {
    // Convert YouTube watch URLs to embed
    let embedUrl = url;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    iframe.src = embedUrl;
    title.textContent = name || 'Video Lesson';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeVideo() {
    overlay.classList.remove('active');
    iframe.src = 'about:blank';
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeVideo);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
})();

/* ── Toast Notifications ──────────────────────────── */
(function() {
  window.showToast = function(msg, type = 'info') {
    const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };
})();

/* ── Favorites (localStorage) ─────────────────────── */
(function() {
  const FAV_KEY = 'so_favorites';

  window.getFavorites = function() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
  };
  window.saveFavorites = function(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  };
  window.toggleFavorite = function(subject) {
    let favs = getFavorites();
    const idx = favs.findIndex(f => f.id === subject.id);
    if (idx >= 0) {
      favs.splice(idx, 1);
      showToast(`Removed from Favorites`, 'info');
    } else {
      favs.push(subject);
      showToast(`Added to Favorites ⭐`, 'success');
    }
    saveFavorites(favs);
    return idx < 0; // true = added
  };
  window.isFavorite = function(id) {
    return getFavorites().some(f => f.id === id);
  };
})();

/* ── Scroll reveal ────────────────────────────────── */
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0 });
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  });
  const style = document.createElement('style');
  style.textContent = '.reveal.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
})();
