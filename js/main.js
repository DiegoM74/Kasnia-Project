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
