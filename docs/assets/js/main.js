/* Crowsetta — minimal scroll reveal logic.
   No frameworks. Graceful no-JS fallback handled in CSS via .no-js. */

(function () {
  'use strict';

  // Mark sections to reveal on scroll
  var revealTargets = document.querySelectorAll(
    '.section-head, .pitch-col, .pull-quote, .call-card, ' +
    '.arch-step, .arch-note, .roadmap-item, .credit-card, .limit-list li'
  );

  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  // If IntersectionObserver isn't supported, just reveal everything.
  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Small stagger for grouped elements
        var idx = Array.prototype.indexOf.call(
          entry.target.parentNode.children, entry.target
        );
        var delay = Math.min(idx, 8) * 60;
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(function (el) { observer.observe(el); });

  // Smooth-scroll handler for nav links (browsers honour scroll-behavior in CSS,
  // but this catches older WebKit edge cases and lets us focus the target for a11y)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move keyboard focus to the target for screen-reader accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
