/* Paint calculator: multi-room area, coats, condition, product coverage → litres + tins */
(function () {
  "use strict";
  const { $, $$, escapeHTML } = BRAVO;

  const DOOR = 1.9; // m² per door
  const WINDOW = 1.5; // m² per window
  const WASTAGE = 1.1;

  const params = new URLSearchParams(location.search);
  const preset = BRAVO.products.find((p) => p.id === params.get("product"));

  const state = {
    surface: preset ? (preset.surfaces[0] === "wood" ? "metal" : preset.surfaces[0] === "roof" ? "exterior" : preset.surfaces[0]) : "interior",
    mode: "rooms",
    coats: 2,
    condition: 1,
    product: preset ? preset.id : null,
    rooms: [{ name: "Living room", length: 5, width: 4, height: 2.7, doors: 1, windows: 2 }],
  };

  const num = (v) => Math.max(0, parseFloat(v) || 0);
  const fmt = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString(undefined, { maximumFractionDigits: d });

  const roomArea = (r) => {
    if (state.surface === "ceiling") return num(r.length) * num(r.width);
    const walls = 2 * (num(r.length) + num(r.width)) * num(r.height);
    return Math.max(0, walls - num(r.doors) * DOOR - num(r.windows) * WINDOW);
  };

  /* ---------- Rooms UI ---------- */
  const roomsEl = $("#rooms");
  const field = (i, key, label, step = "0.1") =>
    `<div class="field"><label for="r${i}-${key}">${label}</label><input id="r${i}-${key}" type="number" min="0" step="${step}" inputmode="decimal" data-room="${i}" data-key="${key}" value="${state.rooms[i][key]}"></div>`;

  const renderRooms = () => {
    roomsEl.innerHTML = state.rooms
      .map(
        (r, i) => `
      <div class="room">
        <div class="room__head">
          <label class="visually-hidden" for="r${i}-name">Room name</label>
          <input class="room__name" id="r${i}-name" data-room="${i}" data-key="name" value="${escapeHTML(r.name)}">
          ${state.rooms.length > 1 ? `<button class="room__remove" type="button" data-remove="${i}">Remove</button>` : ""}
        </div>
        <div class="room__fields">
          ${field(i, "length", "Length (m)")}
          ${field(i, "width", "Width (m)")}
          ${field(i, "height", "Height (m)")}
          ${field(i, "doors", "Doors", "1")}
          ${field(i, "windows", "Windows", "1")}
        </div>
        <p class="room__area">Paintable area: <strong data-area="${i}">${fmt(roomArea(r))} m²</strong></p>
      </div>`
      )
      .join("");
    toggleCeilingFields();
  };

  const toggleCeilingFields = () => {
    const ceiling = state.surface === "ceiling";
    $$('[data-key="height"], [data-key="doors"], [data-key="windows"]', roomsEl).forEach((inp) => {
      inp.disabled = ceiling;
      inp.closest(".field").style.opacity = ceiling ? 0.4 : 1;
    });
  };

  roomsEl.addEventListener("input", (e) => {
    const t = e.target;
    if (!t.dataset.key) return;
    const i = Number(t.dataset.room);
    state.rooms[i][t.dataset.key] = t.dataset.key === "name" ? t.value : t.value;
    const out = $(`[data-area="${i}"]`, roomsEl);
    if (out) out.textContent = fmt(roomArea(state.rooms[i])) + " m²";
    calculate();
  });
  roomsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    state.rooms.splice(Number(b.dataset.remove), 1);
    renderRooms();
    calculate();
  });
  $("#add-room").addEventListener("click", () => {
    const names = ["Bedroom", "Kitchen", "Dining room", "Hallway", "Bathroom", "Study", "Guest room"];
    state.rooms.push({ name: names[(state.rooms.length - 1) % names.length], length: 4, width: 3.5, height: 2.7, doors: 1, windows: 1 });
    renderRooms();
    calculate();
    const inputs = $$(".room__name", roomsEl);
    inputs[inputs.length - 1].focus();
  });

  /* ---------- Radio groups ---------- */
  const radio = (groupSel, attr, onChange) => {
    const buttons = $$(`${groupSel} [data-${attr}]`);
    buttons.forEach((b, i) => {
      b.addEventListener("click", () => {
        buttons.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        onChange(b.dataset[attr]);
        calculate();
      });
      b.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        const next = buttons[(i + d + buttons.length) % buttons.length];
        next.focus();
        next.click();
      });
    });
    return buttons;
  };

  const surfaceButtons = radio("#surface-options", "surface", (v) => {
    state.surface = v;
    fillProducts();
    toggleCeilingFields();
    state.rooms.forEach((r, i) => {
      const out = $(`[data-area="${i}"]`, roomsEl);
      if (out) out.textContent = fmt(roomArea(r)) + " m²";
    });
  });
  surfaceButtons.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.surface === state.surface)));

  radio("#coat-options", "coats", (v) => (state.coats = Number(v)));
  radio("#condition-options", "condition", (v) => (state.condition = Number(v)));
  radio(".calc-step .segmented", "mode", (v) => {
    state.mode = v;
    $("#rooms-mode").hidden = v !== "rooms";
    $("#area-mode").hidden = v !== "area";
  });
  $("#direct-area").addEventListener("input", calculateLater);

  /* ---------- Products ---------- */
  const select = $("#product-select");
  function fillProducts() {
    const want = state.surface === "metal" ? ["metal", "wood"] : [state.surface];
    const list = BRAVO.products.filter((p) => p.surfaces.some((s) => want.includes(s)));
    if (!list.some((p) => p.id === state.product)) state.product = list[0].id;
    select.innerHTML = list
      .map((p) => `<option value="${p.id}"${p.id === state.product ? " selected" : ""}>${escapeHTML(p.name)} — ${escapeHTML(p.type)} (~${p.coverage} m²/L)</option>`)
      .join("");
  }
  select.addEventListener("change", () => {
    state.product = select.value;
    calculate();
  });

  /* ---------- Tin optimiser: balance spare litres against tin count ----------
     Each extra tin "costs" TIN_PENALTY litres, so 1 × 20L beats 3 × 5L + 4 × 1L for 18.4L. */
  const TIN_PENALTY = 0.6;
  const bestTins = (litres, sizes) => {
    const s = [...sizes].sort((a, b) => b - a);
    let best = null;
    const max = s.map((size) => Math.ceil(litres / size) + 1);
    const walk = (idx, counts, total) => {
      if (idx === s.length) {
        if (total + 1e-9 < litres) return;
        const tins = counts.reduce((a, b) => a + b, 0);
        const score = total + tins * TIN_PENALTY;
        if (!best || score < best.score - 1e-9) best = { score, counts: [...counts] };
        return;
      }
      for (let c = 0; c <= max[idx]; c++) {
        counts[idx] = c;
        walk(idx + 1, counts, total + c * s[idx]);
      }
    };
    walk(0, [], 0);
    return best ? s.map((size, i) => ({ size, count: best.counts[i] })).filter((x) => x.count) : [];
  };

  /* ---------- Calculate ---------- */
  let timer;
  function calculateLater() {
    clearTimeout(timer);
    timer = setTimeout(calculate, 80);
  }

  function calculate() {
    const product = BRAVO.products.find((p) => p.id === state.product);
    const area = state.mode === "area" ? num($("#direct-area").value) : state.rooms.reduce((sum, r) => sum + roomArea(r), 0);
    const litres = area > 0 ? (area * state.coats * state.condition * WASTAGE) / product.coverage : 0;
    const litresRounded = Math.ceil(litres * 10) / 10;

    $("#r-area").innerHTML = `${fmt(area)}<span>m²</span>`;
    $("#r-litres").innerHTML = `${fmt(litresRounded)}<span>litres</span>`;
    $("#r-coats").textContent = state.coats;
    $("#result-product").textContent = `${product.name} · ~${product.coverage} m²/L per coat`;

    const tins = litres > 0 ? bestTins(litresRounded, product.sizes) : [];
    $("#r-tins").innerHTML = tins.length
      ? tins.map((t) => `<li><span>${t.size} litre tin${t.count > 1 ? "s" : ""}</span><strong>× ${t.count}</strong></li>`).join("")
      : `<li><span>Enter your measurements to see tins</span></li>`;
  }

  renderRooms();
  fillProducts();
  calculate();
})();
