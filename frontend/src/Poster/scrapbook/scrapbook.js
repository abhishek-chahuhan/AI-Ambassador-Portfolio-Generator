const SB_COLORS = {
  blue:   { accent: "#4285f4", soft: "rgba(66,133,244,0.4)",  bg: "var(--c-blue-bg)",   pin: "#4285f4" },
  green:  { accent: "#34a853", soft: "rgba(52,168,83,0.4)",   bg: "var(--c-green-bg)",  pin: "#34a853" },
  yellow: { accent: "#f5a800", soft: "rgba(245,168,0,0.4)",   bg: "var(--c-yellow-bg)", pin: "#f5a800" },
  orange: { accent: "#f47b28", soft: "rgba(244,123,40,0.4)",  bg: "var(--c-orange-bg)", pin: "#f47b28" },
  violet: { accent: "#7b52d6", soft: "rgba(123,82,214,0.4)",  bg: "var(--c-violet-bg)", pin: "#7b52d6" },
  pink:   { accent: "#e0398a", soft: "rgba(224,57,138,0.4)",  bg: "var(--c-pink-bg)",   pin: "#e0398a" },
};
const DEFAULT_DATA = {
  title: "Monthly Highlights",
  org: "Google Student Ambassador",
 profile: {

    name: "Aarohi Sharma",

    role: "Gemini Campus Representative",

    gid: "9142",

    month: "June 2026",

    avatarSrc: "scrapbook-assets/profile.png"

},

badgeStrong: "GSA",

badgeText: "Gemini Campus Representative",

  quote: "Every idea starts small. With the right tools, it becomes something amazing.",
  signoff: "Let's Create Joy!",

  noteTitle: "This month's wins",
  checklist: [
    "Hosted a Gemini campus workshop",
    "Published a content creation reel",
    "Grew the GSA community circle",
  ],

  gid: "9142",
  handles: [
    { icon: "fa-brands fa-instagram", text: "@GoogleIndia" },
    { icon: "fa-solid fa-star",       text: "@GoogleGemini" },
  ],
  hashtags: ["#GoogleStudentAmbassador", "#MonthlyHighlights", "#GSA2026", "#TeamGemini"],

  cards: [
    {
      color: "green", icon: "fa-solid fa-seedling", title: "Growth",
      desc: "Grew as an ambassador through consistent effort, curiosity and hands-on projects.",
      style: "rounded",
    },
    {
      color: "blue", icon: "fa-solid fa-book-open", title: "Learning",
      desc: "Explored Gemini and new AI workflows, from prompting to short-form storytelling.",
      style: "cut",
    },
    {
      color: "orange", icon: "fa-solid fa-people-group", title: "Community",
      desc: "Connected with fellow ambassadors and students building with AI on campus.",
      style: "rounded",
    },
    {
      color: "violet", icon: "fa-solid fa-brain", title: "AI",
      desc: "Experimented with Gemini tools to boost creativity and everyday productivity.",
      style: "cut",
    },
    {
      color: "pink", icon: "fa-solid fa-compass", title: "Leadership",
      desc: "Led a small team, planned outreach and encouraged others to start creating.",
      style: "rounded",
    },
    {
      color: "yellow", icon: "fa-solid fa-lightbulb", title: "Ideas",
      desc: "Turned small sparks into real projects, sharing wins with the wider community.",
      style: "cut",
    },
  ],
};


function sbSetText(field, value) {
  document
    .querySelectorAll(`[data-sb="${field}"]`)
    .forEach((el) => { el.textContent = value; });
}

const SB_ROTATIONS = [-2, 2, 1, -1.5, 1.5, -1];
function shortenDesc(text) {

    if (!text) return "";

    const words = text.split(/\s+/);

    if (window.cardCount <= 2) {
        return words.slice(0, 40).join(" ");
    }

    if (window.cardCount <= 4) {
        return words.slice(0, 20).join(" ");
    }

    return words.slice(0, 10).join(" ");
}


function sbRenderCards(cards) {
  const wrap = document.getElementById("sbCards");
  if (!wrap) return;
  wrap.innerHTML = "";

  cards.slice(0, 6).forEach((card, i) => {
    const c = SB_COLORS[card.color] || SB_COLORS.blue;
    const rot = SB_ROTATIONS[i % SB_ROTATIONS.length];
    const isCut = card.style === "cut";

    const el = document.createElement("article");
    el.className = "sb-card" + (isCut ? " sb-card--cut" : "");
    el.style.setProperty("--accent", c.accent);
    el.style.setProperty("--accent-soft", c.soft);
    el.style.setProperty("--card-bg", c.bg);
    el.style.setProperty("--pin", c.pin);
    el.style.setProperty("--rot", `${rot}deg`);
    el.style.setProperty("--tape-rot", `${rot < 0 ? 3 : -3}deg`);
    el.style.animationDelay = `${i * 0.09}s`;

    const fastener =
      i % 2 === 0
        ? `<span class="sb-card__tape" aria-hidden="true"></span>`
        : `<span class="sb-card__pin" aria-hidden="true"></span>`;
        let lineClass = "sb-lines-2";

if(window.cardCount <= 2){
    lineClass = "sb-lines-5";
}
else if(window.cardCount <= 4){
    lineClass = "sb-lines-3";
}
    el.innerHTML = `
      ${fastener}
      <span class="sb-card__icon"><i class="${card.icon}"></i></span>
      <div class="sb-card__body">
        <h3 class="sb-card__title"><span class="sb-card__hl">${card.title}</span></h3>
        <p class="sb-card__desc ${lineClass}">
    ${card.desc}
</p>
      </div>
    `;
    wrap.appendChild(el);
  });
}


function sbRenderChecklist(items) {
  const ul = document.getElementById("sbChecklist");
  if (!ul) return;
  ul.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fa-solid fa-square-check"></i><span>${item}</span>`;
    ul.appendChild(li);
  });
}


function sbRenderHandles(handles) {
  const wrap = document.getElementById("sbHandles");
  if (!wrap) return;
  wrap.innerHTML = (handles || [])
    .map((h) => `<span class="sb-handle"><i class="${h.icon}"></i>${h.text}</span>`)
    .join("");
}

function sbRenderTags(tags) {
  const wrap = document.getElementById("sbTags");
  if (!wrap) return;
  wrap.innerHTML = (tags || [])
    .map((t, i) => `<span class="sb-tag${i % 3 === 2 ? " sb-tag--pink" : ""}">${t}</span>`)
    .join("");
}


function renderPoster(data) {
  const d = {

    ...DEFAULT_DATA,

    ...(data || {}),

    profile: {

        ...DEFAULT_DATA.profile,

        ...((data || {}).profile || {})

    }

};

  sbSetText("title", d.title);

sbSetText("org", d.org);

sbSetText("month", d.profile.month);

sbSetText("badgeStrong", d.badgeStrong);

sbSetText("badgeText", d.badgeText);

sbSetText("name", d.profile.name);

sbSetText("role", d.profile.role);

sbSetText("gid", d.profile.gid);

sbSetText("quote", d.quote);

sbSetText("signoff", d.signoff);

sbSetText("noteTitle", d.noteTitle);

  const img = document.getElementById("sbProfileImg");
  if (img && d.profile.avatarSrc) {

    img.src = d.profile.avatarSrc;

    img.alt = `${d.profile.name} profile photo`;

}

  const cards =
    d.highlights && d.highlights.length
        ? d.highlights.map((h, index) => ({
              title: h.title,
              desc: h.description,
              icon: DEFAULT_DATA.cards[index % DEFAULT_DATA.cards.length].icon,
              color: DEFAULT_DATA.cards[index % DEFAULT_DATA.cards.length].color,
              style: DEFAULT_DATA.cards[index % DEFAULT_DATA.cards.length].style
          }))
        : DEFAULT_DATA.cards;

window.cardCount = cards.length;

sbRenderCards(cards);

window.cardCount = cards.length;

  sbRenderCards(cards);
  sbRenderChecklist(d.checklist);
  sbRenderHandles(d.handles);
  sbRenderTags(d.hashtags);
}


function sbScalePoster() {
  const poster = document.getElementById("sbPoster");
  if (!poster) return;
  const available = window.innerWidth - 48;
  const scale = Math.min(1, available / 1080);
  poster.style.transform =
    scale < 1 ? `scale(${scale})` : "";
  const stage = poster.closest(".sb-stage");
  if (stage) {
    stage.style.minHeight = scale < 1 ? `${1350 * scale + 48}px` : "100vh";
  }
}


document.addEventListener("DOMContentLoaded", () => {

    let data = DEFAULT_DATA;

    try {

        const saved = localStorage.getItem("portfolioData");

        if (saved) {

            const savedData = JSON.parse(saved);

            data = {

                ...DEFAULT_DATA,

                ...savedData,

                profile: {

                    ...DEFAULT_DATA.profile,

                    ...(savedData.profile || {})

                }

            };

        }

    } catch (e) {

        console.log(e);

    }

    renderPoster(data);

    sbScalePoster();

});

window.addEventListener("resize", sbScalePoster);


window.renderPoster = renderPoster;
window.DEFAULT_DATA = DEFAULT_DATA;
window.downloadPoster = async function () {

    const poster = document.getElementById("sbPoster");

    if (!poster) {
        alert("Poster not found.");
        return;
    }

    const style = document.createElement("style");
    style.innerHTML = `
        .sb-poster {
            animation: none !important;
            transform: none !important;
        }
        .sb-card {
            animation: none !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    const imgs = poster.querySelectorAll(".sb-profile__img");
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
        backgroundColor: "#f8f4eb"
    });

    tempDivs.forEach(({ img, div }) => {
        img.style.display = "";
        div.parentNode.removeChild(div);
    });

    document.head.removeChild(style);

    const link = document.createElement("a");
    link.download = "Scrapbook.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

};