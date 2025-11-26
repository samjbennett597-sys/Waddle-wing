
// ====== BASIC SETUP ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const maxW = 480;
  const maxH = 900;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > maxW) {
    w = maxW;
    h = Math.min(maxH, h);
  }
  canvas.width = w;
  canvas.height = h;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ====== DOM ELEMENTS ======
const hubOverlay = document.getElementById("hub-overlay");
const hubPenguinCanvas = document.getElementById("hub-penguin");
const hubPenguinCtx = hubPenguinCanvas.getContext("2d");
const hubSkinName = document.getElementById("hub-skin-name");

const scoreEl = document.getElementById("score-display");
const coinsEl = document.getElementById("coins-display");
const bestEl = document.getElementById("best-display");

const btnPlay = document.getElementById("btn-play");
const btnStore = document.getElementById("btn-store");
const btnSkins = document.getElementById("btn-skins");
const btnMaps = document.getElementById("btn-maps");
const btnModes = document.getElementById("btn-modes");
const btnMissions = document.getElementById("btn-missions");
const btnDaily = document.getElementById("btn-daily");
const btnSettings = document.getElementById("btn-settings");

const panelBackdrop = document.getElementById("panel-backdrop");
const panelTitle = document.getElementById("panel-title");
const panelContent = document.getElementById("panel-content");
const panelCloseBtn = document.getElementById("panel-close");

const gameOverCard = document.getElementById("game-over");
const goScore = document.getElementById("go-score");
const goBest = document.getElementById("go-best");
const btnRestart = document.getElementById("btn-restart");
const btnMenu = document.getElementById("btn-menu");

// ====== META DATA / LOCAL STORAGE ======
function loadInt(key, fallback) {
  const v = parseInt(localStorage.getItem(key) || String(fallback), 10);
  return Number.isNaN(v) ? fallback : v;
}

let coins = loadInt("ww_coins", 0);
let bestScore = loadInt("ww_best", 0);
let runsPlayed = loadInt("ww_runs", 0);

const SKINS = [
  {
    id: "classic",
    name: "Classic Penguin",
    desc: "Default bean-shaped hero.",
    body: "#23374d",
    wing: "#2f4f60",
    beak: "#ffb54a",
  },
  {
    id: "neon",
    name: "Neon Cyber",
    desc: "Glows like a dodgy arcade sign.",
    body: "#00e5ff",
    wing: "#00b0ff",
    beak: "#ffe066",
    cost: 120,
  },
  {
    id: "red",
    name: "Red Rebel",
    desc: "Looks faster. Definitely isn’t.",
    body: "#e53935",
    wing: "#b71c1c",
    beak: "#ffcc80",
    cost: 60,
  },
  {
    id: "gold",
    name: "Golden Waddle",
    desc: "For people who tap too much.",
    body: "#d4af37",
    wing: "#b08a2e",
    beak: "#fff59d",
    cost: 200,
  },
];

const MAPS = [
  {
    id: "day",
    name: "Soft Morning",
    desc: "Chill blue sky and sleepy snow.",
    gradient: ["#87ceeb", "#e0f7fa"],
    pillar: "#b0bec5",
    cost: 0,
  },
  {
    id: "sunset",
    name: "Toxic Sunset",
    desc: "Glowing orange, bad decisions.",
    gradient: ["#ff7043", "#ffcc80"],
    pillar: "#6d4c41",
    cost: 80,
  },
  {
    id: "night",
    name: "Northern Night",
    desc: "Deep teal with tiny stars.",
    gradient: ["#001b30", "#003f5c"],
    pillar: "#263238",
    cost: 100,
  },
];

const MODES = [
  { id: "chill", name: "Chill", desc: "Good for humans", speed: 2.6, gap: 190 },
  { id: "normal", name: "Normal", desc: "Good for rage", speed: 3.2, gap: 165 },
  { id: "sweaty", name: "Sweaty", desc: "Good for TikTok clips", speed: 3.8, gap: 145 },
];

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

let ownedSkins = loadJson("ww_owned_skins", ["classic"]);
let ownedMaps = loadJson("ww_owned_maps", ["day"]);
let equippedSkinId = localStorage.getItem("ww_skin") || "classic";
let equippedMapId = localStorage.getItem("ww_map") || "day";
let modeId = localStorage.getItem("ww_mode") || "normal";

function saveMeta() {
  localStorage.setItem("ww_coins", String(coins));
  localStorage.setItem("ww_best", String(bestScore));
  localStorage.setItem("ww_runs", String(runsPlayed));
  localStorage.setItem("ww_owned_skins", JSON.stringify(ownedSkins));
  localStorage.setItem("ww_owned_maps", JSON.stringify(ownedMaps));
  localStorage.setItem("ww_skin", equippedSkinId);
  localStorage.setItem("ww_map", equippedMapId);
  localStorage.setItem("ww_mode", modeId);
}

function getSkin(id) {
  return SKINS.find(s => s.id === id) || SKINS[0];
}
function getMap(id) {
  return MAPS.find(m => m.id === id) || MAPS[0];
}
function getMode(id) {
  return MODES.find(m => m.id === id) || MODES[1];
}

function updateMetaUI() {
  coinsEl.textContent = "💰 " + coins;
  bestEl.textContent = "🏆 " + bestScore;
  const skin = getSkin(equippedSkinId);
  hubSkinName.textContent = skin.name;
}

// ====== HUB PENGUIN DRAW ======
function drawHubPenguin() {
  const skin = getSkin(equippedSkinId);
  const c = hubPenguinCanvas;
  const pctx = hubPenguinCtx;
  pctx.clearRect(0,0,c.width,c.height);
  pctx.save();
  pctx.translate(c.width/2, c.height/2 + 4);

  // body
  pctx.fillStyle = skin.body;
  pctx.beginPath();
  pctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI*2);
  pctx.fill();

  // belly
  pctx.fillStyle = "#ffffff";
  pctx.beginPath();
  pctx.ellipse(-3, 4, 17, 21, 0, 0, Math.PI*2);
  pctx.fill();

  // eye
  pctx.fillStyle = "white";
  pctx.beginPath();
  pctx.arc(7, -9, 6, 0, Math.PI*2);
  pctx.fill();
  pctx.fillStyle = "#111";
  pctx.beginPath();
  pctx.arc(9, -9, 2.3, 0, Math.PI*2);
  pctx.fill();

  // beak
  pctx.fillStyle = skin.beak;
  pctx.beginPath();
  pctx.moveTo(12, -2);
  pctx.lineTo(26, 2);
  pctx.lineTo(12, 6);
  pctx.closePath();
  pctx.fill();

  // wing
  pctx.fillStyle = skin.wing;
  pctx.beginPath();
  pctx.ellipse(-7, 6, 9, 15, -0.5, 0, Math.PI*2);
  pctx.fill();

  // feet
  pctx.fillStyle = skin.beak;
  pctx.beginPath();
  pctx.ellipse(-8, 25, 6, 4, 0, 0, Math.PI*2);
  pctx.ellipse(0, 25, 6, 4, 0, 0, Math.PI*2);
  pctx.fill();

  pctx.restore();
}

// ====== GAME OBJECTS ======
const penguin = {
  x: 0,
  y: 0,
  radius: 18,
  vel: 0,
  hovering: true,

  reset() {
    this.x = canvas.width * 0.25;
    this.y = canvas.height * 0.4;
    this.vel = 0;
    this.hovering = true;
  },

  flap() {
    this.vel = -6;
    this.hovering = false;
  },

  update(dt) {
    if (this.hovering) {
      this.y += Math.sin(Date.now() / 250) * 0.6;
      return;
    }
    this.vel += 12 * dt; // gravity
    this.y += this.vel;
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vel = 0;
    }
  },

  draw() {
    const skin = getSkin(equippedSkinId);
    ctx.save();
    ctx.translate(this.x, this.y);
    const rot = Math.max(-0.4, Math.min(0.6, this.vel * 0.12));
    ctx.rotate(rot);

    // body
    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 25, 0, 0, Math.PI*2);
    ctx.fill();

    // belly
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(-2, 3, 14, 18, 0, 0, Math.PI*2);
    ctx.fill();

    // eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(6, -7, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(7.5, -7, 2.1, 0, Math.PI*2);
    ctx.fill();

    // beak
    ctx.fillStyle = skin.beak;
    ctx.beginPath();
    ctx.moveTo(9, -1);
    ctx.lineTo(22, 3);
    ctx.lineTo(9, 7);
    ctx.closePath();
    ctx.fill();

    // wing
    ctx.fillStyle = skin.wing;
    ctx.beginPath();
    const wingY = Math.sin(Date.now()/120) * 3;
    ctx.ellipse(-5, 6+wingY, 8, 14, -0.5, 0, Math.PI*2);
    ctx.fill();

    // feet
    ctx.fillStyle = skin.beak;
    ctx.beginPath();
    ctx.ellipse(-6, 22, 6, 4, 0, 0, Math.PI*2);
    ctx.ellipse(2, 22, 6, 4, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};

const pipes = [];
const snowflakes = [];
const backPillars = [];

function initSnow() {
  snowflakes.length = 0;
  const n = 40;
  for (let i=0; i<n; i++) {
    snowflakes.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.8 + 0.5,
      speed: Math.random()*15 + 15
    });
  }
}

function initBackPillars() {
  backPillars.length = 0;
  for (let i=0; i<6; i++) {
    backPillars.push({
      x: (i*140) + Math.random()*40,
      w: 70,
      h: canvas.height * (0.3 + Math.random()*0.4),
      speed: 10 + Math.random()*8
    });
  }
}

// ====== GAME STATE ======
let running = false;
let gameOver = false;
let score = 0;
let spawnTimer = 0;
let lastTime = performance.now();

function resetGame() {
  pipes.length = 0;
  spawnTimer = 0;
  score = 0;
  scoreEl.textContent = "0";
  penguin.reset();
  gameOver = false;
  running = true;
  lastTime = performance.now();
}

function spawnPipe() {
  const mode = getMode(modeId);
  const gap = mode.gap;
  const margin = 40;
  const topH = margin + Math.random() * (canvas.height - 2*margin - gap);
  pipes.push({
    x: canvas.width + 40,
    topH,
    gap,
    w: 70,
    passed: false
  });
}

function updateGame(dt) {
  const map = getMap(equippedMapId);
  const mode = getMode(modeId);

  // snow
  snowflakes.forEach(s => {
    s.y += s.speed * dt;
    s.x += Math.sin((s.y + performance.now()*0.01))*0.4;
    if (s.y > canvas.height+5) {
      s.y = -10;
      s.x = Math.random()*canvas.width;
    }
  });

  // back pillars
  backPillars.forEach(p => {
    p.x -= p.speed * dt;
    if (p.x + p.w < -20) {
      p.x = canvas.width + Math.random()*80;
      p.h = canvas.height * (0.3 + Math.random()*0.4);
    }
  });

  penguin.update(dt);

  if (!penguin.hovering) {
    spawnTimer += dt;
    const baseInterval = 1.4 - Math.min(0.8, score/80); // gets spawn-happier
    if (spawnTimer > baseInterval) {
      spawnTimer = 0;
      spawnPipe();
    }

    for (let i=0; i<pipes.length; i++) {
      const p = pipes[i];
      let speed = mode.speed + Math.min(2.2, score/35);
      p.x -= speed;

      // score
      if (!p.passed && p.x + p.w < penguin.x) {
        p.passed = true;
        score++;
        const gain = 1 + Math.floor(score/25); // more the deeper you go
        coins += gain;
        scoreEl.textContent = String(score);
        updateMetaUI();
        saveMeta();
      }

      // collision
      const px = penguin.x;
      const py = penguin.y;
      if (px + penguin.radius > p.x && px - penguin.radius < p.x + p.w) {
        if (py - penguin.radius < p.topH || py + penguin.radius > p.topH + p.gap) {
          triggerGameOver();
        }
      }
    }

    // remove off-screen pipes
    while (pipes.length && pipes[0].x + pipes[0].w < -80) {
      pipes.shift();
    }

    // ground / ceiling
    if (penguin.y + penguin.radius > canvas.height - 4) {
      triggerGameOver();
    }
  }

  // draw
  drawScene(map);
}

function drawScene(map) {
  // background gradient
  const grad = ctx.createLinearGradient(0,0,0,canvas.height);
  grad.addColorStop(0, map.gradient[0]);
  grad.addColorStop(1, map.gradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // back pillars
  ctx.save();
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  backPillars.forEach(p => {
    ctx.beginPath();
    ctx.roundRect(p.x, canvas.height - p.h, p.w, p.h+40, 30);
    ctx.fill();
  });
  ctx.restore();

  // snow
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  snowflakes.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  });

  // pipes
  pipes.forEach(p => {
    const w = p.w;
    const x = p.x;
    const topH = p.topH;
    const gap = p.gap;

    ctx.fillStyle = map.pillar;
    // top
    ctx.beginPath();
    ctx.roundRect(x, 0, w, topH, [0,0,18,18]);
    ctx.fill();
    // bottom
    ctx.beginPath();
    ctx.roundRect(x, topH+gap, w, canvas.height-(topH+gap), [18,18,0,0]);
    ctx.fill();

    // lip
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x+6, topH-10, w-12, 10);
    ctx.fillRect(x+6, topH+gap, w-12, 10);
  });

  penguin.draw();
}

// ====== GAME FLOW ======
function triggerGameOver() {
  if (gameOver) return;
  gameOver = true;
  penguin.hovering = false;

  if (score > bestScore) bestScore = score;
  runsPlayed += 1;
  saveMeta();
  updateMetaUI();

  goScore.textContent = String(score);
  goBest.textContent = String(bestScore);
  gameOverCard.classList.remove("hidden");
}

function loop(now) {
  if (!running) {
    requestAnimationFrame(loop);
    return;
  }
  const dt = Math.min(0.05, (now - lastTime)/1000);
  lastTime = now;
  updateGame(dt);
  requestAnimationFrame(loop);
}

// ====== INPUT ======
function handleFlap(e) {
  if (!running || gameOver) return;
  if (penguin.hovering) {
    penguin.flap();
  } else {
    penguin.flap();
  }
}

canvas.addEventListener("mousedown", handleFlap);
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  handleFlap(e);
}, { passive:false });

window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    handleFlap(e);
  }
});

// ====== PANELS ======
function openPanel(title, html) {
  panelTitle.textContent = title;
  panelContent.innerHTML = html;
  panelBackdrop.classList.remove("hidden");
}

function closePanel() {
  panelBackdrop.classList.add("hidden");
}

panelCloseBtn.addEventListener("click", closePanel);
panelBackdrop.addEventListener("click", e => {
  if (e.target === panelBackdrop) closePanel();
});

// --- Store rendering helpers ---
function renderStore() {
  let html = "";

  html += '<div class="section-label">Skins</div>';
  html += '<ul class="store-list">';
  SKINS.forEach(s => {
    const owned = ownedSkins.includes(s.id);
    html += '<li class="store-item">';
    html += '<div class="store-label">';
    html += `<span>${owned ? "✔︎ " : ""}${s.name}</span>`;
    const costLabel = s.cost ? ` • Cost: ${s.cost} coins` : " • Free";
    const desc = s.desc + (owned ? (s.id === equippedSkinId ? " • Equipped" : " • Owned") : costLabel);
    html += `<span>${desc}</span>`;
    html += '</div>';

    let btnClass = "small-pill";
    let btnLabel = "";
    let disabled = false;
    let click = "";

    if (!owned && s.cost && s.cost > 0) {
      btnLabel = `Buy ${s.cost}`;
      click = `data-action="buy-skin" data-id="${s.id}"`;
    } else {
      if (s.id === equippedSkinId) {
        btnClass += " equipped disabled";
        btnLabel = "Equipped";
        disabled = true;
      } else {
        btnClass += " owned";
        btnLabel = "Equip";
        click = `data-action="equip-skin" data-id="${s.id}"`;
      }
    }

    html += `<button class="${btnClass}" ${disabled ? "disabled" : ""} ${click}>${btnLabel}</button>`;
    html += "</li>";
  });
  html += "</ul>";

  html += '<div class="section-label">Maps</div>';
  html += '<ul class="store-list">';
  MAPS.forEach(m => {
    const owned = ownedMaps.includes(m.id);
    html += '<li class="store-item">';
    html += '<div class="store-label">';
    html += `<span>${owned ? "✔︎ " : ""}${m.name}</span>`;
    const costLabel = m.cost ? ` • Cost: ${m.cost} coins` : " • Free";
    const desc = m.desc + (owned ? (m.id === equippedMapId ? " • Equipped" : " • Owned") : costLabel);
    html += `<span>${desc}</span>`;
    html += '</div>';

    let btnClass = "small-pill";
    let btnLabel = "";
    let disabled = false;
    let click = "";

    if (!owned && m.cost && m.cost > 0) {
      btnLabel = `Buy ${m.cost}`;
      click = `data-action="buy-map" data-id="${m.id}"`;
    } else {
      if (m.id === equippedMapId) {
        btnClass += " equipped disabled";
        btnLabel = "Equipped";
        disabled = true;
      } else {
        btnClass += " owned";
        btnLabel = "Equip";
        click = `data-action="equip-map" data-id="${m.id}"`;
      }
    }

    html += `<button class="${btnClass}" ${disabled ? "disabled" : ""} ${click}>${btnLabel}</button>`;
    html += "</li>";
  });
  html += "</ul>";

  html += '<div class="section-label">Why coins matter</div>';
  html += '<p style="margin-top:4px;">The further you go, the more coins each pipe is worth. Unlock loud skins & distracting skies to flex on your future nerfed self.</p>';

  openPanel("Store", html);
}

panelContent.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");

  if (action === "buy-skin") {
    const skin = SKINS.find(s => s.id === id);
    if (!skin) return;
    if (coins < skin.cost) {
      alert("Not enough coins. Touch grass, then come back.");
      return;
    }
    coins -= skin.cost;
    if (!ownedSkins.includes(id)) ownedSkins.push(id);
    equippedSkinId = id;
    saveMeta();
    updateMetaUI();
    drawHubPenguin();
    renderStore();
  }
  if (action === "equip-skin") {
    equippedSkinId = id;
    saveMeta();
    updateMetaUI();
    drawHubPenguin();
    renderStore();
  }

  if (action === "buy-map") {
    const map = MAPS.find(m => m.id === id);
    if (!map) return;
    if (coins < map.cost) {
      alert("Not enough coins. Hit more pipes, gain more trauma.");
      return;
    }
    coins -= map.cost;
    if (!ownedMaps.includes(id)) ownedMaps.push(id);
    equippedMapId = id;
    saveMeta();
    updateMetaUI();
    renderStore();
  }
  if (action === "equip-map") {
    equippedMapId = id;
    saveMeta();
    updateMetaUI();
    renderStore();
  }
});

// ====== ICON PANELS ======
btnStore.addEventListener("click", renderStore);

btnSkins.addEventListener("click", () => {
  let html = '<div class="section-label">Skins</div><ul class="store-list">';
  SKINS.forEach(s => {
    const owned = ownedSkins.includes(s.id);
    html += '<li class="store-item">';
    html += '<div class="store-label">';
    html += `<span>${owned ? "✔︎ " : ""}${s.name}</span>`;
    html += `<span>${s.desc}</span>`;
    html += '</div>';
    html += '</li>';
  });
  html += "</ul>";
  openPanel("Skins", html);
});

btnMaps.addEventListener("click", () => {
  let html = '<div class="section-label">Maps</div><ul class="store-list">';
  MAPS.forEach(m => {
    const owned = ownedMaps.includes(m.id);
    html += '<li class="store-item">';
    html += '<div class="store-label">';
    html += `<span>${owned ? "✔︎ " : ""}${m.name}</span>`;
    html += `<span>${m.desc}</span>`;
    html += '</div></li>';
  });
  html += "</ul>";
  openPanel("Maps", html);
});

btnModes.addEventListener("click", () => {
  let html = '<div class="section-label">Modes</div><ul class="store-list">';
  MODES.forEach(m => {
    const active = m.id === modeId;
    html += '<li class="store-item">';
    html += '<div class="store-label">';
    html += `<span>${active ? "★ " : ""}${m.name}</span>`;
    html += `<span>${m.desc}</span>`;
    html += '</div>';
    html += `<button class="small-pill ${active ? "equipped disabled" : ""}" ${
      active ? "disabled" : `data-action="set-mode" data-id="${m.id}"`
    }>${active ? "Selected" : "Select"}</button>`;
    html += '</li>';
  });
  html += "</ul>";
  openPanel("Modes", html);
});

btnMissions.addEventListener("click", () => {
  const msg = runsPlayed === 0
    ? "You haven't faceplanted yet. Go play a round."
    : `You've played ${runsPlayed} run${runsPlayed === 1 ? "" : "s"}. Keep going – the game quietly gets faster the longer you survive.`;
  const html = `<p>${msg}</p><p style="margin-top:6px;">Long-term plan: daily missions, silly titles, more reasons to stay up too late.</p>`;
  openPanel("Missions (WIP)", html);
});

btnDaily.addEventListener("click", () => {
  const today = new Date().toISOString().slice(0,10);
  const last = localStorage.getItem("ww_daily") || "";
  if (last === today) {
    openPanel("Daily Reward", "<p>Already claimed today. Touch grass, return tomorrow.</p>");
    return;
  }
  const reward = 15;
  coins += reward;
  localStorage.setItem("ww_daily", today);
  saveMeta();
  updateMetaUI();
  openPanel("Daily Reward", `<p>You grabbed +${reward} coins.</p><p>Now go waste them on a shiny penguin.</p>`);
});

btnSettings.addEventListener("click", () => {
  const html = "<p>There is no settings menu. Only consequences.</p><p style='margin-top:6px;'>Future: sound toggles, left-handed mode, maybe a secret developer pipe.</p>";
  openPanel("Settings (WIP)", html);
});

panelContent.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action='set-mode']");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  modeId = id;
  saveMeta();
  updateMetaUI();
  btnModes.click(); // re-open refreshed
});

// ====== HUB BUTTONS ======
btnPlay.addEventListener("click", () => {
  hubOverlay.classList.remove("visible");
  gameOverCard.classList.add("hidden");
  resetGame();
});

btnMenu.addEventListener("click", () => {
  running = false;
  gameOver = false;
  hubOverlay.classList.add("visible");
  gameOverCard.classList.add("hidden");
  penguin.reset();
  drawScene(getMap(equippedMapId));
});

btnRestart.addEventListener("click", () => {
  gameOverCard.classList.add("hidden");
  resetGame();
});

// ====== INIT ======
initSnow();
initBackPillars();
penguin.reset();
updateMetaUI();
drawHubPenguin();
drawScene(getMap(equippedMapId));
hubOverlay.classList.add("visible");
requestAnimationFrame(loop);
