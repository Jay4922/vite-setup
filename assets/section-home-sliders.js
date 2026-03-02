(() => {
  let retryTimer;
  let isLoadingSwiper = false;

  function getScopedControl(container, attrName, fallbackSelector) {
    const explicitSelector = container.getAttribute(attrName);
    if (explicitSelector) {
      return document.querySelector(explicitSelector);
    }

    const scope =
      container.closest("[data-home-swiper-wrap]") || container.parentElement;
    if (!scope) {
      return null;
    }

    return scope.querySelector(fallbackSelector);
  }

  function initHomeSwiper(root = document) {
    if (!window.Swiper) {
      return;
    }

    const containers = root.querySelectorAll("[data-home-swiper]");
    containers.forEach((container) => {
      if (container.swiper) {
        return;
      }

      const kind = container.dataset.swiperKind || "cards";
      const pagination = getScopedControl(
        container,
        "data-swiper-pagination",
        ".home-slider-pagination",
      );
      const nextEl = getScopedControl(
        container,
        "data-swiper-next",
        ".home-slider-next",
      );
      const prevEl = getScopedControl(
        container,
        "data-swiper-prev",
        ".home-slider-prev",
      );

      const slidesTablet =
        kind === "reviews" ? 2 : kind === "wellness" ? 2.4 : 3;
      const slidesDesktop =
        kind === "reviews" ? 3 : kind === "wellness" ? 4 : 5;
      const isReviews = kind === "reviews";
      const shouldLoop = false;

      const config = {
        slidesPerView: 1.2,
        spaceBetween: 12,
        watchOverflow: !isReviews,
        observer: true,
        observeParents: true,
        allowTouchMove: true,
        loop: isReviews ? slideCount > 1 : shouldLoop,
        rewind: !isReviews,
        loopAdditionalSlides: shouldLoop ? 2 : 0,
        roundLengths: true,
        centeredSlides: false,
        slidesPerGroup: 1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        pagination: pagination
          ? { el: pagination, clickable: true }
          : undefined,
        navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
        breakpoints: {
          750: {
            slidesPerView: slidesTablet,
            spaceBetween: isReviews ? 14 : 16,
          },
          990: {
            slidesPerView: slidesDesktop,
            spaceBetween: isReviews ? 18 : 20,
          },
          1800: {
            slidesPerView: slidesDesktop,
            spaceBetween: isReviews ? 20 : 24,
          },
        },
      };

      new window.Swiper(container, config);
    });
  }

  function ensureSwiperLibrary(onReady) {
    if (window.Swiper) {
      onReady();
      return;
    }

    if (isLoadingSwiper) {
      return;
    }

    isLoadingSwiper = true;
    const existingScript = document.querySelector(
      "script[data-home-swiper-cdn]",
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        isLoadingSwiper = false;
        onReady();
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
    script.defer = true;
    script.setAttribute("data-home-swiper-cdn", "true");
    script.addEventListener("load", () => {
      isLoadingSwiper = false;
      onReady();
    });
    document.head.appendChild(script);
  }

  function initWhenReady(root = document, attempts = 30) {
    if (window.Swiper) {
      initHomeSwiper(root);
      return;
    }

    if (attempts <= 0) {
      return;
    }

    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(
      () => initWhenReady(root, attempts - 1),
      120,
    );
    ensureSwiperLibrary(() => initHomeSwiper(root));
  }

  window.initHomeSwipers = initWhenReady;

  document.addEventListener("DOMContentLoaded", () => initWhenReady(document));
  window.addEventListener("load", () => initWhenReady(document));
  document.addEventListener("shopify:section:load", (event) => {
    initWhenReady(event.target);
  });
})();
