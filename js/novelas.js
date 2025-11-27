(function () {
  "use strict";

  const state = {
    allNovels: [],
    filteredNovels: [],
    currentPage: 1,
    itemsPerPage: 10,
    selectedGenres: new Set(),
    searchQuery: "",
  };

  const elements = {
    searchInput: document.getElementById("searchInput"),
    filterToggle: document.getElementById("filterToggle"),
    genreFilters: document.getElementById("genreFilters"),
    genreList: document.getElementById("genreList"),
    novelsGrid: document.getElementById("novelsGrid"),
    noResultsMessage: document.getElementById("noResultsMessage"),
    // Solo paginación inferior
    paginationBottom: document.getElementById("paginationBottom"),
    itemsPerPageSelect: document.getElementById("itemsPerPage"),
    prevPageBottom: document.getElementById("prevPageBottom"),
    nextPageBottom: document.getElementById("nextPageBottom"),
    pageInfoBottom: document.getElementById("pageInfoBottom"),
  };

  let searchTimeout;

  async function init() {
    try {
      const response = await fetch("/novelas/novelas.json");
      if (!response.ok) throw new Error("Error al cargar novelas");
      state.allNovels = await response.json();
      state.filteredNovels = [...state.allNovels];

      setupEventListeners();
      renderGenreFilters();
      renderNovels();
      updatePaginationVisibility();
    } catch (error) {
      console.error(error);
    }
  }

  function setupEventListeners() {
    elements.searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim().toLowerCase();
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = val;
        applyFilters();
      }, 300);
    });

    elements.filterToggle.addEventListener("click", () => {
      const isExpanded =
        elements.filterToggle.getAttribute("aria-expanded") === "true";
      elements.filterToggle.setAttribute("aria-expanded", !isExpanded);
      elements.genreFilters.classList.toggle("is-open");
    });

    elements.itemsPerPageSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      state.itemsPerPage =
        val === "all" ? state.filteredNovels.length : parseInt(val);
      state.currentPage = 1;
      renderNovels();
      updatePagination();
    });

    elements.prevPageBottom.addEventListener("click", () => changePage(-1));
    elements.nextPageBottom.addEventListener("click", () => changePage(1));
  }

  function renderGenreFilters() {
    const allGenres = new Set();
    state.allNovels.forEach((n) => n.genres.forEach((g) => allGenres.add(g)));

    elements.genreList.innerHTML = Array.from(allGenres)
      .sort()
      .map(
        (g) =>
          `<button class="genreTag" data-genre="${g}" role="checkbox" aria-checked="false">${g}</button>`
      )
      .join("");

    elements.genreList.querySelectorAll(".genreTag").forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.genre;
        if (state.selectedGenres.has(g)) {
          state.selectedGenres.delete(g);
          btn.classList.remove("active");
          btn.setAttribute("aria-checked", "false");
        } else {
          state.selectedGenres.add(g);
          btn.classList.add("active");
          btn.setAttribute("aria-checked", "true");
        }
        applyFilters();
      });
    });
  }

  function applyFilters() {
    state.filteredNovels = state.allNovels.filter((novel) => {
      const matchSearch =
        !state.searchQuery ||
        novel.nameJp.toLowerCase().includes(state.searchQuery) ||
        novel.nameEn.toLowerCase().includes(state.searchQuery) ||
        (novel.nameEs &&
          novel.nameEs.toLowerCase().includes(state.searchQuery)) ||
        (novel.shortName &&
          novel.shortName.toLowerCase().includes(state.searchQuery));

      // CORRECCIÓN IMPORTANTE: Lógica AND (every) en lugar de OR (some)
      const matchGenres =
        state.selectedGenres.size === 0 ||
        Array.from(state.selectedGenres).every((g) => novel.genres.includes(g));

      return matchSearch && matchGenres;
    });

    state.currentPage = 1;
    renderNovels();
    updatePaginationVisibility();
  }

  function renderNovels() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageData = state.filteredNovels.slice(start, end);

    if (pageData.length === 0) {
      elements.novelsGrid.style.display = "none";
      elements.noResultsMessage.style.display = "block";
    } else {
      elements.novelsGrid.style.display = "grid";
      elements.noResultsMessage.style.display = "none";
      elements.novelsGrid.innerHTML = pageData
        .map(
          (novel) => `
        <a href="/novelas/${novel.link}" class="novelCard" style="view-transition-name: ${novel.id}">
          <div class="novelCoverContainer">
            <picture>
              <source srcset="/img/cover/avif/${novel.id}.avif" type="image/avif" />
              <img src="/img/cover/jpg/${novel.id}.jpg" alt="${novel.nameJp}" class="novelCover" loading="lazy" />
            </picture>
            <div class="hoverOverlay">
              <span>Leer Ahora</span>
            </div>
          </div>
        </a>
      `
        )
        .join("");
    }
    updatePagination();
  }

  function changePage(dir) {
    state.currentPage += dir;
    renderNovels();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updatePagination() {
    const total = Math.ceil(state.filteredNovels.length / state.itemsPerPage);
    elements.pageInfoBottom.textContent = `Página ${state.currentPage} de ${total}`;
    elements.prevPageBottom.disabled = state.currentPage === 1;
    elements.nextPageBottom.disabled = state.currentPage === total;
  }

  function updatePaginationVisibility() {
    // Solo mostrar si hay más de 10 novelas en total filtradas
    const show = state.filteredNovels.length > 10;
    elements.paginationBottom.style.display = show ? "flex" : "none";
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
