// Mobile menu, active nav link, scroll reveal and footer year.
(function () {
  document.documentElement.classList.add("js");

  var toggle = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  var revealEls = document.querySelectorAll(".reveal");
  var navAnchors = links.querySelectorAll("a");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { sectionObserver.observe(s); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Projects carousel: arrow buttons, dots and keyboard scrolling
  var track = document.getElementById("project-track");
  if (track) {
    var prev = document.getElementById("proj-prev");
    var next = document.getElementById("proj-next");
    var dotsWrap = document.getElementById("project-dots");
    var cards = track.querySelectorAll(".project-card");

    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    cards.forEach(function (card, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.tabIndex = -1;
      dot.addEventListener("click", function () {
        track.scrollTo({ left: i * step() });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      var idx = Math.round(track.scrollLeft / step());
      if (track.scrollLeft >= max - 2) idx = cards.length - 1;
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }

    prev.addEventListener("click", function () { track.scrollBy({ left: -step() }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step() }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step() }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step() }); }
    });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
