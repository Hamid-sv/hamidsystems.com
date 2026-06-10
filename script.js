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

  document.querySelectorAll("[data-copy-value]").forEach(function (button) {
    const label = button.getAttribute("data-copy-label") || "Copy";
    button.addEventListener("click", async function () {
      const value = button.getAttribute("data-copy-value") || "";
      const span = button.querySelector("span");
      try {
        await navigator.clipboard.writeText(value);
        if (span) span.textContent = "Copied";
        window.setTimeout(function () {
          if (span) span.textContent = label;
        }, 1300);
      } catch (_error) {
        window.location.href = value.startsWith("http") ? value : "mailto:" + value;
      }
    });
  });

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
})();
