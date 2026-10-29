/* Colour catalogue: filters, search, sort, favourites, detail modal, room visualiser */
(function () {
  "use strict";
  const { $, $$, escapeHTML, icons } = BRAVO;
  const colours = BRAVO.colours;
  const families = BRAVO.families;
  const byId = Object.fromEntries(colours.map((c) => [c.id, c]));
  const familyName = Object.fromEntries(families.map((f) => [f.id, f.name]));

  /* ---------- Colour maths ---------- */
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (hex) => {
    const [r, g, b] = rgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const shade = (hex, amt) =>
    "#" + rgb(hex).map((v) => Math.max(0, Math.min(255, Math.round(v * (1 + amt)))).toString(16).padStart(2, "0")).join("");

  /* ---------- Favourites (per-browser convenience) ---------- */
  const KEY = "bravo:favourites";
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { favs = []; }
  const saveFavs = () => { try { localStorage.setItem(KEY, JSON.stringify(favs)); } catch (e) { /* storage unavailable */ } };
  const isFav = (id) => favs.includes(id);
  const toggleFav = (id) => {
    favs = isFav(id) ? favs.filter((f) => f !== id) : [...favs, id];
    saveFavs();
    BRAVO.toast(isFav(id) ? `${byId[id].name} saved to favourites` : `${byId[id].name} removed from favourites`);
    $$(`[data-fav="${id}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", String(isFav(id)));
      if (b.classList.contains("btn")) b.innerHTML = `${isFav(id) ? "Saved" : "Save"} &#9829;`;
    });
    updateTray();
    if (state.favOnly) render();
  };

  /* ---------- State ---------- */
  const params = new URLSearchParams(location.search);
  const state = {
    family: families.some((f) => f.id === params.get("family")) ? params.get("family") : "all",
    term: "",
    sort: "family",
    favOnly: false,
  };

  /* ---------- Hero mosaic ---------- */
  const featured = ["terracotta-warmth", "sunset-coral", "sunshine-days", "golden-hour", "sage-serenity", "forest-canopy", "ocean-breeze", "sky-splash", "purple-haze", "lavender-mist", "bravo-navy", "teal-lagoon", "warm-sand", "linen-whisper", "slate", "royal-cobalt"];
  $("#hero-mosaic").innerHTML = featured
    .map((id) => `<button type="button" style="--c:${byId[id].hex}" data-open="${id}" aria-label="${escapeHTML(byId[id].name)}" title="${escapeHTML(byId[id].name)}"></button>`)
    .join("");
  $("#stat-colours").textContent = colours.length;
  $("#stat-families").textContent = families.length;

  /* ---------- Family pills ---------- */
  const pills = $("#family-pills");
  pills.innerHTML =
    `<button class="pill" type="button" data-family="all">All colours<span class="count">${colours.length}</span></button>` +
    families
      .map((f) => `<button class="pill" type="button" data-family="${f.id}" style="--c:${f.swatch}"><i></i>${f.name}<span class="count">${colours.filter((c) => c.family === f.id).length}</span></button>`)
      .join("");
  pills.addEventListener("click", (e) => {
    const b = e.target.closest("[data-family]");
    if (!b) return;
    state.family = b.dataset.family;
    render();
    const url = new URL(location.href);
    state.family === "all" ? url.searchParams.delete("family") : url.searchParams.set("family", state.family);
    history.replaceState(null, "", url);
  });

  /* ---------- Grid ---------- */
  const grid = $("#swatch-grid");
  const card = (c) => `
    <article class="swatch-card">
      <button class="swatch-card__open" type="button" data-open="${c.id}">
        <div class="swatch-card__chip" style="--c:${c.hex}"></div>
        <div class="swatch-card__body"><div class="swatch-card__name">${escapeHTML(c.name)}</div><div class="swatch-card__code">${c.code} · ${c.hex}</div></div>
      </button>
      <button class="fav-btn" type="button" data-fav="${c.id}" aria-pressed="${isFav(c.id)}" aria-label="Save ${escapeHTML(c.name)} to favourites">${icons.heart}</button>
    </article>`;

  const render = () => {
    const term = state.term.toLowerCase();
    let list = colours.filter(
      (c) =>
        (state.family === "all" || c.family === state.family) &&
        (!state.favOnly || isFav(c.id)) &&
        (!term || c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term) || c.hex.includes(term))
    );
    if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "light") list = [...list].sort((a, b) => luminance(b.hex) - luminance(a.hex));
    if (state.sort === "dark") list = [...list].sort((a, b) => luminance(a.hex) - luminance(b.hex));

    grid.innerHTML = list.map(card).join("");
    $("#colour-empty").hidden = list.length > 0;
    $("#colour-count").textContent = `${list.length} colour${list.length === 1 ? "" : "s"}`;
    $$("[data-family]", pills).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.family === state.family)));
  };

  $("#colour-search").addEventListener("input", (e) => { state.term = e.target.value.trim(); render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#fav-toggle").addEventListener("click", (e) => {
    state.favOnly = !state.favOnly;
    e.currentTarget.setAttribute("aria-pressed", String(state.favOnly));
    render();
  });

  /* ---------- Delegated clicks ---------- */
  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (fav) return toggleFav(fav.dataset.fav);
    const open = e.target.closest("[data-open]");
    if (open) return openColour(open.dataset.open);
    const copy = e.target.closest("[data-copy]");
    if (copy) {
      const text = copy.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => BRAVO.toast(`Copied ${text}`))
        .catch(() => BRAVO.toast(text));
      return;
    }
    const preview = e.target.closest("[data-preview]");
    if (preview) {
      BRAVO.closeModal();
      paintRoom(preview.dataset.preview);
      $("#visualiser").scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ---------- Colour detail modal ---------- */
  const pairingsFor = (c) => {
    const same = colours.filter((x) => x.family === c.family && x.id !== c.id);
    const neutral = colours.find((x) => x.family === "neutrals" && x.id !== c.id && Math.abs(luminance(x.hex) - 0.75) < 0.2) || byId["linen-whisper"];
    const contrast = colours
      .filter((x) => x.family !== c.family && x.family !== "neutrals")
      .sort((a, b) => Math.abs(luminance(b.hex) - luminance(c.hex)) - Math.abs(luminance(a.hex) - luminance(c.hex)))[0];
    return [same[0], neutral, contrast].filter(Boolean);
  };

  const openColour = (id) => {
    const c = byId[id];
    if (!c) return;
    const [r, g, b] = rgb(c.hex);
    const pairs = pairingsFor(c);
    BRAVO.openModal(
      `<div class="colour-modal">
        <div class="colour-modal__chip" style="--c:${c.hex}"></div>
        <div class="colour-modal__body">
          <span class="eyebrow">${familyName[c.family]}</span>
          <h2>${escapeHTML(c.name)}</h2>
          <div class="colour-modal__codes">
            <button class="copy-btn" type="button" data-copy="${c.code}">${icons.copy}${c.code}</button>
            <button class="copy-btn" type="button" data-copy="${c.hex.toUpperCase()}">${icons.copy}${c.hex.toUpperCase()}</button>
            <button class="copy-btn" type="button" data-copy="rgb(${r}, ${g}, ${b})">${icons.copy}RGB ${r} ${g} ${b}</button>
          </div>
          <h3>Pairs beautifully with</h3>
          <div class="pairings">${pairs.map((p) => `<button type="button" style="--c:${p.hex}" data-open="${p.id}" title="${escapeHTML(p.name)}" aria-label="Open ${escapeHTML(p.name)}"></button>`).join("")}</div>
          <div class="product-modal__actions">
            <button class="btn btn--royal btn--sm" type="button" data-preview="${c.id}">Preview in room ${icons.arrow}</button>
            <button class="btn btn--outline btn--sm" type="button" data-fav="${c.id}" aria-pressed="${isFav(c.id)}">${isFav(c.id) ? "Saved" : "Save"} &#9829;</button>
          </div>
        </div>
      </div>`,
      { label: c.name }
    );
  };

  /* ---------- Room visualiser ---------- */
  let walls = "all";
  let current = "sky-splash";
  const mini = $("#mini-swatches");
  const miniIds = ["sky-splash", "sage-serenity", "terracotta-warmth", "sunshine-days", "purple-haze", "ocean-breeze", "linen-whisper", "forest-canopy", "peach-blossom", "teal-lagoon", "mustard-seed", "lavender-mist", "warm-sand", "bravo-navy", "slate", "mint-breeze"];
  mini.innerHTML = miniIds.map((id) => `<button type="button" style="--c:${byId[id].hex}" data-paint="${id}" aria-label="${escapeHTML(byId[id].name)}" title="${escapeHTML(byId[id].name)}"></button>`).join("");
  mini.addEventListener("click", (e) => {
    const b = e.target.closest("[data-paint]");
    if (b) paintRoom(b.dataset.paint);
  });

  const neutralWall = "#efe9df";
  const paintRoom = (id) => {
    const c = byId[id];
    if (!c) return;
    current = id;
    $$(".room-svg .wall--main").forEach((w) => w.setAttribute("fill", c.hex));
    $$(".room-svg .wall--side").forEach((w) => w.setAttribute("fill", walls === "all" ? shade(c.hex, -0.18) : shade(neutralWall, -0.08)));
    const cur = $("#current-colour");
    cur.style.setProperty("--c", c.hex);
    $("strong", cur).textContent = c.name;
    $("span", cur).textContent = `${c.code} · ${c.hex.toUpperCase()}`;
    $$("[data-paint]", mini).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.paint === id)));
  };

  $$("[data-walls]").forEach((b) =>
    b.addEventListener("click", () => {
      walls = b.dataset.walls;
      $$("[data-walls]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      paintRoom(current);
    })
  );

  /* ---------- Favourites tray ---------- */
  const tray = $("#palette-tray");
  const updateTray = () => {
    $("#stat-favs").textContent = favs.length;
    $("#tray-label").textContent = `${favs.length} saved`;
    $("#tray-chips").innerHTML = favs.slice(-8).map((id) => `<i style="--c:${byId[id] ? byId[id].hex : "#ccc"}" title="${byId[id] ? escapeHTML(byId[id].name) : ""}"></i>`).join("");
    tray.classList.toggle("is-visible", favs.length > 0);
  };
  $("#tray-view").addEventListener("click", () => {
    state.favOnly = true;
    $("#fav-toggle").setAttribute("aria-pressed", "true");
    render();
    $("#swatch-grid").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  render();
  paintRoom(current);
  updateTray();
})();
