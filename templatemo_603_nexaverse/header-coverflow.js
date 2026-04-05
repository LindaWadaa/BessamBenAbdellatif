const slides = [
  {
    title: "Mountain Landscape",
    description: "Majestic peaks covered in snow during golden hour",
    image:
      "https://images.unsplash.com/photo-1464822759844-d150ad6d6df0?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Forest Path",
    description: "A mystical trail through ancient pines",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Lake Reflection",
    description: "Crystal waters mirroring alpine peaks",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1300&q=80"
  },
  {
    title: "Ocean Sunset",
    description: "Last rays over calm evening waves",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1300&q=80"
  },
  {
    title: "Desert Dunes",
    description: "Golden ridges sculpted by desert winds",
    image:
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1300&q=80"
  },
  {
    title: "Starry Night",
    description: "Milky Way floating above the horizon",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1300&q=80"
  },
  {
    title: "Waterfall",
    description: "Fresh cascade in a lush green valley",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1300&q=80"
  }
];

const coverflow = document.getElementById("coverflow");
const dotsContainer = document.getElementById("dots");
const titleEl = document.getElementById("hero-title");
const descriptionEl = document.getElementById("hero-description");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = playPauseBtn.querySelector(".play-icon");
const pauseIcon = playPauseBtn.querySelector(".pause-icon");
const container = document.querySelector(".coverflow-container");

let currentIndex = 0;
let autoplayTimer = null;
let isPlaying = true;
let isAnimating = false;

function createSlide(slide, index) {
  const item = document.createElement("article");
  item.className = "coverflow-item";
  item.dataset.index = index;

  const cover = document.createElement("div");
  cover.className = "cover";

  const image = document.createElement("img");
  image.src = slide.image;
  image.alt = slide.title;
  image.loading = "lazy";

  const reflection = document.createElement("div");
  reflection.className = "reflection";
  reflection.style.backgroundImage = `url(${slide.image})`;

  cover.appendChild(image);
  item.appendChild(cover);
  item.appendChild(reflection);

  item.addEventListener("click", () => {
    if (index !== currentIndex) {
      goTo(index);
      stopAutoplay();
    }
  });

  return item;
}

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Aller à l'image ${index + 1}`);
    dot.addEventListener("click", () => {
      goTo(index);
      stopAutoplay();
    });
    dotsContainer.appendChild(dot);
  });
}

function build() {
  slides.forEach((slide, index) => {
    coverflow.appendChild(createSlide(slide, index));
  });
  createDots();
  update();
}

function update() {
  if (isAnimating) return;
  isAnimating = true;

  const items = [...document.querySelectorAll(".coverflow-item")];
  const dots = [...document.querySelectorAll(".dot")];

  items.forEach((item, index) => {
    let offset = index - currentIndex;
    const half = slides.length / 2;

    if (offset > half) offset -= slides.length;
    if (offset < -half) offset += slides.length;

    const abs = Math.abs(offset);
    const direction = Math.sign(offset);

    let x = offset * 190;
    let z = -abs * 195;
    let rotateY = -direction * Math.min(abs * 62, 62);
    let scale = 1 - abs * 0.13;
    let opacity = 1 - abs * 0.2;

    if (abs > 3) {
      opacity = 0;
      x = direction * 1200;
    }

    item.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
    item.style.opacity = opacity;
    item.style.zIndex = String(120 - abs);

    const reflection = item.querySelector(".reflection");
    if (reflection) {
      const reflectionOpacity = Math.max(0.2, 0.58 - abs * 0.1);
      reflection.style.opacity = String(reflectionOpacity);
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  titleEl.textContent = slides[currentIndex].title;
  descriptionEl.textContent = slides[currentIndex].description;

  setTimeout(() => {
    isAnimating = false;
  }, 660);
}

function goTo(index) {
  if (isAnimating || index === currentIndex) return;
  currentIndex = index;
  update();
}

function navigate(direction) {
  if (isAnimating) return;
  currentIndex = (currentIndex + direction + slides.length) % slides.length;
  update();
}

function startAutoplay() {
  if (autoplayTimer) return;
  autoplayTimer = setInterval(() => {
    navigate(1);
  }, 3800);

  isPlaying = true;
  playIcon.style.display = "none";
  pauseIcon.style.display = "inline";
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  isPlaying = false;
  playIcon.style.display = "inline";
  pauseIcon.style.display = "none";
}

function toggleAutoplay() {
  if (isPlaying) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

let touchStartX = 0;
let touchStartY = 0;

container.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  },
  { passive: true }
);

container.addEventListener(
  "touchend",
  (event) => {
    const endX = event.changedTouches[0].screenX;
    const endY = event.changedTouches[0].screenY;

    const diffX = touchStartX - endX;
    const diffY = touchStartY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) navigate(1);
      else navigate(-1);
      stopAutoplay();
    }
  },
  { passive: true }
);

container.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    navigate(-1);
    stopAutoplay();
  }
  if (event.key === "ArrowRight") {
    navigate(1);
    stopAutoplay();
  }
});

prevBtn.addEventListener("click", () => {
  navigate(-1);
  stopAutoplay();
});

nextBtn.addEventListener("click", () => {
  navigate(1);
  stopAutoplay();
});

playPauseBtn.addEventListener("click", toggleAutoplay);

build();
startAutoplay();
