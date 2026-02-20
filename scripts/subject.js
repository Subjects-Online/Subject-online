/* ===================================================
   subject.js  — Subject Page Logic
   Supports SUBJECT_CONTENT JS object (preferred)
   or falls back to DOM content-cards
   =================================================== */
(function() {

  // ── Tab Switching ───────────────────────────────
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b   => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('panel-' + btn.dataset.tab);
      if (target) target.classList.add('active');
      const subjectId = document.body.dataset.subject;
      if (subjectId) sessionStorage.setItem('so_tab_' + subjectId, btn.dataset.tab);
    });
  });

  // Restore last active tab
  const subjectId = document.body.dataset.subject;
  if (subjectId) {
    const saved = sessionStorage.getItem('so_tab_' + subjectId);
    if (saved) {
      const btn = document.querySelector(`.tab-btn[data-tab="${saved}"]`);
      if (btn) btn.click();
    }
  }

  // ── Favorites Toggle ────────────────────────────
  const favBtn = document.getElementById('subject-fav-btn');
  if (favBtn) {
    const subjectData = JSON.parse(favBtn.dataset.subject || '{}');
    function updateFavBtn(isFav) {
      favBtn.textContent = isFav ? '⭐' : '☆';
      favBtn.classList.toggle('active', isFav);
      favBtn.title = isFav ? 'Remove from Favorites' : 'Add to Favorites';
    }
    updateFavBtn(isFavorite(subjectData.id));
    favBtn.addEventListener('click', () => {
      const added = toggleFavorite(subjectData);
      updateFavBtn(added);
    });
  }

  // ── Progress Tracker (localStorage) ────────────
  const subKey = 'so_progress_' + (subjectId || 'unknown');

  function initProgress() {
    const checkboxes = document.querySelectorAll('.progress-check');
    const savedProgress = JSON.parse(localStorage.getItem(subKey) || '{}');
    checkboxes.forEach(cb => {
      if (savedProgress[cb.id]) cb.checked = true;
      cb.removeEventListener('change', cb._progressHandler);
      cb._progressHandler = () => {
        const prog = JSON.parse(localStorage.getItem(subKey) || '{}');
        prog[cb.id] = cb.checked;
        localStorage.setItem(subKey, JSON.stringify(prog));
        updateProgressBar();
      };
      cb.addEventListener('change', cb._progressHandler);
    });
    updateProgressBar();
  }

  function updateProgressBar() {
    const bar  = document.getElementById('progress-bar-fill');
    const pct  = document.getElementById('progress-pct');
    const checkboxes = document.querySelectorAll('.progress-check');
    if (!bar || !checkboxes.length) return;
    const checked = [...checkboxes].filter(c => c.checked).length;
    const percent = Math.round((checked / checkboxes.length) * 100);
    bar.style.width = percent + '%';
    if (pct) pct.textContent = percent + '%';
  }

  // ── Helpers ─────────────────────────────────────
  function isVideoUrl(url) {
    if (!url) return false;
    return /youtu\.?be|vimeo\.com|\.mp4|\.webm/i.test(url);
  }

  const PANEL_CONFIG = {
    content:   { label: 'Lecture', icon: '📖' },
    quizzes:   { label: 'Part',    icon: '✏️' },
    sections:  { label: 'Problem', icon: '📝' },
    summaries: { label: 'Part',    icon: '🔑' },
    qa:        { label: 'Set',     icon: '❓' },
    final:     { label: 'Part',    icon: '🏆' },
    videos:    { label: 'Video',   icon: '🎬' },
  };

  // ── Build one lecture row ────────────────────────
  function buildLectureRow(lec, idx, checkIdBase) {
    const hasFile  = !!(lec.path || lec.url);
    const fileUrl  = lec.path || lec.url || '';
    const isVideo  = isVideoUrl(fileUrl);
    const lKey     = `${checkIdBase}-lec-${idx}`;
    const saved    = JSON.parse(localStorage.getItem(subKey) || '{}');
    const checked  = saved[lKey] ? 'checked' : '';
    const badgeText  = !hasFile ? '⏳ Soon' : isVideo ? '🎬 Video' : '📄 PDF';
    const badgeClass = !hasFile ? 'lecture-badge soon' : isVideo ? 'lecture-badge video' : 'lecture-badge';
    const lecTitle   = lec.title || `Lecture ${idx}`;

    return `
      <div class="lecture-item${!hasFile ? ' no-file' : ''}"
           data-url="${fileUrl}"
           data-title="${lecTitle}"
           data-is-video="${isVideo}">
        <div class="lecture-left">
          <span class="lecture-num">${idx}</span>
          <div class="lecture-info">
            <span class="lecture-name">${lecTitle}</span>
            ${lec.size || lec.date ? `<span class="lecture-meta">${[lec.size, lec.date].filter(Boolean).join(' · ')}</span>` : ''}
          </div>
        </div>
        <div class="lecture-right">
        <button class="lec-ai-btn" onclick="event.stopPropagation();openAIExplain('${lecTitle.replace(/'/g,"\\'")}','${(document.querySelector('.subject-hero h1')?.textContent||'Subject').replace(/'/g,"\\'")}');" title="اشرحلي بالعامية 🤖">🤖</button>
          <span class="${badgeClass}">${badgeText}</span>
          <input type="checkbox" class="progress-check lecture-check" id="${lKey}" ${checked} title="Mark as done">
        </div>
      </div>`;
  }

  // ── Build one chapter accordion ──────────────────
  function buildAccordion(chapter, panelKey) {
    const cfg      = PANEL_CONFIG[panelKey] || { label: 'Lecture', icon: '📖' };
    const icon     = chapter.icon || cfg.icon;
    const cbId     = chapter.id   || `ch-${panelKey}-${Math.random().toString(36).slice(2,7)}`;
    const lectures = chapter.lectures || [];
    const saved    = JSON.parse(localStorage.getItem(subKey) || '{}');
    const checked  = saved[cbId] ? 'checked' : '';
    const subtitle = lectures.length > 0
      ? `${lectures.length} ${cfg.label}${lectures.length !== 1 ? 's' : ''}`
      : 'لسه فيه محاضرات';

    const rows = lectures.length > 0
      ? lectures.map((lec, i) => buildLectureRow(lec, i + 1, cbId)).join('')
      : `<div class="lec-empty">⏳ No lectures added yet.</div>`;

    const acc = document.createElement('div');
    acc.className = 'chapter-accordion';
    acc.innerHTML = `
      <div class="chapter-header" onclick="window._toggleChapter(this)" title="Click to expand">
        <div class="chapter-icon-wrap">${icon}</div>
        <div class="chapter-info">
          <div class="chapter-title">${chapter.title}</div>
          <div class="chapter-subtitle">${subtitle}</div>
        </div>
        <div class="chapter-actions">
          <input type="checkbox" class="progress-check" id="${cbId}" ${checked} title="Mark chapter as done">
          <span class="accordion-chevron">›</span>
        </div>
      </div>
      <div class="chapter-body">
        <div class="chapter-body-inner">${rows}</div>
      </div>`;
    return acc;
  }

  // ── Data-driven init (uses window.SUBJECT_CONTENT) ──
  function initFromData(data) {
    Object.keys(PANEL_CONFIG).forEach(key => {
      const panel    = document.getElementById('panel-' + key);
      if (!panel) return;
      const chapters = data[key] || [];
      panel.innerHTML = '';

      if (chapters.length === 0) {
        panel.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">📂</span>
            <h3>No content yet</h3>
            <p>Use the Admin Panel to add content for this section.</p>
          </div>`;
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'content-grid';
      chapters.forEach(ch => grid.appendChild(buildAccordion(ch, key)));
      panel.appendChild(grid);
    });

    attachLectureClicks();
    autoExpandFirst();
    initProgress();
  }

  // ── DOM-based init (fallback: reads content-cards) ──
  function initFromDOM() {
    document.querySelectorAll('.content-grid').forEach(grid => {
      const panel   = grid.closest('.tab-panel');
      const panelId = panel ? panel.id.replace('panel-', '') : 'content';
      const cfg     = PANEL_CONFIG[panelId] || { label: 'Lecture', icon: '📖' };

      Array.from(grid.querySelectorAll('.content-card')).forEach(card => {
        const titleEl  = card.querySelector('.content-card-title');
        const iconEl   = card.querySelector('.content-card-icon');
        const cb       = card.querySelector('.progress-check');
        const title    = titleEl ? titleEl.textContent.trim() : 'Item';
        const icon     = iconEl  ? iconEl.textContent.trim()  : cfg.icon;
        const cbId     = cb ? cb.id : `ch-${Date.now()}`;
        const cardCount = parseInt(card.dataset.count) || 3;
        const saved    = JSON.parse(localStorage.getItem(subKey) || '{}');
        const checked  = saved[cbId] ? 'checked' : '';

        // Build lecture rows from data-lec-N attributes
        let rows = '';
        for (let i = 1; i <= cardCount; i++) {
          const lecUrl  = card.dataset[`lec${i}`] || '';
          const lecName = card.dataset[`lecName${i}`] || `${cfg.label} ${i}`;
          const lecSize = card.dataset[`lecSize${i}`] || '';
          const lecDate = card.dataset[`lecDate${i}`] || '';
          const lec     = { path: lecUrl, title: lecName, size: lecSize, date: lecDate };
          rows += buildLectureRow(lec, i, cbId);
        }

        const acc = document.createElement('div');
        acc.className = 'chapter-accordion';
        acc.innerHTML = `
          <div class="chapter-header" onclick="window._toggleChapter(this)">
            <div class="chapter-icon-wrap">${icon}</div>
            <div class="chapter-info">
              <div class="chapter-title">${title}</div>
              <div class="chapter-subtitle">${cardCount} ${cfg.label}s</div>
            </div>
            <div class="chapter-actions">
              <input type="checkbox" class="progress-check" id="${cbId}" ${checked} title="Mark as done">
              <span class="accordion-chevron">›</span>
            </div>
          </div>
          <div class="chapter-body">
            <div class="chapter-body-inner">${rows}</div>
          </div>`;
        card.replaceWith(acc);
      });
    });

    attachLectureClicks();
    autoExpandFirst();
    initProgress();
  }

  // ── Shared: wire lecture click events ───────────
  function attachLectureClicks() {
    document.querySelectorAll('.lecture-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.classList.contains('progress-check') ||
            e.target.classList.contains('lecture-check')) return;
        const url     = item.dataset.url;
        const title   = item.dataset.title;
        const isVideo = item.dataset.isVideo === 'true';
        if (!url) {
          showToast('لسه معدتش ملف لـ lecture ده — افتح Admin Panel عشان تضيفه', 'info');
        } else if (isVideo) {
          openVideo(url, title);
        } else {
          openLecturePDF(url, title);
        }
      });
    });
  }

  // ── Auto-expand first accordion in active panel ──
  function autoExpandFirst() {
    document.querySelectorAll('.tab-panel.active .chapter-accordion:first-child .chapter-header')
      .forEach(h => setTimeout(() => h.click(), 100));
  }

  // ── Accordion toggle (global) ────────────────────
  window._toggleChapter = function(header) {
    const acc  = header.closest('.chapter-accordion');
    const body = acc.querySelector('.chapter-body');
    const inner = acc.querySelector('.chapter-body-inner');
    const isOpen = acc.classList.toggle('open');
    body.style.maxHeight = isOpen ? inner.scrollHeight + 'px' : '0';
  };

  // ── Premium PDF Viewer ───────────────────────────
  function buildPdfViewer() {
    if (document.getElementById('lect-pdf-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lect-pdf-overlay';
    overlay.innerHTML = `
      <div class="lpdf-backdrop" onclick="window._closePdfViewer()"></div>
      <div class="lpdf-panel">
        <div class="lpdf-topbar">
          <div class="lpdf-topbar-left">
            <span class="lpdf-icon">📄</span>
            <div class="lpdf-titles">
              <div class="lpdf-subject" id="lpdf-subject-label"></div>
              <div class="lpdf-title"   id="lpdf-title-label"></div>
            </div>
          </div>
          <div class="lpdf-topbar-right">
            <div class="lpdf-meta" id="lpdf-meta"></div>
            <a class="lpdf-action-btn" id="lpdf-download-btn" title="Download" download target="_blank">⬇ Download</a>
            <button class="lpdf-action-btn" onclick="window._closePdfViewer()" title="Close">✕ Close</button>
          </div>
        </div>
        <div class="lpdf-body">
          <iframe id="lpdf-iframe" class="lpdf-iframe" src="" allowfullscreen></iframe>
          <div class="lpdf-loading" id="lpdf-loading">
            <div class="lpdf-spinner"></div>
            <p>Loading PDF…</p>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') window._closePdfViewer();
    });

    const iframe = overlay.querySelector('#lpdf-iframe');
    iframe.addEventListener('load', () => {
      document.getElementById('lpdf-loading').style.display = 'none';
      iframe.style.opacity = '1';
    });
  }

  window._closePdfViewer = function() {
    const overlay = document.getElementById('lect-pdf-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      const iframe = document.getElementById('lpdf-iframe');
      if (iframe) { iframe.src = ''; iframe.style.opacity = '0'; }
      const loading = document.getElementById('lpdf-loading');
      if (loading) loading.style.display = 'flex';
    }, 350);
  };

  window.openLecturePDF = function(url, title, meta) {
    buildPdfViewer();
    const overlay = document.getElementById('lect-pdf-overlay');
    const iframe  = document.getElementById('lpdf-iframe');
    const dlBtn   = document.getElementById('lpdf-download-btn');
    const titleEl = document.getElementById('lpdf-title-label');
    const subEl   = document.getElementById('lpdf-subject-label');
    const metaEl  = document.getElementById('lpdf-meta');

    titleEl.textContent = title || 'Lecture';
    subEl.textContent   = document.querySelector('.subject-hero h1')?.textContent || 'Subject';
    if (metaEl && meta) metaEl.textContent = meta;
    else if (metaEl) metaEl.textContent = '';
    iframe.src = url;
    iframe.style.opacity = '0';
    document.getElementById('lpdf-loading').style.display = 'flex';
    if (dlBtn) dlBtn.href = url;

    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('open'));
  };

  // ── Entry Point ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildPdfViewer();
    if (window.SUBJECT_CONTENT) {
      initFromData(window.SUBJECT_CONTENT);
    } else {
      initFromDOM();
    }
  });

})();
