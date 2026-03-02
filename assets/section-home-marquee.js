(() => {
  function resetTrack(track) {
    Array.from(track.querySelectorAll('[data-marquee-clone="true"]')).forEach(
      (item) => {
        item.remove();
      },
    );
  }

  function buildMarquee(marquee) {
    const track = marquee.querySelector("[data-benefit-marquee-track]");
    if (!track) {
      return;
    }

    resetTrack(track);
    const originals = Array.from(track.querySelectorAll("[data-benefit-item]"));
    if (!originals.length) {
      return;
    }

    const containerWidth = marquee.clientWidth;
    let safeGuard = 0;
    while (track.scrollWidth < containerWidth * 2 && safeGuard < 40) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("data-marquee-clone", "true");
        clone.removeAttribute("id");
        track.appendChild(clone);
      });
      safeGuard += 1;
    }
  }

  function initMarqueeSection(root = document) {
    const marquees = root.querySelectorAll("[data-benefit-marquee]");
    marquees.forEach((marquee) => {
      buildMarquee(marquee);
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => initMarqueeSection(document), 180);
  });

  document.addEventListener("DOMContentLoaded", () =>
    initMarqueeSection(document),
  );
  document.addEventListener("shopify:section:load", (event) =>
    initMarqueeSection(event.target),
  );
})();
