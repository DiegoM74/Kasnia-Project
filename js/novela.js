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
      // Skip modal for upcoming volumes
      if (card.classList.contains("upcoming")) {
        return;
      }
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

function isValidLink(link) {
  return link && link !== "#" && link.trim() !== "";
}

function hasValidLinks(serverLinks) {
  return isValidLink(serverLinks?.pdf) || isValidLink(serverLinks?.epub);
}

function openModal(card) {
  const modalOverlay = document.getElementById("downloadModal");
  const modalTitle = document.getElementById("modalVolumeTitle");
  const creditsContainer = document.getElementById("creditsContainer");
  const modalHeader = document.querySelector(".modalHeader");

  if (!modalOverlay || !card) return;

  const volumeNumber = card.dataset.volume;
  const creditsData = JSON.parse(card.dataset.credits || "[]");
  const linksData = JSON.parse(card.dataset.links || "{}");
  const isPreview = card.classList.contains("preview");

  // Update modal title with preview indicator if needed
  const existingIndicator = modalHeader.querySelector(".previewIndicator");
  if (existingIndicator) {
    existingIndicator.remove();
  }

  modalTitle.textContent = `Volumen ${volumeNumber}`;

  if (isPreview) {
    const indicator = document.createElement("span");
    indicator.className = "previewIndicator";
    indicator.innerHTML = `
      <svg><use href="/img/svg/novela.svg#eyeIcon" /></svg>
      Vista previa
    `;
    modalTitle.insertAdjacentElement("afterend", indicator);
  }

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
  modalOverlay.dataset.isPreview = isPreview ? "true" : "false";

  // Update server button states based on available links
  updateServerButtons(linksData);

  // Determine which server to show first
  let activeServer = "propio";
  const propioHasLinks = hasValidLinks(linksData.propio);
  const driveHasLinks = hasValidLinks(linksData.drive);

  if (!propioHasLinks && driveHasLinks) {
    activeServer = "drive";
  }

  // Set the correct active button
  const serverBtns = document.querySelectorAll(".serverBtn");
  serverBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.server === activeServer) {
      btn.classList.add("active");
    }
  });

  updateDownloadLinks(linksData, activeServer);

  modalOverlay.classList.add("active");
}

function updateServerButtons(linksData) {
  const serverBtns = document.querySelectorAll(".serverBtn");

  serverBtns.forEach((btn) => {
    const server = btn.dataset.server;
    const serverLinks = linksData[server];
    const hasLinks = hasValidLinks(serverLinks);

    if (hasLinks) {
      btn.classList.remove("disabled");
    } else {
      btn.classList.add("disabled");
    }
  });
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

  // Update PDF link
  pdfLink.href = serverLinks.pdf || "#";
  if (isValidLink(serverLinks.pdf)) {
    pdfLink.classList.remove("disabled");
  } else {
    pdfLink.classList.add("disabled");
  }

  // Update EPUB link
  epubLink.href = serverLinks.epub || "#";
  if (isValidLink(serverLinks.epub)) {
    epubLink.classList.remove("disabled");
  } else {
    epubLink.classList.add("disabled");
  }
}

function initServerToggle() {
  const serverBtns = document.querySelectorAll(".serverBtn");

  serverBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Don't switch if button is disabled or already active
      if (
        btn.classList.contains("disabled") ||
        btn.classList.contains("active")
      ) {
        return;
      }

      serverBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      triggerLinkUpdate(btn.dataset.server);
    });
  });
}

function triggerLinkUpdate(server) {
  updateDownloadLinks(null, server);

  const links = document.querySelectorAll(".downloadLink:not(.disabled)");
  links.forEach((link) => {
    link.classList.remove("update-flash");
    void link.offsetWidth;
    link.classList.add("update-flash");
  });
}
