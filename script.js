/* Progressive enhancement: cursor-reactive card tilt.
   The page works fully without this file. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (0.5 - y) * 8;
      var tiltY = (x - 0.5) * 8;
      card.style.transform =
        "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });

    // PostHog event tracking for card clicks
    card.addEventListener("click", function () {
      if (typeof posthog !== 'undefined' && typeof posthog.capture === 'function') {
        var appName = card.querySelector(".card__name")?.textContent || "Unknown App";
        posthog.capture('clicked_app_card', { app_name: appName });
      }
    });
  });
})();
