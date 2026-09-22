(() => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const nav = document.querySelector("[data-nav]");
  const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = document.querySelector("[data-menu-btn]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const closeMenu = () => {
    menuBtn?.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
    if (mobileNav) mobileNav.hidden = true;
  };

  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.classList.toggle("is-open", !open);
    menuBtn.setAttribute("aria-expanded", String(!open));
    if (mobileNav) mobileNav.hidden = open;
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".section .reveal, .hero__stats .reveal").forEach((el) => io.observe(el));

  const form = document.querySelector("[data-form]");
  const status = document.querySelector("[data-form-status]");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const note = `Hi Mahan — ${name} (${email})\n\n${message}`;
    try {
      await navigator.clipboard.writeText(note);
    } catch {
      /* clipboard may be blocked on file:// */
    }
    window.open("https://linkedin.com/in/mahan-alaeei", "_blank", "noopener");
    if (status) {
      status.hidden = false;
      status.textContent =
        "Thanks — your note is copied. LinkedIn is opening so you can paste it.";
    }
    form.reset();
  });

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".cover__video").forEach((video) => {
    if (reduceMotion) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    const play = () => video.play().catch(() => {});
    play();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else play();
    });
  });

  if (!finePointer || reduceMotion) return;

  document.body.classList.add("has-cursor");
  const cursor = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor__dot");
  const ring = document.querySelector(".cursor__ring");
  if (!cursor || !dot || !ring) return;

  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    },
    { passive: true }
  );

  const tick = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(tick);
  };
  tick();

  document.querySelectorAll("a, button, input, textarea").forEach((el) => {
    el.addEventListener("pointerenter", () => document.body.classList.add("is-hovering"));
    el.addEventListener("pointerleave", () => document.body.classList.remove("is-hovering"));
  });
})();
