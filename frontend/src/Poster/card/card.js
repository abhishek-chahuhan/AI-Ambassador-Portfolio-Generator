"use strict";
const DEFAULT_DATA = {
  profile: {

    name: "Abhishek Chauhan",

    role: "Google Student Ambassador",

    gid: "461",

    month: "June 2026",

    avatarSrc: "card-assets/photo1.png"

  },

  titleTop: "Monthly",

  titleBottom: "Highlights",

  subtitle: ["Learning", "Creating", "Growing"],

  tagline: "A month of exploration, creativity and meaningful connections.",

  brandSub: "Student Ambassador",

  cards: [
    {
      color: "blue",
      icon: "fa-champagne-glasses",
      title: "Events & Activities",
      points: [
        "Created and published a Gemini Lyria content creation reel for the GSA challenge.",
        "Continued engaging with the GSA community and exploring Google's latest AI tools.",
      ],
    },
    {
      color: "green",
      icon: "fa-handshake",
      title: "Collaborations & Connections",
      points: [
        "Connected with fellow student ambassadors and creators through the GSA network.",
        "Interacted with students interested in AI, content creation, and technology.",
      ],
    },
    {
      color: "yellow",
      icon: "fa-lightbulb",
      title: "Challenge I Overcame",
      points: [
        "One of my biggest challenges was content creation and audience engagement.",
        "Experimented with new storytelling approaches and AI-powered creative workflows.",
      ],
    },
    {
      color: "purple",
      icon: "fa-rocket",
      title: "Project / Initiative",
      points: [
        "Continued working on Codalix, exploring AI tools to improve creativity and digital experiences.",
        "Planned future content and outreach initiatives as part of my journey.",
      ],
    },
    {
      color: "orange",
      icon: "fa-trophy",
      title: "Wins This Month",
      points: [
        "Successfully completed and submitted my Gemini Lyria content creation challenge.",
        "Learned how to combine AI-generated music, storytelling, and content into one project.",
      ],
    },
    {
      color: "pink",
      icon: "fa-book-open",
      title: "Something New I Learned",
      points: [
        "Explored Gemini Lyria and how AI can generate original music from simple prompts.",
        "Learned more about creative AI workflows and short-form content production.",
      ],
    },
    {
      color: "teal",
      icon: "fa-clapperboard",
      title: "Behind The Scenes",
      points: [
        "Spent time experimenting with prompts, editing workflows, voiceovers and storytelling.",
        "Focused on creative direction to make content more engaging.",
      ],
    },
    {
      color: "leaf",
      icon: "fa-seedling",
      title: "Personal Growth",
      points: [
        "Improved my communication, content creation and creative thinking skills.",
        "Learned that consistency and experimentation matter more than perfection.",
      ],
    },
  ],
  scrapbook: {
    photo1: {
      src: "card-assets/photo1.png",
      caption: "Gemini Lyria\nContent Creation Reel",
    },
    music: {
      app: "Gemini",
      title: "Lyria",
      subtitle: "Create music with a text prompt",
      description:
        "A cinematic, inspirational soundtrack with soft piano, strings and ambient textures.",
      duration: "0:45",
    },
    notebook: {
      title: "Content Creation Challenge",
      subtitle: "Creative Joy with Gemini",
    },
    photo2: {
      src: "card-assets/photo2.png",
      alt: "Laptop showing Google Student Ambassador with a Google mug",
    },
    note: "Every idea starts small. With the right tools, it can become something amazing.",
  },

  quote: {
    text: "Excited for what's ahead. Let's keep building, learning and creating impact together!",
    signoff: "Let's Create Joy!",
  },

  footer: {
    programId: "GID: 461",
    handles: ["@GoogleIndia", "@GoogleGemini"],
    hashtags: [
      "#GoogleStudentAmbassador",
      "#MonthlyHighlights",
      "#GSA2026",
      "#TeamGemini",
      { text: "#CommuniqueIndia", accent: true },
    ],
  },
};
document.addEventListener("DOMContentLoaded", () => {
  let data = DEFAULT_DATA;
  try {
    const saved = localStorage.getItem("portfolioData");
    if (saved) data = mergeData(DEFAULT_DATA, JSON.parse(saved));
  } catch (err) {
    console.log("[v0] Could not parse saved portfolioData, using defaults:", err);
  }
  renderPoster(data);
});
function mergeData(base, override) {

  const out = {

    ...base,

    ...override

  };

  out.profile = {

    ...base.profile,

    ...(override.profile || {})

  };

  out.scrapbook = {

    ...base.scrapbook,

    ...(override.scrapbook || {})

  };

  out.quote = {

    ...base.quote,

    ...(override.quote || {})

  };

  out.footer = {

    ...base.footer,

    ...(override.footer || {})

  };

  if (!Array.isArray(out.cards) || !out.cards.length)

    out.cards = base.cards;

  if (!Array.isArray(out.subtitle) || !out.subtitle.length)

    out.subtitle = base.subtitle;

  return out;

}
function renderPoster(data) {
  setText("month", data.profile.month);
  setText("titleTop", data.titleTop);
  setText("titleBottom", data.titleBottom);
  setText("brandSub", data.brandSub);
  setText("role", data.profile.role);
  setText("tagline", data.tagline);

  renderSubtitle(data.subtitle);
  const cards = DEFAULT_DATA.cards.map((card, index) => {

    const h = data.highlights?.[index];

    return {

      ...card,

      title: h?.title || card.title,

      points: h
        ? [h.description]
        : card.points

    };

  });

  renderCards(cards);
  renderScrapbook(data.scrapbook, data.profile);
  renderQuote(data.quote);
  data.footer.programId = "GID: " + data.profile.gid;

  renderFooter(data.footer);
}
function renderSubtitle(words) {
  const el = document.querySelector('[data-cp-field="subtitle"]');
  if (!el) return;
  const classes = ["w1", "w2", "w3"];
  el.innerHTML = words
    .map((w, i) => `<span class="${classes[i % classes.length]}">${esc(w)}</span>`)
    .join('<span class="dot">&bull;</span>');
}
function renderCards(cards) {
  const container = document.getElementById("cp-cards");
  if (!container) return;
  container.innerHTML = "";

  cards.forEach((card, i) => {
    const el = document.createElement("article");
    el.className = `cp-card cp-card--${card.color || "blue"}`;
    el.style.animationDelay = `${i * 0.07}s`;

    const points = (card.points || [])
      .map((p) => `<li>${esc(p)}</li>`)
      .join("");

    el.innerHTML = `
      <div class="cp-card__icon" aria-hidden="true">
        <i class="fa-solid ${esc(card.icon || "fa-star")}"></i>
      </div>
      <h3 class="cp-card__title">${esc(card.title || "")}</h3>
      <ul class="cp-card__list">${points}</ul>
    `;
    container.appendChild(el);
  });
}

function renderScrapbook(scrap, profile = {}) {
  if (!scrap) return;

  const p1 = scrap.photo1 || {};

  setImage(
    "photo1",
    profile.avatarSrc || p1.src,
    profile.name || ""
  );

  setMultiline(
    "photo1Caption",
    profile.name + "\nGoogle Student Ambassador"
  );
  const m = scrap.music || {};
  setText("musicApp", m.app);
  setText("musicTitle", m.title);
  setText("musicSub", m.subtitle);
  setText("musicDesc", m.description);
  setText("musicTime", m.duration);

  const nb = scrap.notebook || {};
  setText("notebookTitle", nb.title);
  setText("notebookSub", nb.subtitle);

  const p2 = scrap.photo2 || {};

  setText("scrapNote", scrap.note);
}
function renderQuote(quote) {
  if (!quote) return;
  setText("quoteText", quote.text);
  setText("quoteSignoff", quote.signoff);
}
function renderFooter(footer) {
  if (!footer) return;
  setText("footerGid", footer.programId);

  const handles = document.getElementById("footerHandles");
  if (handles) {
    handles.innerHTML = (footer.handles || [])
      .map((h) => `<li>${esc(h)}</li>`)
      .join("");
  }
  const tags = document.getElementById("footerTags");
  if (tags) {
    tags.innerHTML = (footer.hashtags || [])
      .map((t) => {
        if (typeof t === "object" && t) {
          return `<li class="${t.accent ? "accent" : ""}">${esc(t.text)}</li>`;
        }
        return `<li>${esc(t)}</li>`;
      })
      .join("");
  }
}
function setText(id, value) {
  const el =
    document.getElementById(id) ||
    document.querySelector(`[data-cp-field="${id}"]`);
  if (el && value != null) el.textContent = value;
}

function setMultiline(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = String(value || "")
    .split("\n")
    .map((line) => esc(line))
    .join("<br>");
}

function setImage(id, src, alt) {
  const el = document.getElementById(id);
  if (!el) return;
  if (src) el.src = src;
  el.alt = alt || "";
}

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.renderPoster = renderPoster;
window.DEFAULT_DATA = DEFAULT_DATA;
window.downloadPoster = async function () {

  const poster = document.getElementById("cp-poster-root");
  if (!poster) {
    alert("Poster not found.");
    return;
  }
  const style = document.createElement("style");
  style.innerHTML = `
        .cp-stage {
            transform: none !important;
        }
        .cp-poster {
            animation: none !important;
        }
        .cp-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
        }
    `;
  document.head.appendChild(style);
  const imgs = poster.querySelectorAll(".cp-polaroid__img");
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
    backgroundColor: "#ffffff"
  });
  tempDivs.forEach(({ img, div }) => {
    img.style.display = "";
    div.parentNode.removeChild(div);
  });
  document.head.removeChild(style);

  const link = document.createElement("a");
  link.download = "Cards.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

};