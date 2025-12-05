document.addEventListener("DOMContentLoaded", () => {
  initSynopsisToggle();
  initModal();
  initServerToggle();
});

function initSynopsisToggle() {
  const synopsisContent = document.querySelector(".synopsisContent");
  const synopsisToggle = document.querySelector(".synopsisToggle");

  if (!synopsisContent || !synopsisToggle) return;

  const checkOverflow = () => {
    synopsisContent.classList.add("collapsed");
    const isOverflowing =
      synopsisContent.scrollHeight > synopsisContent.clientHeight;

    if (isOverflowing) {
      synopsisToggle.classList.add("visible");
    } else {
      synopsisToggle.classList.remove("visible");
      synopsisContent.classList.remove("collapsed");
    }
  };

  checkOverflow();
  window.addEventListener("resize", checkOverflow);

  synopsisToggle.addEventListener("click", () => {
    const isExpanded = synopsisToggle.classList.contains("expanded");

    if (isExpanded) {
      synopsisContent.classList.add("collapsed");
      synopsisToggle.classList.remove("expanded");
      synopsisToggle.innerHTML = `
        Ver más
        <svg><use href="/img/svg/novela.svg#chevronDown" /></svg>
      `;
    } else {
      synopsisContent.classList.remove("collapsed");
      synopsisToggle.classList.add("expanded");
      synopsisToggle.innerHTML = `
        Ver menos
        <svg><use href="/img/svg/novela.svg#chevronDown" /></svg>
      `;
    }
  });
}

function initModal() {
  const volumeCards = document.querySelectorAll(".volumeCard");
  const modalOverlay = document.getElementById("downloadModal");
  const modalClose = document.querySelector(".modalClose");

  if (!modalOverlay) return;

  volumeCards.forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
}

function openModal(card) {
  const modalOverlay = document.getElementById("downloadModal");
  const modalTitle = document.getElementById("modalVolumeTitle");
  const creditsContainer = document.getElementById("creditsContainer");

  if (!modalOverlay || !card) return;

  const volumeNumber = card.dataset.volume;
  const creditsData = JSON.parse(card.dataset.credits || "[]");
  const linksData = JSON.parse(card.dataset.links || "{}");

  modalTitle.textContent = `Volumen ${volumeNumber}`;

  creditsContainer.innerHTML = creditsData
    .map(
      (credit) => `
    <div class="creditItem">
      <span class="creditRole">${credit.role}</span>
      <span class="creditName">${credit.name}</span>
    </div>
  `
    )
    .join("");

  modalOverlay.dataset.currentLinks = JSON.stringify(linksData);

  const activeServer =
    document.querySelector(".serverBtn.active")?.dataset.server || "propio";
  updateDownloadLinks(linksData, activeServer);

  modalOverlay.classList.add("active");
}

function closeModal() {
  const modalOverlay = document.getElementById("downloadModal");
  modalOverlay.classList.remove("active");
}

function updateDownloadLinks(linksData, server) {
  const pdfLink = document.getElementById("pdfDownloadLink");
  const epubLink = document.getElementById("epubDownloadLink");

  if (!linksData) {
    const modalOverlay = document.getElementById("downloadModal");
    linksData = JSON.parse(modalOverlay.dataset.currentLinks || "{}");
  }

  const serverLinks = linksData[server] || { pdf: "#", epub: "#" };

  pdfLink.href = serverLinks.pdf;
  epubLink.href = serverLinks.epub;
}

function initServerToggle() {
  const serverBtns = document.querySelectorAll(".serverBtn");

  serverBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      serverBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      triggerLinkUpdate(btn.dataset.server);
    });
  });
}

function triggerLinkUpdate(server) {
  updateDownloadLinks(null, server);

  const links = document.querySelectorAll(".downloadLink");
  links.forEach((link) => {
    link.classList.remove("update-flash");
    void link.offsetWidth;
    link.classList.add("update-flash");
  });
}
