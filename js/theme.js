(function () {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Función para guardar y aplicar cambios
      const updateTheme = () => {
        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      };

      // View Transition API
      if (document.startViewTransition) {
        // Guardar y remover temporalmente los view-transition-name de las portadas
        const elementsWithTransition = document.querySelectorAll(
          '[style*="view-transition-name"]'
        );
        const savedStyles = new Map();

        elementsWithTransition.forEach((el) => {
          savedStyles.set(el, el.getAttribute("style"));
          const newStyle = el
            .getAttribute("style")
            .replace(/view-transition-name:\s*[^;]+;?/g, "")
            .trim();
          if (newStyle) {
            el.setAttribute("style", newStyle);
          } else {
            el.removeAttribute("style");
          }
        });

        const transition = document.startViewTransition(updateTheme);

        // Restaurar los view-transition-name después de la transición
        transition.finished.finally(() => {
          elementsWithTransition.forEach((el) => {
            const savedStyle = savedStyles.get(el);
            if (savedStyle) {
              el.setAttribute("style", savedStyle);
            }
          });
        });
      } else {
        updateTheme();
      }
    });
  }
});
