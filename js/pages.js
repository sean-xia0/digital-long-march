(() => {
  "use strict";
  const progress = document.getElementById("scrollProgress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, amount))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    const setMenuOpen = open => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    };
    toggle.addEventListener("click", () => setMenuOpen(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenuOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
    });
  }

  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => item.classList.add("is-visible"));
  }
})();