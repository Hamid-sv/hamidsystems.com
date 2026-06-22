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

  function initHeroDepthScene() {
    const hero = document.querySelector(".hero-home");
    const media = document.querySelector("[data-hero-media]");
    const content = document.querySelector("[data-hero-content]");
    const canvas = document.querySelector("[data-hero-scene]");

    if (!hero || !media || !content || !canvas) return;
    if (new URLSearchParams(window.location.search).get("scene") === "off") {
      canvas.hidden = true;
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0, scroll: 0 };
    let scrollTarget = 0;
    let sceneActive = true;
    let renderer;
    let scene;
    let camera;
    let workflow;
    let frameId;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function updateScrollTarget() {
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight, window.innerHeight);
      scrollTarget = clamp(-rect.top / travel, 0, 1);
    }

    function updatePointer(event) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      pointer.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointer.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    }

    function resetPointer() {
      pointer.x = 0;
      pointer.y = 0;
    }

    function createPanel(THREE, width, height, position, rotation, color, opacity) {
      const panelGroup = new THREE.Group();
      const geometry = new THREE.BoxGeometry(width, height, 0.07);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        depthWrite: false
      });
      const panel = new THREE.Mesh(geometry, material);
      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.min(opacity * 4.2, 0.78)
      });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

      panelGroup.add(panel, edges);
      panelGroup.position.set(position[0], position[1], position[2]);
      panelGroup.rotation.set(rotation[0], rotation[1], rotation[2]);

      for (let row = 0; row < 3; row += 1) {
        const barWidth = width * (0.42 + row * 0.13);
        const barGeometry = new THREE.BoxGeometry(barWidth, 0.025, 0.025);
        const barMaterial = new THREE.MeshBasicMaterial({
          color: row === 0 ? 0xe2b45c : color,
          transparent: true,
          opacity: 0.68,
          depthWrite: false
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.set(-width * 0.13, height * 0.2 - row * height * 0.2, 0.06);
        panelGroup.add(bar);
      }

      return panelGroup;
    }

    function buildScene() {
      const THREE = window.THREE;
      if (!THREE) return false;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: window.innerWidth > 700,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.2 : 1.5));

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 8);

      workflow = new THREE.Group();
      const teal = 0x4ac5bd;
      const blue = 0x6f9fc9;
      const panelData = [
        [1.55, 0.96, [-0.9, 1.25, 0.1], [-0.05, 0.18, -0.08], teal, 0.11],
        [1.9, 1.14, [1.05, 1.05, -0.9], [0.08, -0.22, 0.06], blue, 0.1],
        [1.7, 1.02, [0.55, -0.1, 0.65], [-0.08, -0.14, -0.04], teal, 0.14],
        [1.45, 0.88, [2.15, -0.55, -0.4], [0.04, -0.28, 0.08], blue, 0.11],
        [1.6, 0.96, [-0.8, -1.25, -0.65], [0.1, 0.2, -0.06], teal, 0.09],
        [1.3, 0.8, [1.45, -1.45, 0.45], [-0.06, -0.12, 0.04], teal, 0.12]
      ];
      const points = [];

      panelData.forEach(function (item) {
        const panel = createPanel(THREE, item[0], item[1], item[2], item[3], item[4], item[5]);
        workflow.add(panel);
        points.push(new THREE.Vector3(item[2][0], item[2][1], item[2][2]));
      });

      const linePositions = [];
      const links = [[0, 2], [1, 2], [2, 3], [2, 4], [2, 5], [3, 5]];
      links.forEach(function (link) {
        linePositions.push(points[link[0]], points[link[1]]);
      });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePositions);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: teal,
        transparent: true,
        opacity: 0.42
      });
      workflow.add(new THREE.LineSegments(lineGeometry, lineMaterial));

      points.forEach(function (point, index) {
        const nodeGeometry = new THREE.BoxGeometry(0.11, 0.11, 0.11);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0xe2b45c : teal,
          transparent: true,
          opacity: 0.9
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(point);
        workflow.add(node);
      });

      workflow.position.set(window.innerWidth < 700 ? 1.4 : 2.25, -0.1, -0.3);
      workflow.rotation.set(-0.12, -0.18, 0);
      scene.add(workflow);
      resizeScene();
      return true;
    }

    function resizeScene() {
      if (!renderer || !camera) return;
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      if (workflow) {
        workflow.position.x = window.innerWidth < 700 ? 1.4 : 2.25;
        workflow.scale.setScalar(window.innerWidth < 700 ? 0.82 : 1);
      }
    }

    function renderFrame(time) {
      frameId = null;
      const easing = reducedMotion.matches ? 1 : 0.075;
      current.x += (pointer.x - current.x) * easing;
      current.y += (pointer.y - current.y) * easing;
      current.scroll += (scrollTarget - current.scroll) * easing;

      if (!reducedMotion.matches) {
        media.style.transform =
          "translate3d(" + (-current.x * 9) + "px, " + (current.scroll * 76 - current.y * 7) + "px, 0) scale(" +
          (1.08 + current.scroll * 0.07) + ")";
        content.style.transform =
          "translate3d(" + (current.x * 5) + "px, " + (-current.scroll * 30 + current.y * 4) + "px, 0)";
      }

      if (renderer && scene && camera && workflow && sceneActive) {
        const idle = reducedMotion.matches ? 0 : Math.sin(time * 0.00035) * 0.025;
        workflow.rotation.x = -0.12 - current.y * 0.06 + current.scroll * 0.16;
        workflow.rotation.y = -0.18 + current.x * 0.1 + current.scroll * 0.45;
        workflow.position.y = -0.1 + current.scroll * 0.72 + idle;
        workflow.position.z = -0.3 + current.scroll * 0.85;
        camera.position.x = current.x * 0.28;
        camera.position.y = -current.y * 0.2;
        camera.lookAt(0.9, 0, 0);
        renderer.render(scene, camera);
      }

      if (!reducedMotion.matches && (sceneActive || !renderer)) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    }

    let hasScene = false;
    try {
      hasScene = buildScene();
    } catch (_error) {
      canvas.hidden = true;
    }
    updateScrollTarget();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        sceneActive = entries[0]?.isIntersecting ?? true;
        if (sceneActive && !frameId) {
          frameId = window.requestAnimationFrame(renderFrame);
        }
      });
      observer.observe(hero);
    }

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("resize", resizeScene);

    if (reducedMotion.matches) {
      media.style.transform = "none";
      content.style.transform = "none";
    }

    if (hasScene || !reducedMotion.matches) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
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

  document.querySelector("[data-audit-form]")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = Array.from(formData.entries())
      .map(function ([key, value]) {
        return key + ": " + value;
      })
      .join("\n");
    const subject = "Free Lead Audit Request";
    const href = "mailto:hamidsamadivaghefi@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    const status = form.querySelector("[data-form-status]");

    if (status) {
      status.textContent = "Opening your email app with the audit details filled in.";
    }
    window.location.href = href;
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
  initHeroDepthScene();
})();
