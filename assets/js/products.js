/* Products page: surface filter + search (state mirrored in the URL) */
(function () {
  "use strict";
  const { $, $$ } = BRAVO;

  const grid = $("#product-grid");
  const empty = $("#product-empty");
  const count = $("#product-count");
  const search = $("#product-search");
  const params = new URLSearchParams(location.search);
  let surface = params.get("surface") || "all";

  const matchesSurface = (p) =>
    surface === "all" || p.surfaces.includes(surface) || (surface === "metal" && p.surfaces.includes("wood"));

  const render = () => {
    const term = search.value.trim().toLowerCase();
    const list = BRAVO.products.filter(
      (p) => matchesSurface(p) && (!term || [p.name, p.type, p.tagline, p.finish].join(" ").toLowerCase().includes(term))
    );
    grid.innerHTML = list.map((p) => BRAVO.productCard(p, { chips: true })).join("");
    empty.hidden = list.length > 0;
    count.textContent = `Showing ${list.length} of ${BRAVO.products.length} products`;
    BRAVO.observeReveal(grid);

    $$("#surface-filter .pill").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.surface === surface)));
    const url = new URL(location.href);
    surface === "all" ? url.searchParams.delete("surface") : url.searchParams.set("surface", surface);
    history.replaceState(null, "", url);
  };

  $$("#surface-filter .pill").forEach((b) =>
    b.addEventListener("click", () => {
      surface = b.dataset.surface;
      render();
    })
  );
  search.addEventListener("input", render);
  render();

  const open = params.get("product");
  if (open) BRAVO.openProduct(open);
})();
