

const DEFAULT_DATA = {

    profile: {

        name: "Google Student Ambassador",

        role: "Google Student Ambassador",

        gid: "GID : 1609",

        month: "JUNE 2026"

    },

  tagline: ["Learn", "Explore", "Build", "Grow"],

  highlights: [
    {
      icon: "fa-solid fa-microchip",
      accent: "blue",
      title: "Gemini 3.5",
      subtitle: "My AI Powerhouse",
      points: ["Smarter analysis", "Faster learning", "Stronger solutions"],
    },
    {
      icon: "fa-solid fa-bug",
      accent: "green",
      title: "Bug Bounty Hunting",
      subtitle: "Find. Report. Protect.",
      points: ["Recon", "Analyze", "Exploit (Ethically)", "Report & Earn"],
    },
    {
      icon: "fa-solid fa-cloud",
      accent: "cyan",
      title: "TryHackMe",
      subtitle: "Level Up Every Day",
      points: ["Hands-on Learning", "Real-world Scenarios", "Building Cyber Skills"],
    },
    {
      icon: "fa-solid fa-music",
      accent: "purple",
      title: "Lyria",
      subtitle: "AI Music Generation",
      points: ["Create Unique Music", "Explore Creativity", "Beyond Code"],
    },
    {
      icon: "fa-solid fa-brain",
      accent: "pink",
      title: "AI Tool In Development",
      subtitle: "Building my dream AI tool",
      points: ["Fraud Detection", "Threat Intelligence", "Anomaly Detection"],
    },
    {
      icon: "fa-solid fa-graduation-cap",
      accent: "amber",
      title: "Mentorship",
      subtitle: "Learning & Guiding",
      points: ["Peer Support", "Knowledge Sharing", "Community First"],
    },
  ],

  takeawayTitle: "Biggest Takeaway",
 
  takeawayText:
    "This program is shaping me into more than just a tech student — into a {b:curious}, {g:adaptable}, and {p:well-rounded} professional.",

  quote:
    "The goal is not just to find vulnerabilities in systems, but to build a secure future for everyone.",
  quoteAuthor: "— Google Student Ambassador",

  skills: [
    { icon: "fa-solid fa-shield-halved", label: "Cybersecurity Explorer" },
    { icon: "fa-solid fa-brain", label: "AI Enthusiast" },
    { icon: "fa-solid fa-lightbulb", label: "Creative Thinker" },
    { icon: "fa-solid fa-rocket", label: "Future Builder" },
    { icon: "fa-solid fa-user-astronaut", label: "A Better Version Of Me, Everyday", final: true },
  ],

  programId: "GID: 1609",
  socialLinks: [
    { icon: "fa-brands fa-instagram", handle: "@GoogleIndia" },
    { icon: "fa-solid fa-star", handle: "@GoogleGemini" },
  ],
  hashtags: [
    "#GoogleStudentAmbassador",
    "#GSA2026",
    "#TeamGemini",
    "#CommuniqueIndia",
    "#ping_mcn",
  ],
};


function $(id) {
  return document.getElementById(id);
}

function setHTML(id, value) {
  const el = $(id);
  if (el && value != null) el.innerHTML = value;
}

function setText(id, value) {
  const el = $(id);
  if (el && value != null) el.textContent = value;
}


function formatRich(text) {
  return String(text)
    .replace(/\{g:(.*?)\}/g, '<span class="dp-hl dp-hl--green">$1</span>')
    .replace(/\{p:(.*?)\}/g, '<span class="dp-hl dp-hl--purple">$1</span>')
    .replace(/\{b:(.*?)\}/g, '<span class="dp-hl dp-hl--blue">$1</span>');
}


function renderParticles(count = 26) {
  const wrap = $("particles");
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "dp-particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.animationDuration = 6 + Math.random() * 8 + "s";
    p.style.animationDelay = -Math.random() * 10 + "s";
    const s = 2 + Math.random() * 3;
    p.style.width = s + "px";
    p.style.height = s + "px";
    p.style.opacity = 0.3 + Math.random() * 0.6;
    wrap.appendChild(p);
  }
}

function buildCard(item, delay) {
  const card = document.createElement("article");
  card.className = `dp-card dp-accent-${item.accent || "blue"} dp-animate`;
  card.style.animationDelay = delay + "s";

  const showPoints = window.showCardPoints;
const points = window.showCardPoints
    ? (item.points || [])
        .map(p => `<li>${p}</li>`)
        .join("")
    : "";

  card.innerHTML = `
    <div class="dp-card__head">
      <span class="dp-card__icon"><i class="${item.icon}"></i></span>
      <div>
        <h3 class="dp-card__title">${item.title}</h3>
        ${item.subtitle ? `<span class="dp-card__sub">${item.subtitle}</span>` : ""}
      </div>
    </div>
    ${window.showCardPoints
    ? `<ul class="dp-card__list">${points}</ul>`
    : ""}
  `;
  return card;
}

function renderHighlights(items) {
  const left = $("cardsLeft");
  const right = $("cardsRight");
  if (!left || !right) return;
  left.innerHTML = "";
  right.innerHTML = "";

  const half = Math.ceil(items.length / 2);
  items.forEach((item, i) => {
    const delay = 0.15 + i * 0.08;
    const card = buildCard(item, delay);
    (i < half ? left : right).appendChild(card);
  });
}

function renderTagline(tags) {
  const wrap = $("taglineContainer");
  if (!wrap) return;
  wrap.innerHTML = tags.map((t) => `<li>${t}</li>`).join("");
}

function renderSkills(skills) {
  const wrap = $("skillsContainer");
  if (!wrap) return;
  wrap.innerHTML = "";
  skills.forEach((s, i) => {
    const el = document.createElement("div");
    el.className = "dp-skill" + (s.final ? " dp-skill--final" : "");
    el.innerHTML = `
      <span class="dp-skill__ring"><i class="${s.icon}"></i></span>
      <span class="dp-skill__label">${s.label}</span>
    `;
    wrap.appendChild(el);

    if (i < skills.length - 1) {
      const op = document.createElement("span");
      op.className = "dp-op";
      op.textContent = i === skills.length - 2 ? "=" : "+";
      wrap.appendChild(op);
    }
  });
}

function renderFooter(data) {
  setText("programId", data.profile.gid);

  const socials = $("socialLinks");
  if (socials) {
    socials.innerHTML = (data.socialLinks || [])
      .map((s) => `<span><i class="${s.icon}"></i>${s.handle}</span>`)
      .join("");
  }

  const tags = $("hashtags");
  if (tags) {
    tags.innerHTML = (data.hashtags || [])
      .map((h) => `<span>${h}</span>`)
      .join("");
  }
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


setHTML("role", d.profile.role);
setText("teamTag", d.teamTag);

setText("heroTitle", d.heroTitle);
setText("heroSubtitle", d.heroSubtitle);
setText("month", d.profile.month);

setText("userName", d.profile.name);

setText("programId", d.profile.gid);

renderTagline(d.tagline);

const highlights =
    d.highlights && d.highlights.length
        ? d.highlights
        : DEFAULT_DATA.highlights;

window.showCardPoints = highlights.length <= 4;

const formattedHighlights = highlights.map((h, index) => ({

    ...DEFAULT_DATA.highlights[index],

    ...h,

    points:
        h.description && h.description.trim()
            ? [h.description]
            : DEFAULT_DATA.highlights[index].points

}));

renderHighlights(formattedHighlights);
setText("takeawayTitle", d.takeawayTitle);
setHTML("takeawayText", formatRich(d.takeawayText));
setText("quote", `"${d.quote}"`);
setText("quoteAuthor", d.quoteAuthor);

renderSkills(d.skills);
renderFooter(d);

renderParticles();
}


window.renderPoster = renderPoster;
window.DEFAULT_DATA = DEFAULT_DATA;
document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("portfolioData");

    if (saved) {

        renderPoster(JSON.parse(saved));

    } else {

        renderPoster(DEFAULT_DATA);

    }

});
window.downloadPoster = async function () {
    const poster = document.getElementById("posterRoot");
    if (!poster) {
        alert("Poster not found.");
        return;
    }

    const stage = document.querySelector(".dp-stage");
    const prevTransform = stage ? stage.style.transform : "";
    if (stage) stage.style.transform = "none";

    const grid = poster.querySelector(".dp-grid");
    const prevDisplay = grid ? grid.style.display : "";
    if (grid) grid.style.display = "none";

    const fadeEls = poster.querySelectorAll(".dp-animate");
    fadeEls.forEach(el => {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
    });

    const profileImg = poster.querySelector("#profileImage");
    let bgPlaceholder = null;
    if (profileImg) {
        bgPlaceholder = document.createElement("div");
        bgPlaceholder.className = "dp-hero__img";
        bgPlaceholder.style.backgroundImage = `url("${profileImg.src}")`;
        bgPlaceholder.style.backgroundSize = "cover";
        bgPlaceholder.style.backgroundPosition = "center";
        bgPlaceholder.style.display = "block";
        profileImg.parentElement.insertBefore(bgPlaceholder, profileImg);
        profileImg.style.display = "none";
    }

    const canvas = await html2canvas(poster, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#0b1020"
    });

    if (bgPlaceholder && profileImg) {
        profileImg.style.display = "";
        bgPlaceholder.remove();
    }

    fadeEls.forEach(el => {
        el.style.animation = "";
        el.style.opacity = "";
        el.style.transform = "";
    });
    if (grid) grid.style.display = prevDisplay;
    if (stage) stage.style.transform = prevTransform;
    const link = document.createElement("a");
    link.download = "Dark.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

};