(() => {
  function updateActivePanelSwiper(panel) {
    if (!panel) {
      return;
    }

    const swiperEl = panel.querySelector("[data-home-swiper]");
    if (!swiperEl) {
      return;
    }

    if (swiperEl.swiper) {
      swiperEl.swiper.update();
      swiperEl.swiper.slideTo(0, 0);
      return;
    }

    if (window.initHomeSwipers) {
      window.initHomeSwipers(panel);
    }
  }

  function initWellnessSection(section) {
    if (!section || section.dataset.wellnessReady === "true") {
      return;
    }

    const tabs = Array.from(section.querySelectorAll("[data-wellness-tab]"));
    const panels = Array.from(
      section.querySelectorAll("[data-wellness-panel]"),
    );
    if (!tabs.length || !panels.length) {
      return;
    }

    const setActiveTab = (targetKey) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.wellnessTab === targetKey;
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.wellnessPanel === targetKey;
        panel.classList.toggle("is-active", isActive);
        if (isActive) {
          updateActivePanelSwiper(panel);
        }
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveTab(tab.dataset.wellnessTab);
      });
    });

    setActiveTab(tabs[0].dataset.wellnessTab);
    section.dataset.wellnessReady = "true";
  }

  function initAllWellnessSections(root = document) {
    if (root.matches && root.matches("[data-home-wellness]")) {
      initWellnessSection(root);
    }

    root.querySelectorAll("[data-home-wellness]").forEach((section) => {
      initWellnessSection(section);
    });
  }

  document.addEventListener("DOMContentLoaded", () =>
    initAllWellnessSections(),
  );
  document.addEventListener("shopify:section:load", (event) =>
    initAllWellnessSections(event.target),
  );
})();
