/* ==========================================================================
   Bravo Paints — shared behaviour for every page
   ========================================================================== */

(function () {
  "use strict";

  const BRAVO = (window.BRAVO = window.BRAVO || {});
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  BRAVO.$ = $;
  BRAVO.$$ = $$;

  document.documentElement.classList.remove("no-js");

  BRAVO.icons = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
  };

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  BRAVO.escapeHTML = escapeHTML;

  /* ---------- Header: scrolled state + mobile nav ---------- */
  const header = $(".site-header");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 24);
    toTop && toTop.classList.toggle("is-visible", y > 800);
  };

  const toggle = $(".nav-toggle");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle && toggle.setAttribute("aria-expanded", String(open));
  };
  if (toggle) {
    toggle.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
    $$(".nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));
    window.addEventListener("resize", () => window.innerWidth > 1080 && setNav(false));
  }

  /* ---------- Back to top ---------- */
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = BRAVO.icons.arrow;
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(toTop);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  BRAVO.observeReveal = (root = document) => {
    const els = $$(".reveal:not(.is-visible)", root);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
  };
  BRAVO.observeReveal();

  /* ---------- Toast ---------- */
  let toastEl, toastTimer;
  BRAVO.toast = (msg) => {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2800);
  };

  /* ---------- Modal ---------- */
  let modalEl, lastFocus;
  let openToken = 0;
  const closeModal = () => {
    if (!modalEl) return;
    openToken++;
    modalEl.classList.remove("is-open");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
    const token = openToken;
    setTimeout(() => token === openToken && (modalEl.innerHTML = ""), 300);
  };
  BRAVO.closeModal = closeModal;

  BRAVO.openModal = (html, { className = "", label = "Dialog" } = {}) => {
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.className = "modal";
      document.body.appendChild(modalEl);
      modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl || e.target.closest("[data-close]")) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (!modalEl.classList.contains("is-open")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "Tab") {
          const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modalEl).filter((el) => !el.disabled);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
    const wasOpen = modalEl.classList.contains("is-open");
    const token = ++openToken;
    if (!wasOpen) lastFocus = document.activeElement;
    modalEl.className = "modal " + className + (wasOpen ? " is-open" : "");
    modalEl.innerHTML = `<div class="modal__dialog" role="dialog" aria-modal="true" aria-label="${escapeHTML(label)}">
      <button class="modal__close" type="button" data-close aria-label="Close">${BRAVO.icons.close}</button>${html}</div>`;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      if (token !== openToken) return; // closed or replaced before this frame
      modalEl.classList.add("is-open");
      $(".modal__close", modalEl).focus();
    });
    return modalEl;
  };

  /* ---------- Product detail modal (used on several pages) ---------- */
  BRAVO.openProduct = (id) => {
    const p = (BRAVO.products || []).find((x) => x.id === id);
    if (!p) return;
    const surfaces = p.surfaces.map((s) => `<span class="chip">${BRAVO.surfaces[s]}</span>`).join("");
    BRAVO.openModal(
      `<div class="product-modal">
        <div class="product-modal__media"><img src="${p.image}" alt="${escapeHTML(p.name)} paint tin"></div>
        <div class="product-modal__body">
          <span class="eyebrow">${escapeHTML(p.type)}</span>
          <h2>${escapeHTML(p.name)}</h2>
          <p class="type">${escapeHTML(p.tagline)}</p>
          <div class="product-card__chips">${surfaces}</div>
          <p class="desc">${escapeHTML(p.description)}</p>
          <ul class="spec-list">
            <li><small>Finish</small><strong>${p.finish}</strong></li>
            <li><small>Coverage</small><strong>~${p.coverage} m²/L per coat</strong></li>
            <li><small>Touch dry</small><strong>${p.touchDry}</strong></li>
            <li><small>Recoat</small><strong>${p.recoat}</strong></li>
            <li><small>Pack sizes</small><strong>${p.sizes.map((s) => s + "L").join(" · ")}</strong></li>
            <li><small>Base</small><strong>${p.id === "metal-guard" ? "Solvent-based" : "Water-based"}</strong></li>
          </ul>
          <ul class="check-list">${p.benefits.map((b) => `<li>${escapeHTML(b)}</li>`).join("")}</ul>
          <div class="product-modal__actions">
            <a class="btn btn--royal btn--sm" href="calculator.html?product=${p.id}">Calculate how much ${BRAVO.icons.arrow}</a>
            <a class="btn btn--outline btn--sm" href="colours.html">Browse colours</a>
          </div>
        </div>
      </div>`,
      { label: p.name }
    );
  };

  BRAVO.productCard = (p, { chips = false } = {}) => `
    <article class="product-card reveal">
      ${p.badge ? `<span class="product-card__badge">${escapeHTML(p.badge)}</span>` : ""}
      <div class="product-card__media"><img src="${p.image}" alt="${escapeHTML(p.name)} paint tin" loading="lazy"></div>
      <h3 class="product-card__name">${escapeHTML(p.name)}</h3>
      <p class="product-card__type">${escapeHTML(p.type)}</p>
      <p class="product-card__feat">${escapeHTML(p.tagline)}</p>
      ${chips ? `<div class="product-card__chips">${p.surfaces.map((s) => `<span class="chip">${BRAVO.surfaces[s]}</span>`).join("")}</div>` : ""}
      <button class="link-arrow" type="button" data-product="${p.id}">Learn more ${BRAVO.icons.arrow}<span class="visually-hidden"> about ${escapeHTML(p.name)}</span></button>
    </article>`;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-product]");
    if (trigger) {
      e.preventDefault();
      BRAVO.openProduct(trigger.dataset.product);
    }
  });

  /* ---------- Lightbox ---------- */
  const lightboxItems = $$("[data-lightbox]");
  if (lightboxItems.length) {
    let index = 0;
    const render = () => {
      const item = lightboxItems[index];
      const img = $("img", item);
      const caption = item.dataset.caption || img.alt;
      BRAVO.openModal(
        `<img src="${img.getAttribute("src")}" alt="${escapeHTML(img.alt)}">
         <p class="lightbox__caption">${escapeHTML(caption)} · ${index + 1} / ${lightboxItems.length}</p>
         <button class="lightbox__nav lightbox__nav--prev" type="button" data-step="-1" aria-label="Previous image">${BRAVO.icons.arrow}</button>
         <button class="lightbox__nav lightbox__nav--next" type="button" data-step="1" aria-label="Next image">${BRAVO.icons.arrow}</button>`,
        { className: "lightbox", label: "Image viewer" }
      );
    };
    const step = (d) => {
      index = (index + d + lightboxItems.length) % lightboxItems.length;
      render();
    };
    lightboxItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        index = i;
        render();
      })
    );
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-step]");
      if (btn) step(Number(btn.dataset.step));
    });
    document.addEventListener("keydown", (e) => {
      const open = $(".modal.lightbox.is-open");
      if (!open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------- Validation helpers ---------- */
  BRAVO.isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

  /* ---------- Newsletter ---------- */
  $$(".newsletter").forEach((form) => {
    const note = form.parentElement.querySelector(".newsletter-note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", form);
      note.classList.remove("is-error", "is-success");
      if (!BRAVO.isEmail(input.value)) {
        note.textContent = "Please enter a valid email address.";
        note.classList.add("is-error");
        input.focus();
        return;
      }
      // TODO: connect to your email provider (Mailchimp, Brevo, Formspree…)
      note.textContent = "Thanks for subscribing! Look out for colour inspiration in your inbox.";
      note.classList.add("is-success");
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
