/* =============================================================
   ProDaddy Agency – page behaviour
   -------------------------------------------------------------
   Everything that moves or reacts on the page lives here.
   Each part is a small, separate block with a heading.
   To add or change a sample reel, or to change prices,
   edit the two lists right below. You don't need to touch the rest.
   ============================================================= */


/* ---------- SAMPLE REELS ----------
   Each line: [file name in assets/work, brand name, industry and city] */
const SAMPLE_REELS = [
  ["cafe",    "Brew & Co.",          "Café • Sydney"],
  ["home",    "Harbour Homes",       "Real estate • Toronto"],
  ["gym",     "PulseFit",            "Gym • Melbourne"],
  ["pay",     "SwiftPay",            "Payments • AU & CA"],
  ["dental",  "BrightSmile Dental",  "Dental clinic • Vancouver"],
  ["salon",   "Luxe Hair Studio",    "Salon • Brisbane"],
  ["fashion", "Studio Nine",         "Fashion • Perth"],
  ["pizza",   "Napoli Slice",        "Restaurant • Calgary"],
  ["car",     "Gloss Pro Detailing", "Car detailing • Gold Coast"],
  ["plumb",   "FixRight Plumbing",   "Trades • Ottawa"],
];

/* ---------- PRICES ----------
   One line per plan, in the same order as the pricing cards. */
const PRICES = {
  starter: { AUD: 69,  CAD: 59,  USD: 45,  INR: 2999 },
  growth:  { AUD: 179, CAD: 165, USD: 120, INR: 7999 },
  pro:     { AUD: 449, CAD: 409, USD: 300, INR: 19999 },
};
const CURRENCY_SYMBOL = { AUD: "A$", CAD: "C$", USD: "US$", INR: "₹" };

/* ---------- HERO: rotating word in the headline ---------- */
const ROTATING_WORDS = ["stop the scroll", "bring in calls", "fill your bookings", "grow your sales"];


/* =============================================================
   Below this line: how the page works
   ============================================================= */

// 1. Build the sample reels grid from the list above
const reelsGrid = document.getElementById("reels-grid");
SAMPLE_REELS.forEach(([file, brand, info]) => {
  reelsGrid.insertAdjacentHTML("beforeend", `
    <div class="reel reveal">
      <video src="assets/work/${file}.mp4" poster="assets/work/${file}.jpg" muted loop playsinline preload="none"></video>
      <div class="reel-play">▶</div>
      <div class="reel-label"><b>${brand}</b><span>${info}</span></div>
    </div>`);
});

// 2. Reels: play silently on hover, click to play with sound (only one at a time)
document.querySelectorAll(".reel").forEach((reel) => {
  const video = reel.querySelector("video");
  const icon = reel.querySelector(".reel-play");

  reel.addEventListener("mouseenter", () => { if (video.muted) video.play().catch(() => {}); });
  reel.addEventListener("mouseleave", () => { if (video.muted) video.pause(); });

  reel.addEventListener("click", () => {
    const playingWithSound = !video.muted && !video.paused;
    // stop every other reel first
    document.querySelectorAll(".reel").forEach((other) => {
      if (other === reel) return;
      const v = other.querySelector("video");
      v.muted = true; v.pause();
      other.querySelector(".reel-play").textContent = "▶";
    });
    if (playingWithSound) {
      video.pause(); video.muted = true; icon.textContent = "▶";
    } else {
      video.muted = false; video.currentTime = 0; video.play().catch(() => {}); icon.textContent = "❚❚";
    }
  });
});

// 3. Navigation bar gets a dark background after you scroll a little
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), { passive: true });

// 4. Fade sections in as they scroll into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// 5. Numbers count up (0 → 1000) when they appear
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count), start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
});
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// 6. Rotating word in the hero headline
const rotating = document.getElementById("rotating-word");
let wordIndex = 0;
setInterval(() => {
  rotating.classList.add("out");
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
    rotating.textContent = ROTATING_WORDS[wordIndex];
    rotating.classList.remove("out");
  }, 350);
}, 2600);

// 7. Live clocks for client cities
function updateClocks() {
  document.querySelectorAll("[data-timezone]").forEach((el) => {
    el.textContent = new Date().toLocaleTimeString("en-AU", {
      timeZone: el.dataset.timezone, hour: "2-digit", minute: "2-digit", hour12: true,
    });
  });
}
updateClocks();
setInterval(updateClocks, 30000);

// 8. Currency switch for prices (picks a sensible default from the visitor's time zone)
function showPrices(currency) {
  document.querySelectorAll(".currency-switch button").forEach((b) => b.classList.toggle("active", b.dataset.currency === currency));
  document.querySelectorAll(".price[data-plan]").forEach((el) => {
    const amount = PRICES[el.dataset.plan][currency];
    const unit = el.querySelector("small").outerHTML;
    el.innerHTML = CURRENCY_SYMBOL[currency] + amount.toLocaleString(currency === "INR" ? "en-IN" : "en-US") + unit;
  });
  try { localStorage.setItem("currency", currency); } catch (e) {}
}
document.querySelectorAll(".currency-switch button").forEach((b) => b.addEventListener("click", () => showPrices(b.dataset.currency)));

function defaultCurrency() {
  try {
    const saved = localStorage.getItem("currency");
    if (saved) return saved;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (zone.startsWith("America/")) return "CAD";
    if (zone === "Asia/Kolkata" || zone === "Asia/Calcutta") return "INR";
  } catch (e) {}
  return "AUD";
}
showPrices(defaultCurrency());

// 9. Cards glow where the mouse is
document.querySelectorAll(".glow-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// 10. Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();
