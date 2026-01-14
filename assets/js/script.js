document.addEventListener("DOMContentLoaded", () => {

  /* ================= DRAWER ================= */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  const closeBtn = document.getElementById('closeDrawer');
  const backdrop = document.getElementById('backdrop');
  const applyBtn = document.getElementById('applyFiltersBtn');

  const openDrawer = () => {
    drawer?.classList.remove("translate-x-full");
    backdrop?.classList.remove("hidden");
  };

  const closeDrawer = () => {
    drawer?.classList.add("translate-x-full");
    backdrop?.classList.add("hidden");
  };

  toggle?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => e.key === "Escape" && closeDrawer());
  applyBtn?.addEventListener("click", () => { applyFilters(); closeDrawer(); });

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

  /* ================= STORY VIEWER ================= */
  const storyCards = document.querySelectorAll(".story-card");
  const storyViewer = document.getElementById("storyViewer");
  const storyImage = document.getElementById("storyImage");
  const closeStory = document.getElementById("closeStory");

  storyCards.forEach(card => {
    card.addEventListener("click", () => {
      storyViewer.classList.remove("hidden");
      storyImage.src = card.dataset.story;
    });
  });
  closeStory?.addEventListener("click", () => {
    storyViewer.classList.add("hidden");
    storyImage.src = "";
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
