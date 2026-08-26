(function () {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function setTheme(nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("hamid-systems-theme", nextTheme);
    if (themeToggle) {
      themeToggle.innerHTML = nextTheme === "dark" ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
      themeToggle.setAttribute("aria-label", nextTheme === "dark" ? "Use light theme" : "Use dark theme");
      themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
      renderIcons();
    }
  }

  function setMenu(open) {
    if (!menuToggle || !primaryNav) return;
    primaryNav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    renderIcons();
  }

  function handleHeaderShadow() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function updateHomepageNavState() {
    if (!primaryNav || window.location.pathname !== "/") return;

    const homeLink = primaryNav.querySelector('a[href="/"]');
    const skillsLink = primaryNav.querySelector('a[href="/#skills"]');
    const skillsActive = window.location.hash === "#skills";

    if (skillsActive) {
      homeLink?.removeAttribute("aria-current");
      skillsLink?.setAttribute("aria-current", "page");
    } else {
      skillsLink?.removeAttribute("aria-current");
      homeLink?.setAttribute("aria-current", "page");
    }
  }

  function initHeroImageMotion() {
    const hero = document.querySelector(".hero-home");
    const media = document.querySelector("[data-hero-media]");
    if (!hero || !media) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;

    function render() {
      frameId = null;
      if (reducedMotion.matches) {
        media.style.transform = "none";
        return;
      }

      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(hero.offsetHeight, 1), 0), 1);
      media.style.transform = "translate3d(0, " + (progress * 34) + "px, 0) scale(" + (1.045 + progress * 0.025) + ")";
    }

    function scheduleRender() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    }

    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    reducedMotion.addEventListener?.("change", scheduleRender);
    render();
  }

  async function copyToClipboard(value) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(value),
          new Promise(function (_resolve, reject) {
            window.setTimeout(function () {
              reject(new Error("Clipboard request timed out"));
            }, 700);
          })
        ]);
        return true;
      } catch (_error) {
        // Fall through to the selection-based copy method.
      }
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }

  const savedTheme = localStorage.getItem("hamid-systems-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", function () {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  menuToggle?.addEventListener("click", function () {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  primaryNav?.addEventListener("click", function (event) {
    if (event.target instanceof HTMLAnchorElement) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("hashchange", updateHomepageNavState);

  document.querySelectorAll("[data-copy-value]").forEach(function (button) {
    const label = button.getAttribute("data-copy-label") || "Copy";
    button.addEventListener("click", async function () {
      const value = button.getAttribute("data-copy-value") || "";
      const span = button.querySelector("span");
      const status = button.parentElement?.querySelector("[data-copy-status]");
      try {
        if (span) span.textContent = "Copying";
        if (status) status.textContent = "Copying email address.";
        const copied = await copyToClipboard(value);
        if (!copied) throw new Error("Copy was not available");
        if (span) span.textContent = "Copied";
        if (status) status.textContent = "Email address copied to clipboard.";
        window.setTimeout(function () {
          if (span) span.textContent = label;
          if (status) status.textContent = "";
        }, 1300);
      } catch (_error) {
        if (span) span.textContent = label;
        if (status) status.textContent = "Copy was unavailable. Select the email address shown above.";
      }
    });
  });

  const projectFilters = document.querySelector("[data-project-filters]");
  if (projectFilters) {
    const filterButtons = Array.from(projectFilters.querySelectorAll("[data-project-filter]"));
    const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
    const filterStatus = document.querySelector("[data-filter-status]");

    projectFilters.addEventListener("click", function (event) {
      const button = event.target.closest("[data-project-filter]");
      if (!(button instanceof HTMLButtonElement)) return;

      const filter = button.dataset.projectFilter || "all";
      filterButtons.forEach(function (item) {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      let visibleCount = 0;
      projectCards.forEach(function (card) {
        const categories = (card.getAttribute("data-categories") || "").split(/\s+/);
        const visible = filter === "all" || categories.includes(filter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (filterStatus) {
        const labelText = button.textContent?.trim() || "selected";
        filterStatus.textContent = filter === "all"
          ? "Showing all " + visibleCount + " projects"
          : "Showing " + visibleCount + " " + labelText + " projects";
      }
    });
  }

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("scroll", handleHeaderShadow, { passive: true });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      setMenu(false);
    }
  });
  window.addEventListener("load", renderIcons);
  handleHeaderShadow();
  updateHomepageNavState();
  initHeroImageMotion();
})();
