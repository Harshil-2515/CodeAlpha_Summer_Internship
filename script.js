/* ============================================================
   HARSHIL'S VISUAL DIARY — script.js
   ============================================================ */

// ── PHOTO DATA ─────────────────────────────────────────────
// Using LOCAL images from the images folder
const photos = [
  // ── GRAPHIC WORK (Images 1-6) ──
  {
    id: 1,
    src: "images/1.jpg",
    title: "Neon Geometry",
    category: "graphic",
    label: "Graphic Work"
  },
  {
    id: 2,
    src: "images/2.jpg",
    title: "Retro Grid",
    category: "graphic",
    label: "Graphic Work"
  },
  {
    id: 3,
    src: "images/3.jpg",
    title: "Abstract Flow",
    category: "graphic",
    label: "Graphic Work"
  },
  {
    id: 4,
    src: "images/4.jpg",
    title: "Fluid Gradient",
    category: "graphic",
    label: "Graphic Work"
  },
  {
    id: 5,
    src: "images/5.jpg",
    title: "Digital Texture",
    category: "graphic",
    label: "Graphic Work"
  },
  {
    id: 6,
    src: "images/6.jpg",
    title: "Spectrum",
    category: "graphic",
    label: "Graphic Work"
  },

  // ── FOOD (Images 7-11) ──
  // {
  //   id: 7,
  //   src: "images/7.jpg",
  //   title: "Moody Plate",
  //   category: "food",
  //   label: "Food"
  // },
  {
    id: 8,
    src: "images/8.jpg",
    title: "Wholesome Bowl",
    category: "food",
    label: "Food"
  },
  {
    id: 9,
    src: "images/9.jpg",
    title: "Dark Cafe Vibes",
    category: "food",
    label: "Food"
  },
  {
    id: 10,
    src: "images/10.jpg",
    title: "Morning Ritual",
    category: "food",
    label: "Food"
  },
  {
    id: 11,
    src: "images/11.jpg",
    title: "Still Life",
    category: "food",
    label: "Food"
  },

  // ── MUMBAI TRIP (Images 12-18) ──
  {
    id: 12,
    src: "images/12.jpg",
    title: "Gateway at Dusk",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 13,
    src: "images/13.jpg",
    title: "City Silhouette",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 14,
    src: "images/14.jpg",
    title: "Marine Drive Nights",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 15,
    src: "images/15.jpg",
    title: "Street Stories",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 16,
    src: "images/16.jpg",
    title: "Coastal Light",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 17,
    src: "images/17.jpg",
    title: "Horizon Line",
    category: "mumbai",
    label: "Mumbai Trip"
  },
  {
    id: 18,
    src: "images/18.jpg",
    title: "Urban Frame",
    category: "mumbai",
    label: "Mumbai Trip"
  }
];

// ── STATE ──────────────────────────────────────────────────
let activeFilter = "all";
let lightboxIndex = 0;
let filteredPhotos = [...photos];

// ── DOM REFS ───────────────────────────────────────────────
const grid          = document.getElementById("masonryGrid");
const emptyState    = document.getElementById("emptyState");
const galleryTitle  = document.getElementById("galleryTitle");
const visibleCount  = document.getElementById("visibleCount");
const photoCount    = document.getElementById("photoCount");
const lightbox      = document.getElementById("lightbox");
const lbOverlay     = document.getElementById("lbOverlay");
const lbFan         = document.getElementById("lbFan");
const lbTitle       = document.getElementById("lbTitle");
const lbCategory    = document.getElementById("lbCategory");
const lbCurrent     = document.getElementById("lbCurrent");
const lbTotal       = document.getElementById("lbTotal");
const lbClose       = document.getElementById("lbClose");
const lbPrev        = document.getElementById("lbPrev");
const lbNext        = document.getElementById("lbNext");
const navbar        = document.getElementById("navbar");
const menuIcon      = document.getElementById("menuIcon");
const mobileNav     = document.getElementById("mobileNav");

// ── SCROLL REVEAL OBSERVER ─────────────────────────────────
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

function setupScrollReveal() {
  // Observe cards after initial render
  document.querySelectorAll(".photo-card").forEach(c => observer.observe(c));
}

// ── INIT ───────────────────────────────────────────────────
photoCount.textContent = photos.length;
renderGallery();
setupFilters();
setupLightbox();
// setupCursor(); // Cursor animation disabled
setupNavbar();
setupScrollReveal();

// ── GALLERY RENDER ─────────────────────────────────────────
function renderGallery() {
  filteredPhotos = activeFilter === "all"
    ? [...photos]
    : photos.filter(p => p.category === activeFilter);

  grid.innerHTML = "";

  if (filteredPhotos.length === 0) {
    emptyState.style.display = "block";
    visibleCount.textContent = 0;
    return;
  }

  emptyState.style.display = "none";
  visibleCount.textContent = filteredPhotos.length;

  filteredPhotos.forEach((photo, i) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    card.dataset.index = i;
    card.style.transitionDelay = `${(i % 8) * 55}ms`;
    card.innerHTML = `
      <img
        src="${photo.src}"
        alt="${photo.title}"
        loading="lazy"
      />
      <div class="card-overlay">
        <span class="card-category">${photo.label}</span>
        <span class="card-title">${photo.title}</span>
      </div>
      <div class="card-icon">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h10v10H2zM5 5l4 4M9 5l-4 4" stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
  });

  // Trigger scroll reveal after render
  setTimeout(() => {
    document.querySelectorAll(".photo-card").forEach(c => {
      observer.observe(c);
    });
  }, 50);
}

// ── FILTERS ────────────────────────────────────────────────
function setupFilters() {
  const allBtns = document.querySelectorAll(".filter-btn");
  const titleMap = {
    all: "All Photos",
    mumbai: "Mumbai Trip",
    food: "Food",
    graphic: "Graphic Work"
  };

  allBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      if (filter === activeFilter) return;

      activeFilter = filter;

      // Sync all filter buttons (desktop + mobile)
      allBtns.forEach(b => {
        b.classList.toggle("active", b.dataset.filter === filter);
      });

      galleryTitle.textContent = titleMap[filter] || "All Photos";

      // Fade out → re-render → fade in
      grid.style.opacity = "0";
      grid.style.transform = "translateY(10px)";
      setTimeout(() => {
        renderGallery();
        grid.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
      }, 250);

      // Close mobile nav
      mobileNav.classList.remove("open");
    });
  });
}

// ── LIGHTBOX ───────────────────────────────────────────────
function setupLightbox() {
  lbClose.addEventListener("click", closeLightbox);
  lbOverlay.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => navigateLightbox(-1));
  lbNext.addEventListener("click", () => navigateLightbox(1));

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   navigateLightbox(-1);
    if (e.key === "ArrowRight")  navigateLightbox(1);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  renderFan();
  updateLightboxInfo();
  lightbox.classList.add("open");
  lbOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lbOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + filteredPhotos.length) % filteredPhotos.length;
  renderFan();
  updateLightboxInfo();
}

function updateLightboxInfo() {
  const p = filteredPhotos[lightboxIndex];
  lbTitle.textContent    = p.title;
  lbCategory.textContent = p.label;
  lbCurrent.textContent  = lightboxIndex + 1;
  lbTotal.textContent    = filteredPhotos.length;
}

function renderFan() {
  lbFan.innerHTML = "";
  const total    = filteredPhotos.length;
  const positions = ["pos-left-2", "pos-left-1", "pos-center", "pos-right-1", "pos-right-2"];
  const offsets   = [-2, -1, 0, 1, 2];

  offsets.forEach((offset, posIdx) => {
    const idx = (lightboxIndex + offset + total) % total;
    const photo = filteredPhotos[idx];

    const card = document.createElement("div");
    card.className = `lb-card ${positions[posIdx]}`;
    card.innerHTML = `<img src="${photo.src}" alt="${photo.title}" loading="lazy" />`;

    // Side cards clickable to navigate
    if (offset === -1) card.addEventListener("click", () => navigateLightbox(-1));
    if (offset ===  1) card.addEventListener("click", () => navigateLightbox(1));

    lbFan.appendChild(card);
  });
}

// ── CUSTOM CURSOR ──────────────────────────────────────────
function setupCursor() {
  const cursor   = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = "button, a, .filter-btn, .nav-menu-icon";
  const imgTargets   = ".photo-card, .lb-card";

  document.addEventListener("mouseover", e => {
    if (e.target.closest(imgTargets)) {
      document.body.classList.add("cursor-img");
      document.body.classList.remove("cursor-hover");
    } else if (e.target.closest(hoverTargets)) {
      document.body.classList.add("cursor-hover");
      document.body.classList.remove("cursor-img");
    }
  });
  document.addEventListener("mouseout", e => {
    if (!e.target.closest(imgTargets) && !e.target.closest(hoverTargets)) {
      document.body.classList.remove("cursor-hover", "cursor-img");
    }
  });
}

// ── NAVBAR SCROLL ──────────────────────────────────────────
function setupNavbar() {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  menuIcon.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}
