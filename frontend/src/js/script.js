'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const poster       = $('#poster');
const posterAvatar = $('#posterAvatar');
const avatarImg    = $('#posterAvatarImg');
const avatarInit   = $('#posterAvatarInitials');
const posterHighlights = $('#posterHighlights');
const progressRing = $('#progressRing');
const progressLabel= $('#progressLabel');
const toast        = $('#toast');
const captionBox   = $('#captionBox');
const captionText  = $('#captionText');
const sidebarDate  = $('#sidebarDate');

document.addEventListener('DOMContentLoaded', () => {
  setLiveDate();
  initThemeToggle();
  initPhotoUpload();
  initTemplateSelector();
  initAccentSwatches();
  initHighlightCheckboxes();
  initCharCounters();
  initLivePreviewBindings();
  initGenerateBtn();
  initCaptionBtn();
  initNextBtn();
  loadPosterData();
  initCopyCaptionBtn();
  initResetBtn();
  updateProgress();

});

function setLiveDate() {
  const now = new Date();
  const opts = { month: 'long', year: 'numeric' };
  if (sidebarDate) {
    sidebarDate.textContent = now.toLocaleDateString('en-US', opts);
  }
}

function initThemeToggle() {
  const btn = $('#themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('aa-theme') || 'light';
  setTheme(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('aa-theme', theme);

  const btn  = $('#themeToggle');
  const icon = btn ? btn.querySelector('i') : null;
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function initPhotoUpload() {
  const zone       = $('#photoUploadZone');
  const input      = $('#photoInput');
  const preview    = $('#photoPreview');
  const uploadBtn  = $('#uploadPhotoBtn');

  if (!zone) return;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const existing = preview.querySelector('img');
      const img = existing || document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Profile photo preview';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
      if (!existing) preview.innerHTML = '';
      if (!existing) preview.appendChild(img);
      preview.classList.add('has-image');

      avatarInit.hidden = true;
      avatarImg.src     = e.target.result;
      avatarImg.hidden  = false;

const gpAvatar = document.getElementById("gp-avatar-img");

if (gpAvatar) {
    gpAvatar.src = e.target.result;
}

      showToast('Photo uploaded ✓');
    };
    reader.readAsDataURL(file);
  };

  uploadBtn.addEventListener('click', () => input.click());
  zone.addEventListener('click',  () => input.click());
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
  });

  zone.addEventListener('dragover',  (e) => { e.preventDefault(); zone.style.borderColor = 'var(--accent)'; });
  zone.addEventListener('dragleave', ()  => zone.style.borderColor = '');
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = '';
    handleFile(e.dataTransfer.files[0]);
  });
}

function initTemplateSelector() {
  $$('.template-thumb').forEach(thumb => {
    thumb.addEventListener('click',  () => activateTemplate(thumb));
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTemplate(thumb); }
    });
  });
}

function activateTemplate(thumb) {
  $$('.template-thumb').forEach(t => {
    t.classList.remove('template-thumb--active');
    t.setAttribute('aria-checked', 'false');
  });
  thumb.classList.add('template-thumb--active');
  thumb.setAttribute('aria-checked', 'true');

  const tpl = thumb.dataset.template;
  if (poster) poster.setAttribute('data-template', tpl);
  showToast(`Template: ${tpl.charAt(0).toUpperCase() + tpl.slice(1)}`);
}

const ACCENT_MAP = {
  blue:   { css: '#4285F4', bg: '#E8F0FE' },
  green:  { css: '#34A853', bg: '#E6F4EA' },
  yellow: { css: '#FBBC05', bg: '#FEF9E7' },
  red:    { css: '#EA4335', bg: '#FCE8E6' },
  purple: { css: '#9C27B0', bg: '#F3E5F5' },
  teal:   { css: '#00ACC1', bg: '#E0F7FA' },
};

function initAccentSwatches() {
  $$('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => activateSwatch(swatch));
  });
}

function activateSwatch(swatch) {
  $$('.swatch').forEach(s => {
    s.classList.remove('swatch--active');
    s.setAttribute('aria-pressed', 'false');
  });
  swatch.classList.add('swatch--active');
  swatch.setAttribute('aria-pressed', 'true');

  const color = swatch.dataset.color;
  const meta  = ACCENT_MAP[color];
  if (!meta) return;

  const root = document.documentElement;
  root.style.setProperty('--accent',    meta.css);
  root.style.setProperty('--accent-bg', meta.bg);
  root.style.setProperty('--accent-light', meta.css + '20');

  if (poster) poster.setAttribute('data-accent', color);
const gpPoster = document.querySelector(".gp-poster");

if (gpPoster) {

    gpPoster.classList.remove(
        "gp-theme-blue",
        "gp-theme-red",
        "gp-theme-green",
        "gp-theme-yellow",
        "gp-theme-purple",
        "gp-theme-teal"
    );

    gpPoster.classList.add(`gp-theme-${color}`);
  }
}

function initHighlightCheckboxes() {
  $$('.highlight-card').forEach(card => {
    const checkbox = card.querySelector('.highlight-checkbox');
    const expand   = card.querySelector('.highlight-expand');
    if (!checkbox || !expand) return;

    checkbox.addEventListener('change', () => {
      toggleHighlightCard(card, checkbox, expand);
    });

    const label = card.querySelector('.highlight-card-label');
    if (label) {
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });
    }
  });
}

function toggleHighlightCard(card, checkbox, expand) {
  const isChecked = checkbox.checked;

  if (isChecked) {
    card.classList.add('is-active');
    expand.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => expand.classList.add('is-open'));
    });
    expand.setAttribute('aria-hidden', 'false');
  } else {
    card.classList.remove('is-active');
    expand.classList.remove('is-open');
    expand.setAttribute('aria-hidden', 'true');
    expand.addEventListener('transitionend', () => {
      if (!checkbox.checked) expand.hidden = true;
    }, { once: true });
  }

  updateProgress();
  refreshPosterHighlights();
}

function initCharCounters() {
  $$('[data-counter]').forEach(textarea => {
    const counterId = textarea.dataset.counter;
    const counter   = document.getElementById(counterId);
    if (!counter) return;

    const max = textarea.maxLength || 280;
    counter.textContent = `0 / ${max}`;

    textarea.addEventListener('input', () => {

    const len = textarea.value.length;

    counter.textContent = `${len} / ${max}`;

    counter.style.color =
        len >= max * .9
            ? 'var(--c-red)'
            : 'var(--text-3)';

    refreshPosterHighlights();

    savePosterData();

});
  });
}

function initLivePreviewBindings() {
  const bindings = [
    { from: '#ambassadorName',  to: '#previewName',  initials: true },
    { from: '#ambassadorGid',   to: '#previewGid' },
    { from: '#ambassadorMonth', to: '#previewMonth' },
    { from: '#ambassadorRole',  to: '#previewRole' },
  ];

  bindings.forEach(({ from, to, initials }) => {
    const input   = $(from);
    const target  = $(to);
    if (!input || !target) return;

    const tag = input.tagName.toLowerCase();
    const evt = tag === 'select' ? 'change' : 'input';

    input.addEventListener(evt, () => {
      target.textContent = input.value || target.dataset.default || '';
      if (initials) updateAvatarInitials(input.value);
      updateProgress();

const gpName = document.getElementById("gp-profile-name");
const gpRole = document.getElementById("gp-profile-role");
const gpMonth = document.getElementById("gp-profile-month");
const gpMonthMark = document.getElementById("gp-month-mark");

if (from === "#ambassadorName" && gpName) {
    gpName.textContent = input.value || "Your Name";
}

if (from === "#ambassadorRole" && gpRole) {
    gpRole.textContent = input.value || "Google Student Ambassador";
}

if (from === "#ambassadorMonth") {

    if (gpMonth) {
        gpMonth.innerHTML =
            `<i class="fa-regular fa-calendar"></i> ${input.value} 2026`;
    }

    if (gpMonthMark) {

        const months = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];

        const index = months.indexOf(input.value);

        if(index >= 0){
            gpMonthMark.textContent =
                String(index + 1).padStart(2,"0");
        }

    }

}
savePosterData();
    });
  });

  document.addEventListener("input", (e) => {

    const el = e.target;

    if (el.dataset.previewHighlight) {

        refreshPosterHighlights();

        savePosterData();

    }

});
}

function updateAvatarInitials(name) {
  if (!name.trim()) { avatarInit.textContent = 'JL'; return; }
  const parts = name.trim().split(/\s+/);
  const init  = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
  avatarInit.textContent = init;
}

const HL_ICON = {
  events:       'fa-calendar-days',
  collab:       'fa-handshake',
  challenge:    'fa-mountain-sun',
  project:      'fa-rocket',
  growth:       'fa-seedling',
  learning:     'fa-book-open',
  achievements: 'fa-trophy',
  bts:          'fa-lightbulb',
};

function refreshPosterHighlights() {
  const checked = $$('.highlight-checkbox:checked');

  if (!checked.length) {
    posterHighlights.innerHTML = `
      <div class="poster-highlight-empty">
        <i class="fa-solid fa-sparkles" aria-hidden="true"></i>
        <span>Select highlights to see them here</span>
      </div>`;
    return;
  }

  posterHighlights.innerHTML = '';

  checked.forEach(cb => {
    const key    = cb.value;
    const title  = ($(`#${key}-title`)?.value || '').trim();
    const desc   = ($(`#${key}-desc`)?.value  || '').trim();
    const icon   = HL_ICON[key] || 'fa-star';

    const item = document.createElement('div');
    item.className = 'poster-hl-item';
    item.innerHTML = `
      <div class="poster-hl-dot" aria-hidden="true"></div>
      <div class="poster-hl-content">
        <p class="poster-hl-title">
          <i class="fa-solid ${icon}" aria-hidden="true" style="margin-right:4px;font-size:.6rem;"></i>
          ${escHtml(title || toTitleCase(key))}
        </p>
        ${desc ? `<p class="poster-hl-desc">${escHtml(desc)}</p>` : ''}
      </div>`;
    posterHighlights.appendChild(item);
  });

const gpContainer = document.getElementById("gp-cards-container");
console.log(gpContainer);

if (gpContainer) {

    gpContainer.innerHTML = "";

    checked.forEach((cb, index) => {

        const key = cb.value;

        const title =
            document.getElementById(`${key}-title`)?.value.trim() ||
            toTitleCase(key);

        const desc =
            document.getElementById(`${key}-desc`)?.value.trim() ||
            "";

        const colors = [
            "blue",
            "green",
            "red",
            "yellow",
            "blue"
        ];

        const icons = {
            events: "calendar-days",
            collab: "handshake",
            challenge: "mountain-sun",
            project: "rocket",
            growth: "seedling",
            learning: "book-open",
            achievements: "trophy",
            bts: "lightbulb"
        };

        const color = colors[index % colors.length];
        const icon = icons[key] || "star";

        gpContainer.insertAdjacentHTML("beforeend", `

<article class="gp-card gp-card--${color}">

    <div class="gp-card__icon-wrap gp-card__icon-wrap--${color}">
        <i class="fa-solid fa-${icon}"></i>
    </div>

    <div class="gp-card__content">

        <h3 class="gp-card__title">
            ${escHtml(title)}
        </h3>

        <p class="gp-card__desc">
            ${escHtml(desc)}
        </p>

    </div>

    <span class="gp-card__check">
        <i class="fa-solid fa-check"></i>
    </span>

</article>

`);

    });

}
}

function updateProgress() {
  const totalFields = 4; 
  const totalHL     = $$('.highlight-checkbox').length;

  const filledFields = [
    $('#ambassadorName'),
    $('#ambassadorGid'),
    $('#ambassadorMonth'),
    $('#ambassadorRole'),
  ].filter(el => el?.value.trim()).length;

  const checkedHL = $$('.highlight-checkbox:checked').length;

  const infoScore = filledFields / totalFields;
  const hlScore   = Math.min(checkedHL / 3, 1); 
  const detailsScore = computeDetailScore();

  const pct = Math.round((infoScore * 50 + hlScore * 30 + detailsScore * 20));

  const circ  = 125.6637;
  const offset = circ - (pct / 100) * circ;

  if (progressRing)  progressRing.style.strokeDashoffset = offset;
  if (progressLabel) progressLabel.textContent = `${pct}%`;
}

function computeDetailScore() {
  const checked = $$('.highlight-checkbox:checked');
  if (!checked.length) return 0;
  let filled = 0;
  checked.forEach(cb => {
    const key  = cb.value;
    const t    = $(`#${key}-title`)?.value.trim() || '';
    const d    = $(`#${key}-desc`)?.value.trim()  || '';
    if (t || d) filled++;
  });
  return Math.min(filled / checked.length, 1);
}

function collectFormData() {

    const ambassador = {
        name: $('#ambassadorName')?.value.trim() || "",
        gid: $('#ambassadorGid')?.value.trim() || "",
        month: $('#ambassadorMonth')?.value || "",
        role: $('#ambassadorRole')?.value.trim() || ""
    };

    const activeTemplate = $('.template-thumb--active');
    const template = activeTemplate ? activeTemplate.dataset.template : "";

    const activeAccent = $('.swatch--active');
    const accent = activeAccent ? activeAccent.dataset.color : "";

    const highlights = [];

    $$('.highlight-checkbox:checked').forEach((checkbox) => {

        const key = checkbox.value;

        highlights.push({
            type: key,
            title: $(`#${key}-title`)?.value.trim() || "",
            description: $(`#${key}-desc`)?.value.trim() || "",
            link: $(`#${key}-link`)?.value.trim() || "",
            image: $(`#${key}-img`)?.files[0] || null
        });

    });

    return {
        ambassador,

        poster: {
            template,
            accent
        },

        highlights,

        metadata: {
            generatedAt: new Date().toISOString()
        }
    };
}

function validateFormData(formData) {

    if (!formData.ambassador.name) {
        showToast("Please enter your full name.");
        return false;
    }

    if (!formData.ambassador.gid) {
        showToast("Please enter your Google ID (GID).");
        return false;
    }

    if (!formData.ambassador.month) {
        showToast("Please select a month.");
        return false;
    }

    if (formData.highlights.length === 0) {
        showToast("Please select at least one highlight.");
        return false;
    }

    for (const highlight of formData.highlights) {

        if (!highlight.title.trim()) {
            showToast(`Please enter a title for "${highlight.type}".`);
            return false;
        }

        if (!highlight.description.trim()) {
            showToast(`Please enter a description for "${highlight.type}".`);
            return false;
        }

    }

    return true;
}

function initGenerateBtn() {

    const btn = $('#generateBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {

        const payload = collectFormData();

        if (!validateFormData(payload)) {
            return;
        }

        setButtonLoading(btn, true, "Enhancing...");

        try {

            const response = await fetch("http://localhost:8080/api/enhance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {

                if (response.status === 429) {
                    throw new Error("429");
                }

                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.highlights) {

                data.highlights.forEach(ai => {

                    const titleEl = document.getElementById(`${ai.type}-title`);
                    const descEl  = document.getElementById(`${ai.type}-desc`);

                    if (titleEl) {
                        titleEl.value = ai.title;
                        titleEl.dispatchEvent(new Event("input"));
                    }

                    if (descEl) {
                        descEl.value = ai.description;
                        descEl.dispatchEvent(new Event("input"));
                    }

                });

                refreshPosterHighlights();
                savePosterData();
            }

            showToast("✨ AI suggestions applied!");

        } catch (error) {

            console.error(error);

            if (error.message === "429") {

                showToast("⏳ Gemini rate limit reached. Please wait 30 seconds.");

            } else {

                showToast("❌ Failed to generate AI suggestions.");

            }

        } finally {

            setButtonLoading(btn, false);

            startButtonCooldown(btn, 30);

        }

    });

}

function initCaptionBtn() {

    const btn = $('#captionBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {

        const payload = collectFormData();

        if (!validateFormData(payload)) {
            return;
        }

        setButtonLoading(btn, true, "Generating...");

        try {

            const response = await fetch("http://localhost:8080/api/caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {

                if (response.status === 429) {
                    throw new Error("429");
                }

                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            captionText.textContent = data.caption;
            captionBox.hidden = false;

            showToast("✨ Caption generated!");

        } catch (error) {

            console.error(error);

            if (error.message === "429") {

                showToast("⏳ Gemini rate limit reached. Please wait 30 seconds.");

            } else {

                showToast("❌ Failed to generate caption.");

            }

        } finally {

            setButtonLoading(btn, false);

            startButtonCooldown(btn, 30);

        }

    });

}

function initNextBtn() {

    const btn = $("#nextBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        savePosterData();

        window.location.href = "templates.html";

    });

}

function initResetBtn() {
  const btn = $('#resetBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!confirm('Reset all fields? This cannot be undone.')) return;
    resetForm();
    showToast('Form reset ✓');
  });
}

function resetForm() {
  ['#ambassadorName', '#ambassadorGid', '#ambassadorRole'].forEach(sel => {
    const el = $(sel); if (el) el.value = '';
  });
  const monthEl = $('#ambassadorMonth');
  if (monthEl) monthEl.selectedIndex = 0;

  const previewName  = $('#previewName');  if (previewName)  previewName.textContent  = 'Your Name';
  const previewGid   = $('#previewGid');   if (previewGid)   previewGid.textContent   = 'gid-xxxx';
  const previewRole  = $('#previewRole');  if (previewRole)  previewRole.textContent  = 'Role · Chapter';
  const previewMonth = $('#previewMonth'); if (previewMonth) previewMonth.textContent = 'Month';

  avatarInit.textContent = 'JL';
  avatarInit.hidden      = false;
  avatarImg.hidden       = true;
  avatarImg.src          = '';

  const photoPrev = $('#photoPreview');
  if (photoPrev) {
    photoPrev.innerHTML = `
      <div class="photo-placeholder">
        <i class="fa-solid fa-image" aria-hidden="true"></i>
        <span>Upload photo</span>
      </div>`;
    photoPrev.classList.remove('has-image');
  }

  $$('.highlight-checkbox:checked').forEach(cb => {
    cb.checked = false;
    cb.dispatchEvent(new Event('change'));
  });

  $$('.field-textarea').forEach(t => { t.value = ''; t.dispatchEvent(new Event('input')); });
  $$('.field-input').forEach(i => { if (i.type !== 'checkbox' && i.type !== 'file') i.value = ''; });

  captionBox.hidden  = true;
  captionText.textContent = '';

  updateProgress();
  refreshPosterHighlights();
  savePosterData();
}

function startButtonCooldown(button, seconds = 30) {

    if (!button) return;

    if (button.dataset.cooldown === "true") return;

    button.dataset.cooldown = "true";

    const originalHTML = button.innerHTML;
    button.disabled = true;

    let remaining = seconds;

    button.innerHTML = `<i class="fa-solid fa-clock"></i> Wait ${remaining}s`;

    const timer = setInterval(() => {

        remaining--;

        if (remaining <= 0) {
            clearInterval(timer);

            button.disabled = false;
            button.innerHTML = originalHTML;

            delete button.dataset.cooldown;
            return;
        }

        button.innerHTML = `<i class="fa-solid fa-clock"></i> Wait ${remaining}s`;

    }, 1000);
}
function initCopyCaptionBtn(){

    const btn = $("#copyCaptionBtn");

    if(!btn) return;

    btn.addEventListener("click",async()=>{

        const text = captionText.textContent.trim();

        if(!text){

            showToast("No caption to copy.");

            return;
        }

        await navigator.clipboard.writeText(text);
        showToast("📋 Caption copied!");

    });
}

let toastTimer = null;

function showToast(msg, duration = 2800) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
}

function setButtonLoading(btn, loading, label = '') {
  if (loading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>${label ? ` <span>${label}</span>` : ''}`;
  } else {
    btn.disabled = false;
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
  }
}
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toTitleCase(str) {
  return str.replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim();
}
function savePosterData() {

    const data = {

        profile: {

            name: $("#ambassadorName")?.value || "",

            role: $("#ambassadorRole")?.value || "",

            gid: $("#ambassadorGid")?.value || "",

            month: ($("#ambassadorMonth")?.value || "") + " 2026",

            avatarSrc: avatarImg.hidden
                ? ""
                : avatarImg.src

        },

        highlights: []

    };

    $$(".highlight-checkbox:checked").forEach(cb => {

        const key = cb.value;

        data.highlights.push({

            type: key,

            title:
                $(`#${key}-title`)?.value || "",

            description:
                $(`#${key}-desc`)?.value || ""

        });

    });

    localStorage.setItem(
        "portfolioData",
        JSON.stringify(data)
    );
}
function loadPosterData() {

    const saved = localStorage.getItem("portfolioData");

    if (!saved) return;

    const data = JSON.parse(saved);

    $("#ambassadorName").value = data.profile.name || "";
    $("#ambassadorRole").value = data.profile.role || "";
    $("#ambassadorGid").value = data.profile.gid || "";

    const month = (data.profile.month || "").replace(" 2026", "");
    $("#ambassadorMonth").value = month;

    $("#previewName").textContent = data.profile.name || "Your Name";
    $("#previewRole").textContent = data.profile.role || "Google Student Ambassador";
    $("#previewGid").textContent = data.profile.gid || "gid-xxxx";
    $("#previewMonth").textContent = month || "Month";
if (data.profile.avatarSrc) {

    avatarImg.src = data.profile.avatarSrc;
    avatarImg.hidden = false;

    avatarInit.hidden = true;

    const preview = $("#photoPreview");

    if (preview) {

        preview.innerHTML = "";

        const img = document.createElement("img");

        img.src = data.profile.avatarSrc;
        img.alt = "Profile photo";

        img.style.cssText =
            "width:100%;height:100%;object-fit:cover;border-radius:50%;";

        preview.appendChild(img);

        preview.classList.add("has-image");
    }

    const gpAvatar = document.getElementById("gp-avatar-img");

    if (gpAvatar) {
        gpAvatar.src = data.profile.avatarSrc;
    }

}(data.highlights || []).forEach(h => {

    const checkbox = $(`.highlight-checkbox[value="${h.type}"]`);

    if (!checkbox) return;

    checkbox.checked = true;

    checkbox.dispatchEvent(new Event("change"));

    const titleInput = $(`#${h.type}-title`);
    if (titleInput) {
        titleInput.value = h.title || "";
    }

    const descInput = $(`#${h.type}-desc`);
    if (descInput) {
        descInput.value = h.description || "";
    }

});

refreshPosterHighlights();
updateProgress();

}