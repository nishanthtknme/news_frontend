document.addEventListener("DOMContentLoaded", () => {

// ================= NAVBAR & DRAWER =================
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');
const closeBtn = document.getElementById('closeDrawer');
const backdrop = document.getElementById('backdrop');
const navbar = document.querySelector('nav'); // navbar element
const applyFiltersBtn = document.getElementById('applyFiltersBtn'); // apply filters button

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

// ---------------- CLOSE EVENTS ----------------
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeDrawer();
});

// ---------------- CLOSE DRAWER ON APPLY ----------------
applyFiltersBtn?.addEventListener('click', () => {
  // You can also handle filter logic here
  closeDrawer();
});

// ---------------- NAVBAR BLUR ON SCROLL ----------------
function updateNavbar() {
  if(window.scrollY > 20) {
    navbar.classList.add('backdrop-blur', 'bg-white/5'); // subtle blur
  } else {
    navbar.classList.remove('backdrop-blur', 'bg-white/5');
  }
}
window.addEventListener('scroll', updateNavbar);
updateNavbar(); // initial check



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





});



/* ======================================================
   GLOBAL VARIABLES (MUST BE GLOBAL)
====================================================== */
let loginModal, signupModal, forgotModal;
let loginBtn, signupBtn, forgotBtn;
let signupError, forgotError;

let layer, spinner, check, cross, pulse;
let textSuccess, textFail;

/* ======================================================
   DOM READY
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- Modal Elements ---- */
  loginModal = document.getElementById("loginModal");
  signupModal = document.getElementById("signupModal");
  forgotModal = document.getElementById("forgotModal");

  /* ---- Buttons ---- */
  loginBtn = document.getElementById("loginBtn");
  signupBtn = document.getElementById("signupBtn");
  forgotBtn = document.getElementById("forgotBtn");

  /* ---- Errors ---- */
  signupError = document.getElementById("signupError");
  forgotError = document.getElementById("forgotError");

  /* ---- Success Layer ---- */
  layer = document.getElementById("successLayer");
  spinner = document.getElementById("spinner");
  check = document.getElementById("checkmark");
  cross = document.getElementById("cross");
  pulse = document.getElementById("pulseBg");
  textSuccess = document.getElementById("successText");
  textFail = document.getElementById("failText");

  /* ---- OPEN LOGIN FROM HEADER ---- */
  document.getElementById("loginOpen")?.addEventListener("click", openModal);

  /* ---- LOGIN ---- */
  loginBtn?.addEventListener("click", simulateLogin);

  /* ---- SIGNUP ---- */
  signupBtn?.addEventListener("click", handleSignup);

  /* ---- FORGOT PASSWORD ---- */
  forgotBtn?.addEventListener("click", handleForgot);
});

/* ======================================================
   MODAL OPEN / CLOSE
====================================================== */
function openModal() {
  if (!loginModal) return;
  loginModal.classList.remove("hidden");
  loginModal.classList.add("flex", "modal-fade");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex", "modal-fade");
}

function openSignup() {
  closeModal("loginModal");
  signupModal?.classList.remove("hidden");
  signupModal?.classList.add("flex", "modal-fade");
}

function closeSignup() {
  signupModal?.classList.add("hidden");
  signupModal?.classList.remove("flex", "modal-fade");
  signupError?.classList.add("hidden");

  document.getElementById("signupUsername").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("signupConfirm").value = "";
}

function openForgot() {
  closeModal("loginModal");
  closeSignup();
  forgotModal?.classList.remove("hidden");
  forgotModal?.classList.add("flex", "modal-fade");
}

function closeForgot() {
  forgotModal?.classList.add("hidden");
  forgotModal?.classList.remove("flex", "modal-fade");
  forgotError?.classList.add("hidden");
  document.getElementById("forgotUsername").value = "";
}

function switchToLogin() {
  closeSignup();
  openModal();
}

function switchToLoginFromForgot() {
  closeForgot();
  openModal();
}

/* ======================================================
   LOGIN
====================================================== */
function simulateLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  resetAnimations();

  if (!username || !password) {
    textFail.textContent = "Please enter username and password";
    textFail.classList.remove("hidden");
    layer.classList.remove("hidden");
    return;
  }

  if (username === "test" && password === "1234") {
    showSuccess(`Logged in as: ${username}`);
  } else {
    layer.classList.remove("hidden");
    cross.classList.remove("hidden");
    textFail.textContent = "Invalid username or password";
    textFail.classList.remove("hidden");

    setTimeout(() => {
      layer.classList.add("hidden");
      resetAnimations();
    }, 1200);
  }
}

/* ======================================================
   SIGNUP
====================================================== */
function handleSignup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!username || !password || !confirm) {
    signupError.textContent = "All fields are required.";
    signupError.classList.remove("hidden");
    return;
  }

  if (password !== confirm) {
    signupError.textContent = "Passwords do not match!";
    signupError.classList.remove("hidden");
    return;
  }

  signupError.classList.add("hidden");
  showSuccess(`Account created for: ${username}`);
}

/* ======================================================
   FORGOT PASSWORD
====================================================== */
function handleForgot() {
  const username = document.getElementById("forgotUsername").value.trim();

  if (!username) {
    forgotError.textContent = "Please enter your username or email.";
    forgotError.classList.remove("hidden");
    return;
  }

  forgotError.classList.add("hidden");
  showSuccess(`Password reset link sent to: ${username}`);
}

/* ======================================================
   SUCCESS / FAIL ANIMATION
====================================================== */
function resetAnimations() {
  spinner.classList.remove("hidden");
  check.classList.add("hidden");
  cross.classList.add("hidden");
  pulse.classList.add("hidden");
  textSuccess.classList.add("hidden");
  textFail.classList.add("hidden");
}

function showSuccess(message) {
  resetAnimations();
  layer.classList.remove("hidden");

  textSuccess.textContent = message;
  textSuccess.classList.remove("hidden");

  setTimeout(() => {
    spinner.classList.add("hidden");
    check.classList.remove("hidden");
    pulse.classList.remove("hidden");

    setTimeout(() => {
      layer.classList.add("hidden");
      resetAnimations();
      closeSignup();
      closeForgot();
      closeModal("loginModal");
    }, 1200);
  }, 500);
}



