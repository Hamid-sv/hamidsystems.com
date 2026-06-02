(function () {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.getElementById("theme-toggle");
  const copyEmail = document.getElementById("copy-email");
  const email = "hello@hamidsystems.com";

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

  copyEmail?.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(email);
      copyEmail.querySelector("span").textContent = "Copied";
      window.setTimeout(function () {
        copyEmail.querySelector("span").textContent = "Copy Email";
      }, 1300);
    } catch (_error) {
      window.location.href = "mailto:" + email;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  window.addEventListener("scroll", handleHeaderShadow, { passive: true });
  window.addEventListener("load", renderIcons);
  handleHeaderShadow();
})();
