/**
 * templates.js
 * ─────────────────────────────────────────────────────────────
 * AmbassadorAI Studio — Templates page UI interactions
 *
 * Responsibilities (UI only):
 *   • Horizontal carousel: arrow buttons, mouse wheel, keyboard
 *   • Card selection: single-active, ARIA attributes, label update
 *   • Theme toggle: light ↔ dark (mirrors generator page behaviour)
 *
 * NOT responsible for:
 *   • Preview rendering
 *   • localStorage
 *   • Backend / API calls
 *   • Business logic
 *   • Template switching in the generator
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initCarousel();
  initCardSelection();
  initDownloadBtn();
});


/* ─────────────────────────────────────────────────────────────
   THEME TOGGLE
   Mirrors the exact logic used in script.js so both pages
   behave consistently.  Reads / writes the data-theme attribute
   on <html>.  No localStorage — page state is ephemeral.
───────────────────────────────────────────────────────────── */

function initThemeToggle() {
  var toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', function () {
    var html    = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);

    /* Swap the moon/sun icon to match the new state */
    var icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = next === 'dark'
        ? 'fa-solid fa-sun'
        : 'fa-solid fa-moon';
    }

    toggleBtn.setAttribute(
      'aria-label',
      next === 'dark' ? 'Switch to light mode' : 'Toggle dark mode'
    );
  });
}


/* ─────────────────────────────────────────────────────────────
   CAROUSEL
   Handles three input methods:
     1. Arrow buttons (click)
     2. Mouse wheel / touchpad (wheel event on the track wrapper)
     3. Touch swipe (native scroll via overflow-x: auto)
     4. Keyboard arrow keys when the track wrapper is focused
───────────────────────────────────────────────────────────── */

function initCarousel() {
  var track     = document.getElementById('tplTrack');
  var wrap      = track ? track.parentElement : null;
  var prevBtn   = document.getElementById('arrowPrev');
  var nextBtn   = document.getElementById('arrowNext');

  if (!track || !wrap || !prevBtn || !nextBtn) return;

  /* How far to scroll per arrow click:
     card width (340) + gap (28) = 368px; we scroll by one full card. */
  var SCROLL_STEP = 368;

  /* ── Arrow clicks ── */
  prevBtn.addEventListener('click', function () {
    wrap.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', function () {
    wrap.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
  });

  /* ── Mouse wheel / touchpad ──
     The wrapper already handles native horizontal scroll.
     This intercepts vertical wheel events and converts them to
     horizontal scroll, which is expected behaviour for a carousel. */
  wrap.addEventListener('wheel', function (e) {
    /* If the user is scrolling predominantly vertically, translate it */
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      wrap.scrollBy({ left: e.deltaY, behavior: 'auto' });
    }
  }, { passive: false });

  /* ── Keyboard navigation ──
     When the track wrapper has focus (tabindex="0"), arrow keys scroll. */
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      wrap.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      wrap.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
    }
  });

  /* ── Arrow button disabled state ──
     Disable Prev when scrolled to the start; disable Next at the end. */
  function updateArrows() {
    var atStart = wrap.scrollLeft <= 4;
    var atEnd   = wrap.scrollLeft >= (wrap.scrollWidth - wrap.clientWidth - 4);

    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  wrap.addEventListener('scroll', updateArrows, { passive: true });

  /* Set initial state — Prev is disabled on load */
  updateArrows();
}


/* ─────────────────────────────────────────────────────────────
   CARD SELECTION
   Exactly one card may be selected at a time.
   Selection updates:
     • .tpl-card--selected class
     • aria-pressed attribute
     • aria-label attribute
     • #selectionLabel text
   Both click and keyboard (Enter / Space) activate a card.
───────────────────────────────────────────────────────────── */

function initCardSelection() {
  var cards          = document.querySelectorAll('.tpl-card');
  var selectionLabel = document.getElementById('selectionLabel');

  if (!cards.length) return;

  /* Handle selection for a given card element */
  function selectCard(card) {
    /* Deselect all */
    cards.forEach(function (c) {
      c.classList.remove('tpl-card--selected');
      c.setAttribute('aria-pressed', 'false');
      /* Update aria-label: remove "currently selected" suffix */
      var baseName = c.querySelector('.tpl-card__name');
      if (baseName) {
        c.setAttribute('aria-label', baseName.textContent.trim() + ' template');
      }
    });

    /* Select the target card */
    card.classList.add('tpl-card--selected');
    card.setAttribute('aria-pressed', 'true');

    var nameEl = card.querySelector('.tpl-card__name');
    var name   = nameEl ? nameEl.textContent.trim() : 'Unknown';
    const templateId =
    card.dataset.template;

localStorage.setItem(
    "selectedTemplate",
    templateId
);

    card.setAttribute('aria-label', name + ' template, currently selected');

    /* Scroll the selected card into view within the carousel */
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  /* Attach click listener to every card */
  cards.forEach(function (card) {
    /* Click */
    card.addEventListener('click', function () {
      selectCard(card);
    });

    /* Keyboard: Enter or Space activates the card */
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard(card);
      }
    });
  });
}
function initDownloadBtn() {

    const btn = document.getElementById("downloadBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        const selected = document.querySelector(".tpl-card--selected");

        if (!selected) {
            alert("Please select a template.");
            return;
        }

        const iframe = selected.querySelector("iframe");

        if (!iframe || !iframe.contentWindow.downloadPoster) {
            alert("This template is not ready for download.");
            return;
        }

        iframe.contentWindow.downloadPoster();

    });

}
