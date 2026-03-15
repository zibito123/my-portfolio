/* ===============================
    NAVIGATION MENU TOGGLE
================================= */
function myMenuFunction() {
  const menuBtn = document.getElementById("myNavMenu");
  if (menuBtn) {
    menuBtn.classList.toggle("responsive");
  }
}

/* ===============================
    HEADER SHADOW & SCROLL LOGIC
================================= */
// Using a single scroll listener for better performance
window.addEventListener("scroll", () => {
  headerShadow();
  scrollActive();
});

function headerShadow() {
  const navHeader = document.getElementById("header");
  if (!navHeader) return;

  if (window.scrollY > 50) {
    navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
    navHeader.style.height = "70px";
    navHeader.style.lineHeight = "70px";
  } else {
    navHeader.style.boxShadow = "none";
    navHeader.style.height = "90px";
    navHeader.style.lineHeight = "90px";
  }
}

/* ===============================
    TYPING EFFECT (Updated for CV Sync)
================================= */
if (typeof Typed !== "undefined") {
  new Typed(".typedText", {
    // Aligned with your CV's professional summary
    strings: [
      "Salim Seidu",
      "junior Full - Stack Developer",
      "Backend Specialist",
      "Distributed Systems Designer"
    ],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 2000,
  });
}

/* ===============================
    SCROLL REVEAL ANIMATIONS
================================= */
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "80px",
    duration: 2000,
    reset: true,
  });

  sr.reveal(".featured-text-card", {});
  sr.reveal(".featured-name", { delay: 100 });
  sr.reveal(".featured-text-info", { delay: 200 });
  sr.reveal(".featured-text-btn", { delay: 200 });
  sr.reveal(".social_icons", { delay: 200 });
  sr.reveal(".featured-image", { delay: 300 });

  sr.reveal(".project-box", { interval: 200 });
  sr.reveal(".top-header", {});

  const srLeft = ScrollReveal({
    origin: "left",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  srLeft.reveal(".about-info", { delay: 100 });
  srLeft.reveal(".contact-info", { delay: 100 });

  const srRight = ScrollReveal({
    origin: "right",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  srRight.reveal(".skills-box", { delay: 100 });
  srRight.reveal(".form-control", { delay: 100 });
}

/* ===============================
    ACTIVE LINK ON SCROLL
================================= */
function scrollActive() {
  const scrollY = window.scrollY;
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 70; // Adjusted for the header height
    const sectionId = current.getAttribute("id");
    const link = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

    if (link) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link.classList.add("active-link");
      } else {
        link.classList.remove("active-link");
      }
    }
  });
}

/* ===============================
    DARK THEME TOGGLE
================================= */
function toggleDarkTheme() {
  const body = document.body;
  const themeIcon = document.querySelector(".dark-theme-toggle i");

  body.classList.toggle("dark-theme");

  if (themeIcon) {
    if (body.classList.contains("dark-theme")) {
      themeIcon.classList.replace("uil-moon", "uil-sun");
    } else {
      themeIcon.classList.replace("uil-sun", "uil-moon");
    }
  }
}