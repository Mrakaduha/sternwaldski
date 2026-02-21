console.log("MAIN JS LOADED");
const space = document.getElementById("space");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

const SPIRAL_CENTER_Y_RATIO = 0.6;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function renderFragments(fragments) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const centerX = width / 2;
  const centerY = height * SPIRAL_CENTER_Y_RATIO;

  const total = fragments.length;
  const base = Math.min(width, height);
  const scale = base / (5 * Math.sqrt(total));

  fragments.forEach((fragment, index) => {
    const n = index + 1;

    const angle = n * GOLDEN_ANGLE;
    const radius = scale * Math.sqrt(n);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    star.addEventListener("click", () => {
      modalText.textContent = fragment.text;
      modal.classList.remove("hidden");
    });

    space.appendChild(star);
  });
}

function startRotation() {
  let angle = 0;

  function animate() {
    angle += 0.0002;
    space.style.transform = `rotate(${angle}rad)`;
    requestAnimationFrame(animate);
  }

  animate();
}

modal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

async function init() {
  const response = await fetch("ideas.json", { cache: "no-store" });
  const fragments = await response.json();

  renderFragments(fragments);
  startRotation();
}

const northStar = document.getElementById("north-star");

northStar.addEventListener("click", () => {
  modalText.textContent =
    "Mr. Sternwaldski keeps looking for the word that holds the others in place. The sky continues to move.";
  modal.classList.remove("hidden");
});

init();