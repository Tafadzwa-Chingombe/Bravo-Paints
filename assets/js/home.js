/* Home page: hero mood picker, surface tabs, featured products */
(function () {
  "use strict";
  const { $, $$ } = BRAVO;

  /* ---------- Hero mood picker ---------- */
  const panel = $("#hero-panel");
  $$(".swatch-dot").forEach((dot) =>
    dot.addEventListener("click", () => {
      $$(".swatch-dot").forEach((d) => d.setAttribute("aria-pressed", String(d === dot)));
      panel.style.setProperty("--hero-bg", dot.dataset.bg);
      panel.style.setProperty("--script", dot.dataset.script);
    })
  );

  /* ---------- Surface tabs (WAI-ARIA tabs pattern) ---------- */
  const tabs = $$('[role="tab"]');
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute("aria-controls"));
      p.hidden = !on;
      if (on) {
        p.classList.remove("fade-in");
        void p.offsetWidth; // restart animation
        p.classList.add("fade-in");
      }
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in map) {
        e.preventDefault();
        select(tabs[(i + map[e.key] + tabs.length) % tabs.length], true);
      } else if (e.key === "Home") select(tabs[0], true);
      else if (e.key === "End") select(tabs[tabs.length - 1], true);
    });
  });

  /* ---------- Featured products ---------- */
  const grid = $("#home-products");
  if (grid) {
    grid.innerHTML = BRAVO.products.map((p) => BRAVO.productCard(p)).join("");
    BRAVO.observeReveal(grid);
  }
})();
