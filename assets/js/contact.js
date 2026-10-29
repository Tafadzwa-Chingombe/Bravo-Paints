/* Contact page: form validation, open-now badge, dealer search */
(function () {
  "use strict";
  const { $, $$ } = BRAVO;

  /* ---------- Contact form ---------- */
  const form = $("#contact-form");
  const status = $(".form-status", form);
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (BRAVO.isEmail(v) ? "" : "Please enter a valid email address."),
    phone: (v) => (!v.trim() || /^[+()\d\s-]{7,}$/.test(v) ? "" : "Please enter a valid phone number."),
    subject: (v) => (v ? "" : "Please choose a topic."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please tell us a little more (at least 10 characters)."),
  };

  const check = (field) => {
    const msg = rules[field.name] ? rules[field.name](field.value) : "";
    const wrap = field.closest(".field");
    wrap.classList.toggle("has-error", !!msg);
    $(".field__error", wrap).textContent = msg;
    field.setAttribute("aria-invalid", String(!!msg));
    return !msg;
  };

  $$("input, select, textarea", form).forEach((f) => {
    f.addEventListener("blur", () => f.value && check(f));
    f.addEventListener("input", () => f.closest(".field").classList.contains("has-error") && check(f));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input, select, textarea", form);
    const invalid = fields.filter((f) => !check(f));
    status.className = "form-status";
    if (invalid.length) {
      invalid[0].focus();
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      return;
    }
    // TODO: send to your backend / Formspree / Netlify Forms here.
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    setTimeout(() => {
      status.textContent = `Thanks, ${$("#c-name").value.trim().split(" ")[0]}! Your message has been received — we'll reply within one business day.`;
      status.classList.add("is-success");
      form.reset();
      btn.disabled = false;
    }, 600);
  });

  /* ---------- Open now badge (Lagos time, WAT = UTC+1) ---------- */
  const badge = $("#open-badge");
  if (badge) {
    const now = new Date();
    const lagos = new Date(now.getTime() + (now.getTimezoneOffset() + 60) * 60000);
    const day = lagos.getDay();
    const mins = lagos.getHours() * 60 + lagos.getMinutes();
    const open = (day >= 1 && day <= 5 && mins >= 480 && mins < 1020) || (day === 6 && mins >= 540 && mins < 840);
    badge.textContent = open ? "Open now" : "Closed now";
    badge.classList.toggle("is-open", open);
  }

  /* ---------- Dealer search → Google Maps ---------- */
  $("#dealer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#dealer-q").value.trim() || "Nigeria";
    window.open("https://www.google.com/maps/search/" + encodeURIComponent("Bravo Paints dealer " + q), "_blank", "noopener");
  });
})();
