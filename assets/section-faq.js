(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function setExpandedState(trigger, panel, expanded) {
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    panel.setAttribute("aria-hidden", expanded ? "false" : "true");
  }

  function openFaqItem(item, immediate) {
    const trigger = item.querySelector(".faq-item__trigger");
    const panel = item.querySelector(".faq-item__panel");

    if (!trigger || !panel || item.classList.contains("is-open")) {
      return;
    }

    item.classList.add("is-open");
    setExpandedState(trigger, panel, true);
    panel.style.height = "0px";

    const targetHeight = panel.scrollHeight;
    if (immediate || prefersReducedMotion) {
      panel.style.height = "auto";
      return;
    }

    requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
    });

    const onOpenEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }
      if (item.classList.contains("is-open")) {
        panel.style.height = "auto";
      }
      panel.removeEventListener("transitionend", onOpenEnd);
    };

    panel.addEventListener("transitionend", onOpenEnd);
  }

  function closeFaqItem(item, immediate) {
    const trigger = item.querySelector(".faq-item__trigger");
    const panel = item.querySelector(".faq-item__panel");

    if (!trigger || !panel || !item.classList.contains("is-open")) {
      return;
    }

    const startHeight = panel.scrollHeight;
    panel.style.height = `${startHeight}px`;
    setExpandedState(trigger, panel, false);

    if (immediate || prefersReducedMotion) {
      item.classList.remove("is-open");
      panel.style.height = "0px";
      return;
    }

    requestAnimationFrame(() => {
      item.classList.remove("is-open");
      panel.style.height = "0px";
    });
  }

  function initFaqSection(section) {
    if (!section || section.dataset.faqReady === "true") {
      return;
    }

    const items = Array.from(section.querySelectorAll(".faq-item"));
    const singleOpen = section.dataset.singleOpen === "true";

    if (!items.length) {
      return;
    }

    items.forEach((item) => {
      const trigger = item.querySelector(".faq-item__trigger");
      const panel = item.querySelector(".faq-item__panel");
      if (!trigger || !panel) {
        return;
      }

      const shouldOpen = item.dataset.initialOpen === "true";
      setExpandedState(trigger, panel, shouldOpen);
      panel.style.height = shouldOpen ? "auto" : "0px";
      if (shouldOpen) {
        item.classList.add("is-open");
      } else {
        item.classList.remove("is-open");
      }

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        if (isOpen) {
          closeFaqItem(item, false);
          return;
        }

        if (singleOpen) {
          items.forEach((otherItem) => {
            if (otherItem !== item) {
              closeFaqItem(otherItem, false);
            }
          });
        }

        openFaqItem(item, false);
      });
    });

    section.dataset.faqReady = "true";
  }

  function initAllFaqSections(root = document) {
    if (root.matches && root.matches("[data-faq-section]")) {
      initFaqSection(root);
    }

    root.querySelectorAll("[data-faq-section]").forEach((section) => {
      initFaqSection(section);
    });
  }

  document.addEventListener("DOMContentLoaded", () => initAllFaqSections());
  document.addEventListener("shopify:section:load", (event) =>
    initAllFaqSections(event.target),
  );
})();
