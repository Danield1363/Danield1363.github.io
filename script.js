const cfg = window.BIRTHDAY_CONFIG;

document.title = `Feliz aniversário, ${cfg.name}!`;
document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = cfg.name));
document.getElementById("heroEyebrow").textContent = cfg.heroEyebrow;
document.getElementById("heroMessage").textContent = cfg.heroMessage;
document.getElementById("birthdayDate").textContent = cfg.date;
document.getElementById("senderName").textContent = cfg.sender;
document.getElementById("closingMessage").textContent = cfg.closingMessage;
document.getElementById("footerYear").textContent = `${new Date().getFullYear()} · Uma lembrança feita para durar`;

const portrait = document.getElementById("heroPortrait");
const portraitImage = new Image();
portraitImage.onload = () => { portrait.style.backgroundImage = `url('${cfg.heroPhoto}')`; portrait.classList.add("has-image"); };
portraitImage.src = cfg.heroPhoto;

document.getElementById("letterText").innerHTML = cfg.letter.map((p) => `<p>${p}</p>`).join("");

const gallery = document.getElementById("photoGallery");
cfg.photos.forEach((photo, index) => {
  const item = document.createElement("figure");
  item.className = `gallery-item reveal item-${index + 1}`;
  item.innerHTML = `<div class="photo-shell"><img src="${photo.src}" alt="${photo.caption}" loading="lazy"><div class="photo-placeholder"><span>♥</span><small>Adicione sua foto ${index + 1}</small></div></div><figcaption><span>${photo.year}</span><strong>${photo.caption}</strong></figcaption>`;
  item.querySelector("img").addEventListener("error", (e) => e.currentTarget.classList.add("missing"));
  gallery.appendChild(item);
});

document.getElementById("timeline").innerHTML = cfg.moments.map((m, index) => `<article class="timeline-item reveal"><div class="timeline-marker"><span>${m.icon}</span></div><div class="timeline-card"><small>${m.year}</small><h3>${m.title}</h3><p>${m.text}</p></div></article>`).join("");

const videoGrid = document.getElementById("videoGrid");
cfg.videos.forEach((video, index) => {
  const card = document.createElement("article"); card.className = "video-card reveal";
  card.innerHTML = `<div class="video-frame"><video controls preload="metadata"><source src="${video.src}" type="video/mp4"></video><div class="video-placeholder"><span class="play">▶</span><strong>Adicione o vídeo ${index + 1}</strong><small>${video.description}</small></div></div><h3>${video.title}</h3>`;
  const player = card.querySelector("video"); player.addEventListener("loadeddata", () => card.classList.add("has-video"));
  videoGrid.appendChild(card);
});

const music = document.getElementById("birthdayMusic"); music.src = cfg.music;
const musicButton = document.getElementById("musicButton");
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); musicButton.classList.add("playing"); musicButton.setAttribute("aria-pressed", "true"); document.getElementById("musicLabel").textContent = "Pausar música"; }
    catch { document.getElementById("musicLabel").textContent = "Adicione a música"; }
  } else { music.pause(); musicButton.classList.remove("playing"); musicButton.setAttribute("aria-pressed", "false"); document.getElementById("musicLabel").textContent = "Tocar música"; }
});

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.getElementById("confetti"); const ctx = canvas.getContext("2d"); let pieces = []; let frame;
function resizeCanvas() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
function celebrate() {
  resizeCanvas(); const colors = ["#f6c56f", "#f29aaa", "#fff0dc", "#9e2f56", "#d9697d"];
  pieces = Array.from({ length: innerWidth < 600 ? 90 : 160 }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .4, w: 5 + Math.random() * 7, h: 7 + Math.random() * 11, color: colors[Math.floor(Math.random() * colors.length)], vx: -2 + Math.random() * 4, vy: 2.5 + Math.random() * 4, rot: Math.random() * Math.PI, vr: -.12 + Math.random() * .24 }));
  cancelAnimationFrame(frame); animateConfetti();
}
function animateConfetti() {
  ctx.clearRect(0, 0, innerWidth, innerHeight); pieces.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += .025; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
  pieces = pieces.filter((p) => p.y < innerHeight + 30); if (pieces.length) frame = requestAnimationFrame(animateConfetti); else ctx.clearRect(0, 0, innerWidth, innerHeight);
}
document.getElementById("celebrateButton").addEventListener("click", celebrate); document.getElementById("finalCelebrateButton").addEventListener("click", celebrate); window.addEventListener("resize", resizeCanvas);
setTimeout(celebrate, 700);
