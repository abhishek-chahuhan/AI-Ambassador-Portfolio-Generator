'use strict';
const GooglePoster = (() => {
  const MAX_HIGHLIGHTS = 5;
  /**
   @type {Record<string, string>}
   */
  const ICON_MAP = {
    events:       'fa-calendar-star',
    collab:       'fa-handshake',
    challenge:    'fa-mountain-sun',
    project:      'fa-wand-magic-sparkles',
    growth:       'fa-seedling',
    learning:     'fa-book-open',
    achievements: 'fa-trophy',
    bts:          'fa-lightbulb',
    workshop:     'fa-microphone-lines',
    mentoring:    'fa-people-group',
    speaking:     'fa-chalkboard-user',
    default:      'fa-star',
  };
  /**
   * @type {Array<{card: string, icon: string}>}
   */
  const COLOR_CYCLE = [
    { card: 'blue', icon: 'gp-card__icon-wrap--blue'},
    { card: 'green', icon: 'gp-card__icon-wrap--green'},
    { card: 'red', icon: 'gp-card__icon-wrap--red'},
    { card: 'blue', icon: 'gp-card__icon-wrap--blue'},
    { card: 'yellow', icon: 'gp-card__icon-wrap--yellow'},
  ];
  /**
   * @type {Record<string, string>}
   */
  const MONTH_NUMBERS = {
    January:   '01', February: '02', March:     '03',
    April:     '04', May:      '05', June:      '06',
    July:      '07', August:   '08', September: '09',
    October:   '10', November: '11', December:  '12',
  };
  /**
   * @typedef {Object} HighlightItem
   * @property {string} type        - Highlight category key (maps to ICON_MAP)
   * @property {string} title       - Short highlight title
   * @property {string} description - One or two sentence description
   */
  /**
   * @typedef {Object} PosterData
   * @property {Object}          profile              - Ambassador identity
   * @property {string}          profile.name         - Full name
   * @property {string}          profile.role         - Role / program title
   * @property {string}          profile.month        - Display month string
   * @property {string}          [profile.avatarSrc]  - Avatar image URL or base64
   * @property {string}          [profile.avatarAlt]  - Alt text for avatar
   * @property {HighlightItem[]} highlights           - Up to MAX_HIGHLIGHTS items
   * @property {Object}          [footer]             - Footer overrides
   * @property {string}          [footer.hashtag]     - Custom hashtag
   * @property {string}          [footer.program]     - Program name override
   * @property {string}          [theme]              - Accent color override (CSS hex)
   */
  /** @type {PosterData} */
  const DEFAULT_DATA = {
    profile: {
      name:      'Abhishek Chauhan',
      role:      'Google Student Ambassador',
      month:     'June 2026',
      avatarSrc: 'https://ui-avatars.com/api/?name=Abhishek+Chauhan&size=240&background=4285F4&color=ffffff&bold=true&font-size=0.4',
      avatarAlt: 'Profile photo of Abhishek Chauhan',
    },
    highlights: [
      {
        type:        'workshop',
        title:       'Conducted AI Workshop',
        description: 'Led a hands-on session introducing 60+ students to Gemini APIs and responsible AI development.',
      },
      {
        type:        'mentoring',
        title:       'Mentored Students',
        description: 'Provided one-on-one mentorship to 15 aspiring developers, guiding career paths in cloud and AI.',
      },
      {
        type:        'events',
        title:       'Organized Community Events',
        description: 'Planned and executed two chapter meetups, bringing together 120+ local tech enthusiasts.',
      },
      {
        type:        'project',
        title:       'Built AI Portfolio Generator',
        description: 'Developed a full-stack tool using Spring Boot and Gemini to auto-generate ambassador portfolios.',
      },
      {
        type:        'speaking',
        title:       'Hosted Technical Sessions',
        description: 'Delivered three deep-dives on Firebase, Vertex AI, and Google Cloud architecture patterns.',
      },
    ],
    footer: {
      hashtag: '#BuildWithAI',
      program: 'Student Ambassador Program',
    },
    theme: '#4285F4',
  };
  /**
   * @param {string} id
   * @returns {HTMLElement|null}
   */
  function _el(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[GooglePoster] Element not found: #${id}`);
    }
    return el;
  }
  /**
   * @param {string} str
   * @returns {string}
   */
  function _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }
  /**
   * @param {string} type
   * @returns {string}
   */
  function _iconFor(type) {
    return ICON_MAP[type] || ICON_MAP.default;
  }
  /**
   * @param {string} monthStr
   * @returns {string} 
   */
  function _monthNumber(monthStr) {
    if (!monthStr) return '';
    const word = monthStr.trim().split(/\s+/)[0];
    return MONTH_NUMBERS[word] || '';
  }
  /**
   * @param {PosterData} data
   */
  function renderPoster(data) {
    if (!data) {
      console.error('[GooglePoster] renderPoster: no data provided.');
      return;
    }
    renderProfile(data.profile);
    renderHighlights(data.highlights || []);
    renderFooter(data.footer || {});
    if (data.theme) {
      updateTheme(data.theme);
    }
  }
  /**
   * @param {PosterData['profile']} profile
   */
  function renderProfile(profile) {
    if (!profile) return;
    const nameEl = _el('gp-profile-name');
    if (nameEl) {
      nameEl.textContent = profile.name || '';
    }
    const roleEl = _el('gp-profile-role');
    if (roleEl) {
      roleEl.textContent = profile.role || '';
    }
    if (profile.month) {
      updateMonth(profile.month);
    }
    if (profile.avatarSrc) {
      updateAvatar(profile.avatarSrc, profile.avatarAlt || profile.name || 'Profile photo');
    }
  }
  /**
   * @param {HighlightItem[]} items
   */
  function renderHighlights(items) {
    const container = _el('gp-cards-container');
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = _emptyHighlightsHTML();
      return;
    }
    const capped = items.slice(0, MAX_HIGHLIGHTS);
    capped.forEach((item, index) => {
      const card = _buildCardElement(item, index);
      container.appendChild(card);
    });
  }
  /**
   * @param {PosterData['footer']} footer
   */
  function renderFooter(footer) {
    if (!footer) return;
    const tagEl = _el('gp-footer-tag');
    if (tagEl && footer.hashtag) {
      tagEl.textContent = footer.hashtag;
    }
    const programEls = document.querySelectorAll('.gp-footer__program');
    if (footer.program) {
      programEls.forEach(el => { el.textContent = footer.program; });
    }
  }
  /**
   * @param {string} src
   * @param {string} [alt]
   */
  function updateAvatar(src, alt) {
    const img = _el('gp-avatar-img');
    if (!img) return;
    const testImg = new Image();
    testImg.onload = () => {
      img.src = src;
      if (alt) img.alt = alt;
    };
    testImg.onerror = () => {
      console.warn('[GooglePoster] updateAvatar: failed to load image:', src);
    };
    testImg.src = src;
  }
  /**
   * @param {string} monthStr 
   */
  function updateMonth(monthStr) {
    const monthEl = _el('gp-profile-month');
    if (monthEl) {
      const icon = monthEl.querySelector('i');
      monthEl.textContent = monthStr;
      if (icon) monthEl.prepend(icon);
    }
    const mark = _el('gp-month-mark');
    if (mark) {
      const num = _monthNumber(monthStr);
      mark.textContent = num;
    }
  }
  /**
   * @param {string} accentColor 
   */
  function updateTheme(accentColor) {
    if (!accentColor) return;
    const avatar = _el('gp-avatar-img');
    if (avatar) {
      avatar.style.boxShadow = `0 0 0 6px ${accentColor}, 0 2px 12px rgba(0,0,0,.20)`;
    }
    const roleEl = _el('gp-profile-role');
    if (roleEl) {
      roleEl.style.color = accentColor;
    }
  }
  /**
   * @param {HighlightItem} item
   * @param {number} index 
   * @returns {HTMLElement}
   */
  function _buildCardElement(item, index) {
    const color = COLOR_CYCLE[index % COLOR_CYCLE.length];
    const icon  = _iconFor(item.type);
    const delay = `${index * 0.08}s`;
    const article = document.createElement('article');
    article.className  = `gp-card gp-card--${color.card} gp-fade-in`;
    article.setAttribute('role', 'listitem');
    article.setAttribute('data-gp-index', String(index));
    article.style.animationDelay = delay;
    article.innerHTML = `
      <div class="gp-card__icon-wrap ${color.icon}" aria-hidden="true">
        <i class="fa-solid ${_esc(icon)}"></i>
      </div>
      <div class="gp-card__content">
        <h3 class="gp-card__title" data-gp-field="highlight-title">
          ${_esc(item.title || '')}
        </h3>
        <p class="gp-card__desc" data-gp-field="highlight-desc">
          ${_esc(item.description || '')}
        </p>
      </div>
      <span class="gp-card__check" aria-label="Completed" aria-hidden="true">
        <i class="fa-solid fa-check"></i>
      </span>
    `;
    return article;
  }
  /**
   * @returns {string}
   **/
  function _emptyHighlightsHTML() {
    return `
      <p style="
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: #9AA0A6;
        text-align: center;
        padding: 24px 0;
        margin: 0;
      ">
        No highlights added yet.
      </p>
    `;
  }
  return {
    renderPoster,
    renderProfile,
    renderHighlights,
    renderFooter,
    updateAvatar,
    updateMonth,
    updateTheme,
    DEFAULT_DATA,
    MAX_HIGHLIGHTS,
    ICON_MAP,
  };
})();
document.addEventListener("DOMContentLoaded", () => {

    const savedData = localStorage.getItem("portfolioData");

    if (savedData) {

        GooglePoster.renderPoster(JSON.parse(savedData));

    } else {

        GooglePoster.renderPoster(GooglePoster.DEFAULT_DATA);

    }

});
window.downloadPoster = async function () {

    const poster = document.getElementById("gp-poster-root");

    if (!poster) {
        console.error("Poster not found");
        return;
    }
    if (document.fonts) {
        await document.fonts.ready;
    }

    const images = poster.querySelectorAll("img");

    await Promise.all(
        [...images].map(img => {
            if (img.complete) return Promise.resolve();

            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })
    );
    await new Promise(requestAnimationFrame);

    console.log("Poster size:", poster.offsetWidth, poster.offsetHeight);

    const stage = document.querySelector(".gp-stage");
    const prevTransform = stage ? stage.style.transform : "";
    if (stage) stage.style.transform = "none";

    const fadeEls = poster.querySelectorAll(".gp-fade-in");
    fadeEls.forEach(el => { el.style.animation = "none"; });

    const imgs = poster.querySelectorAll(".gp-avatar");
    const tempDivs = [];
    imgs.forEach((img) => {
        const div = document.createElement("div");
        div.className = img.className; 
        div.style.backgroundImage = `url("${img.src}")`;
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = "center";
        
        img.style.display = "none";
        img.parentNode.insertBefore(div, img);
        tempDivs.push({ img, div });
    });

    const canvas = await html2canvas(poster, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true
    });

    tempDivs.forEach(({ img, div }) => {
        img.style.display = "";
        div.parentNode.removeChild(div);
    });

    if (stage) stage.style.transform = prevTransform;
    fadeEls.forEach(el => { el.style.animation = ""; });

    console.log(canvas);

    const link = document.createElement("a");
    link.download = "Classic.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
};