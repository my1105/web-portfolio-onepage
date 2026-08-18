(() => {
  const SITE = {
    lineUrl: "./line.html",
    instagramUrl: "https://www.instagram.com/maison.innercare/",
    email: "hello@maison.jp",
    couponCode: "MAISON10",
  };

  const ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.7 10.2c0-4-4.3-7.2-9.5-7.2S.7 6.2.7 10.2c0 3.6 3.2 6.6 7.5 7.2.3 0 .7.2.8.5l.5 1.8c0 .2.3.3.4.2 1.8-1 3.3-2.1 4.6-3.4 3.6-.8 5.2-3.2 5.2-6.3z"/></svg>';

  const page = document.body.dataset.page || "home";

  document.querySelectorAll("[data-line]").forEach((el) => {
    el.setAttribute("href", SITE.lineUrl);
  });
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.setAttribute("href", SITE.instagramUrl);
    el.setAttribute("rel", "noopener noreferrer");
    el.setAttribute("target", "_blank");
  });
  document.querySelectorAll("[data-mail]").forEach((el) => {
    el.setAttribute("href", "mailto:" + SITE.email);
  });
  document.querySelectorAll(".header__line").forEach((el) => {
    if (!el.querySelector("svg")) el.insertAdjacentHTML("afterbegin", ICON);
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    const current = el.getAttribute("data-nav") === page;
    el.classList.toggle("is-current", current);
    if (current) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });

  const headerEl = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const setNavOpen = (open) => {
    if (!headerEl) return;
    headerEl.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", open ? "true" : "false");
    toggle?.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.classList.toggle("is-nav-open", open);
  };
  toggle?.addEventListener("click", () => {
    setNavOpen(!headerEl.classList.contains("is-open"));
  });
  document.querySelectorAll("#site-nav a").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) setNavOpen(false);
  });

  const onScroll = () => headerEl?.classList.toggle("is-scrolled", window.scrollY > 16);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || SITE.couponCode;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const input = document.createElement("input");
        input.value = value;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      btn.textContent = "コピーしました";
      btn.setAttribute("aria-live", "polite");
      window.setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  const contactThanks = document.querySelector("[data-contact-thanks]");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;
    contactForm.hidden = true;
    if (contactThanks) {
      contactThanks.hidden = false;
      contactThanks.focus?.();
      contactThanks.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const lineIntro = document.querySelector("[data-line-intro]");
  const lineGift = document.querySelector("[data-line-gift]");
  const showGift = () => {
    if (!lineGift) return;
    if (lineIntro) lineIntro.hidden = true;
    lineGift.hidden = false;
    lineGift.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  document.querySelector("[data-line-add]")?.addEventListener("click", showGift);
  if (lineGift && /gift|added/.test(location.hash)) showGift();
})();
