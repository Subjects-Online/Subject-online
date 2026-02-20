/* ═══════════════════════════════════════════════════════════
   Student Features — Progress Tracker + Quick Notes
   Loaded by inner subject pages
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  const pageKey = window.location.pathname.replace(/[^a-zA-Z0-9]/g, '_');

  /* ── 1. Progress Tracker ─────────────────────────── */
  // Add checkboxes to every lesson-item for tracking completion
  const completed = JSON.parse(localStorage.getItem(`progress_${pageKey}`) || '{}');

  document.querySelectorAll('.lesson-item').forEach((item, idx) => {
    const key = `lesson_${idx}`;
    const checkbox = document.createElement('div');
    checkbox.className = 'progress-check' + (completed[key] ? ' checked' : '');
    checkbox.innerHTML = '<i class="fas fa-check"></i>';
    checkbox.title = completed[key] ? 'Mark as not done' : 'Mark as done';
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      completed[key] = !completed[key];
      localStorage.setItem(`progress_${pageKey}`, JSON.stringify(completed));
      checkbox.classList.toggle('checked');
      checkbox.title = completed[key] ? 'Mark as not done' : 'Mark as done';
      updateProgressBar();
    });
    // Insert checkbox at start of the link
    const link = item.querySelector('a');
    if (link) {
      link.style.position = 'relative';
      link.insertBefore(checkbox, link.firstChild);
    }
  });

  // Progress bar at the top
  const totalLessons = document.querySelectorAll('.lesson-item').length;
  if (totalLessons > 0) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'study-progress';
    progressContainer.innerHTML = `
      <div class="study-progress-header">
        <i class="fas fa-chart-line"></i>
        <span class="study-progress-title">Your Progress</span>
        <span class="study-progress-count" id="progressCount">0/${totalLessons}</span>
      </div>
      <div class="study-progress-bar-wrap">
        <div class="study-progress-bar" id="studyProgressBar"></div>
      </div>
    `;
    // Insert after subject-header
    const header = document.querySelector('.subject-header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(progressContainer, header.nextSibling);
    }
    updateProgressBar();
  }

  function updateProgressBar() {
    const done = Object.values(completed).filter(Boolean).length;
    const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;
    const bar = document.getElementById('studyProgressBar');
    const count = document.getElementById('progressCount');
    if (bar) bar.style.width = `${pct}%`;
    if (count) count.textContent = `${done}/${totalLessons} (${pct}%)`;
  }

  /* ── 2. Quick Notes ──────────────────────────────── */
  const savedNotes = localStorage.getItem(`notes_${pageKey}`) || '';

  const notesWidget = document.createElement('div');
  notesWidget.className = 'notes-widget';
  notesWidget.innerHTML = `
    <div class="notes-header" id="notesToggleBtn">
      <i class="fas fa-sticky-note"></i>
      <span>Quick Notes</span>
      <i class="fas fa-chevron-up notes-toggle-icon"></i>
    </div>
    <div class="notes-body" style="display:none">
      <textarea class="notes-textarea" id="quickNotes" placeholder="Type your notes for this subject here... They auto-save locally.">${savedNotes}</textarea>
      <div class="notes-footer">
        <span class="notes-saved" id="notesSaved"></span>
        <button class="notes-clear-btn" id="notesClearBtn"><i class="fas fa-trash"></i> Clear</button>
      </div>
    </div>
  `;

  document.body.appendChild(notesWidget);

  const notesToggleBtn = document.getElementById('notesToggleBtn');
  const notesBody = notesWidget.querySelector('.notes-body');
  const notesToggleIcon = notesWidget.querySelector('.notes-toggle-icon');
  let notesOpen = false;

  notesToggleBtn.addEventListener('click', () => {
    notesOpen = !notesOpen;
    notesBody.style.display = notesOpen ? 'flex' : 'none';
    notesToggleIcon.style.transform = notesOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  const textarea = document.getElementById('quickNotes');
  const savedIndicator = document.getElementById('notesSaved');
  let saveTimeout;

  textarea.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem(`notes_${pageKey}`, textarea.value);
      savedIndicator.textContent = '✓ Saved';
      setTimeout(() => { savedIndicator.textContent = ''; }, 2000);
    }, 500);
  });

  document.getElementById('notesClearBtn').addEventListener('click', () => {
    if (confirm('Clear all notes for this subject?')) {
      textarea.value = '';
      localStorage.removeItem(`notes_${pageKey}`);
      savedIndicator.textContent = 'Cleared';
      setTimeout(() => { savedIndicator.textContent = ''; }, 2000);
    }
  });
});
