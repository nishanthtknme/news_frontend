document.addEventListener("DOMContentLoaded", () => {

// ================= NAVBAR & DRAWER =================
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');
const closeBtn = document.getElementById('closeDrawer');
const backdrop = document.getElementById('backdrop');
const navbar = document.querySelector('nav'); // navbar element

// ---------------- OPEN DRAWER ----------------
toggle?.addEventListener('click', () => {
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
  backdrop.classList.remove('hidden');
  document.body.classList.add('overflow-hidden'); // prevent scrolling
});

// ---------------- CLOSE DRAWER ----------------
function closeDrawer() {
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
  backdrop.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// Close events
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeDrawer();
});

// ---------------- NAVBAR BLUR ON SCROLL ----------------
function updateNavbar() {
  if(window.scrollY > 20) {
    navbar.classList.add('backdrop-blur', 'bg-white/5'); // subtle blur, almost transparent
  } else {
    navbar.classList.remove('backdrop-blur', 'bg-white/5');
  }
}
window.addEventListener('scroll', updateNavbar);
updateNavbar(); // initial check

// ---------------- CLOSE DRAWER ----------------
function closeDrawer() {
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
  backdrop.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// Close events
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeDrawer();
});



  /* ================= FILTERS ================= */
  const grid = document.getElementById("grid");
  const gridCards = grid ? [...grid.querySelectorAll(".card")] : [];
  const noResults = document.getElementById("noResults");

  const desktopSearch = document.getElementById("desktopSearch");
  const drawerSearch = document.getElementById("drawerSearch");
  const desktopCategory = document.getElementById("desktopCategory");
  const drawerCategory = document.getElementById("drawerCategory");
  const desktopMedia = document.getElementById("desktopMedia");
  const drawerMedia = document.getElementById("drawerMedia");
  const desktopDate = document.getElementById("desktopDate");
  const drawerDate = document.getElementById("drawerDate");

  function applyFilters() {
    const search = (desktopSearch?.value || drawerSearch?.value || "").toLowerCase();
    const cat = desktopCategory?.value || drawerCategory?.value || "";
    const med = desktopMedia?.value || drawerMedia?.value || "";
    const date = desktopDate?.value || drawerDate?.value || "";

    let count = 0;
    gridCards.forEach(card => {
      const ok =
        (!search || card.textContent.toLowerCase().includes(search)) &&
        (!cat || card.dataset.category === cat) &&
        (!med || card.dataset.media === med) &&
        (!date || card.dataset.date === date);

      card.style.display = ok ? "" : "none";
      if (ok) count++;
    });

    noResults?.classList.toggle("hidden", count !== 0);
  }

  [desktopSearch, drawerSearch].forEach(el => el?.addEventListener("input", applyFilters));
  [desktopCategory, drawerCategory, desktopMedia, drawerMedia, desktopDate, drawerDate]
    .forEach(el => el?.addEventListener("change", applyFilters));

  applyFilters();

  /* ================= THEME ================= */
  const themes = {
    light: { body:"#fff", text:"#000", drawer:"#f5f5f5", modal:"#0006", modalContent:"#fff" },
    dark: { body:"#000", text:"#fff", drawer:"#18181b", modal:"#0008", modalContent:"#111" }
  };
  const desktopToggle = document.getElementById("themeToggle");
  const mobileToggle = document.getElementById("themeToggleMobile");

  function applyTheme(theme){
    const s = themes[theme];
    document.body.style.background = s.body;
    document.body.style.color = s.text;
    drawer?.style.setProperty("background", s.drawer);
    document.getElementById("modal")?.style.setProperty("background", s.modal);
    document.getElementById("modalContent")?.style.setProperty("background", s.modalContent);
    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  if(desktopToggle) desktopToggle.checked = savedTheme === "dark";
  if(mobileToggle) mobileToggle.checked = savedTheme === "dark";

  desktopToggle?.addEventListener("change", () => {
    const t = desktopToggle.checked ? "dark" : "light";
    applyTheme(t);
    if(mobileToggle) mobileToggle.checked = desktopToggle.checked;
  });
  mobileToggle?.addEventListener("change", () => {
    if(desktopToggle){
      desktopToggle.checked = mobileToggle.checked;
      desktopToggle.dispatchEvent(new Event("change"));
    }
  });

const storyCards = document.querySelectorAll(".story-card");
const storyViewer = document.getElementById("storyViewer");
const storyImage = document.getElementById("storyImage");
const closeStory = document.getElementById("closeStory");
const progressBar = document.getElementById("progressBar");
const prevStoryZone = document.getElementById("prevStory");
const nextStoryZone = document.getElementById("nextStory");

let currentIndex = 0;
let storyTimer;
let progress = 0;
const storyDuration = 5000; // 5 seconds

function startProgress() {
  progress = 0;
  progressBar.style.width = "0%";
  const step = 50; // update every 50ms
  storyTimer = setInterval(() => {
    progress += step;
    const percent = Math.min((progress / storyDuration) * 100, 100);
    progressBar.style.width = percent + "%";
    if (progress >= storyDuration) {
      clearInterval(storyTimer);
      nextStory();
    }
  }, step);
}

function openStory(index) {
  currentIndex = index;
  const card = storyCards[currentIndex];

  // Show viewer
  storyViewer.classList.remove("hidden");
  storyImage.src = card.dataset.story;

  // Mark as viewed
  card.dataset.viewed = "true";
  card.classList.remove("bg-red-600");

  // Move story to end
  card.parentNode.appendChild(card);

  // Start progress
  clearInterval(storyTimer);
  startProgress();
}

function nextStory() {
  currentIndex++;
  if (currentIndex >= storyCards.length) {
    closeStoryViewer();
    return;
  }
  openStory(currentIndex);
}

function prevStory() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 0;
    return;
  }
  openStory(currentIndex);
}

function closeStoryViewer() {
  storyViewer.classList.add("hidden");
  storyImage.src = "";
  clearInterval(storyTimer);
  progressBar.style.width = "0%";
}

// Card click to open
storyCards.forEach((card, index) => {
  card.addEventListener("click", () => openStory(index));
});

// Close story
closeStory.addEventListener("click", closeStoryViewer);

// Tap zones
nextStoryZone.addEventListener("click", () => {
  clearInterval(storyTimer);
  nextStory();
});

prevStoryZone.addEventListener("click", () => {
  clearInterval(storyTimer);
  prevStory();
});

  /* ================= LOGIN/SIGNUP/FORGOT ================= */
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const signupModal = document.getElementById("signupModal");
  const signupContent = document.getElementById("signupContent");
  const forgotModal = document.getElementById("forgotModal");
  const forgotContent = document.getElementById("forgotContent");
  const layer = document.getElementById("successLayer");
  const spinner = document.getElementById("spinner");
  const check = document.getElementById("checkmark");
  const cross = document.getElementById("cross");
  const textSuccess = document.getElementById("successText");
  const textFail = document.getElementById("failText");
  const pulse = document.getElementById("pulseBg");

  function resetAnimations(){
    spinner?.classList.remove("hidden");
    check?.classList.add("hidden");
    cross?.classList.add("hidden");
    textSuccess?.classList.add("hidden");
    textFail?.classList.add("hidden");
    pulse?.classList.add("hidden");
  }

  window.openModal = () => {
    closeDrawer();
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    modalContent?.classList.remove("modal-slide-out","shake");
  };

  window.closeModal = () => {
    modalContent?.classList.add("modal-slide-out");
    setTimeout(()=>{
      modal?.classList.add("hidden");
      modal?.classList.remove("flex");
      layer?.classList.add("hidden");
      resetAnimations();
    },300);
  };

  window.openSignup = () => {
    closeModal();
    signupModal?.classList.remove("hidden");
    signupModal?.classList.add("flex");
  };
  window.closeSignup = () => {
    signupModal?.classList.add("hidden");
    signupModal?.classList.remove("flex");
  };

  window.openForgot = () => {
    closeModal(); closeSignup();
    forgotModal?.classList.remove("hidden");
    forgotModal?.classList.add("flex");
  };
  window.closeForgot = () => {
    forgotModal?.classList.add("hidden");
    forgotModal?.classList.remove("flex");
  };

});
