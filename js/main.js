// Modo oscuro
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
const sunIcon = document.querySelector(".sunIcon");
const moonIcon = document.querySelector(".moonIcon");

// Actualizar icono según tema guardado
updateThemeIcon(html.getAttribute("data-theme"));

// Función para actualizar el icono según el tema
function updateThemeIcon(theme) {
  if (theme === "light") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
}

// Toggle del tema
themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Usar View Transition API si está disponible
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      html.setAttribute("data-theme", newTheme);
      updateThemeIcon(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  } else {
    html.setAttribute("data-theme", newTheme);
    updateThemeIcon(newTheme);
    localStorage.setItem("theme", newTheme);
  }
});

// Menú hamburguesa
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll(".mobileMenuLinks a");

// Función para abrir el menú
function openMenu() {
  mobileMenu.classList.add("active");
  menuToggle.classList.add("active");
  document.body.classList.add("menuOpen");
}

// Función para cerrar el menú
function closeMenuFunc() {
  mobileMenu.classList.remove("active");
  menuToggle.classList.remove("active");
  document.body.classList.remove("menuOpen");
}

// Abrir/cerrar menú con toggle
menuToggle.addEventListener("click", () => {
  if (mobileMenu.classList.contains("active")) {
    closeMenuFunc();
  } else {
    openMenu();
  }
});

// Cerrar menú al hacer click en un enlace
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMenuFunc);
});

// Cerrar menú al hacer click en el fondo
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    closeMenuFunc();
  }
});
