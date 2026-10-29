/* FAQ page: accordion, live search with highlighting, topic filter */
(function () {
  "use strict";
  const { $, $$ } = BRAVO;

  const items = $$(".acc-item");
  const groups = $$(".faq-group");
  const empty = $("#faq-empty");
  const search = $("#faq-search");
  let filter = "all";

  /* ---------- Accordion ---------- */
  const setOpen = (item, open) => {
    item.classList.toggle("is-open", open);
    $(".acc-trigger", item).setAttribute("aria-expanded", String(open));
  };
  items.forEach((item, i) => {
    const trigger = $(".acc-trigger", item);
    const panel = $(".acc-panel", item);
    trigger.id = "faq-q" + i;
    panel.id = "faq-a" + i;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", trigger.id);
    trigger.setAttribute("aria-controls", panel.id);
    trigger.addEventListener("click", () => setOpen(item, !item.classList.contains("is-open")));
  });

  /* Keep original text so highlighting can be undone */
  items.forEach((item) => {
    const q = $(".acc-trigger", item).firstChild;
    item._q = q;
    item._qText = q.textContent;
    item._a = $(".acc-panel", item).textContent.toLowerCase();
  });

  const highlight = (item, term) => {
    const text = item._qText;
    const span = document.createElement("span");
    if (!term) span.textContent = text;
    else {
      const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      span.innerHTML = BRAVO.escapeHTML(text).replace(re, "<mark>$1</mark>");
    }
    item._q.replaceWith(span);
    item._q = span;
  };

  const apply = () => {
    const term = search.value.trim().toLowerCase();
    let shown = 0;
    groups.forEach((g) => {
      const groupOk = filter === "all" || g.dataset.group === filter;
      let visible = 0;
      $$(".acc-item", g).forEach((item) => {
        const match = !term || item._qText.toLowerCase().includes(term) || item._a.includes(term);
        const show = groupOk && match;
        item.hidden = !show;
        highlight(item, term);
        if (show) visible++;
        if (term && show && item._a.includes(term)) setOpen(item, true);
      });
      g.hidden = !visible;
      shown += visible;
    });
    empty.hidden = shown > 0;
  };

  let t;
  search.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(apply, 120);
  });

  $$("[data-filter]").forEach((pill) =>
    pill.addEventListener("click", () => {
      filter = pill.dataset.filter;
      $$("[data-filter]").forEach((p) => p.setAttribute("aria-pressed", String(p === pill)));
      apply();
    })
  );
})();
