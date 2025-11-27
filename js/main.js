const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll(".mobileMenuLinks a");

if (menuToggle && mobileMenu) {
  const openMenu = () => {
    mobileMenu.classList.add("active");
    menuToggle.classList.add("active");
    document.body.classList.add("menuOpen");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menuOpen");
  };

  // Abrir/Cerrar menú
  menuToggle.addEventListener("click", () => {
    const isActive = mobileMenu.classList.contains("active");
    isActive ? closeMenu() : openMenu();
  });

  // Cerrar al hacer click en un enlace
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar al hacer click fuera del menú
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });
}

// Botón Volver Arriba
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
