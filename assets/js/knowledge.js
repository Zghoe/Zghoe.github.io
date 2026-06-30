/* Knowledge Base — client-side filter/search over knowledge.json */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => (s || "").replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  const grid = $("#kbGrid"), countEl = $("#kbCount"), emptyEl = $("#kbEmpty");
  const searchEl = $("#kbSearch");
  const state = { term: "all", domain: null, type: null, q: "" };
  let DATA = null;

  fetch("../assets/data/knowledge.json")
    .then((r) => r.json())
    .then((d) => { DATA = d; init(d); })
    .catch(() => { grid.innerHTML = '<div class="kb-empty">Could not load the knowledge index.</div>'; });

  function init(d) {
    $("#stTotal").textContent = d.meta.total;
    $("#stDom").textContent = d.meta.domains;
    $("#stT1").textContent = d.meta.sem1;
    $("#stT2").textContent = d.meta.sem2;

    // domain facet
    const df = $("#domFacet");
    df.insertAdjacentHTML("beforeend", `<button class="fchip on" data-dom="">All</button>` +
      d.domains.map((dm) => `<button class="fchip" data-dom="${esc(dm.name)}" title="${esc(dm.name)}">${esc(dm.short)} <span class="c">${dm.count}</span></button>`).join(""));

    // type facet (top types)
    const tf = $("#typeFacet");
    const topTypes = d.types.slice(0, 14);
    tf.insertAdjacentHTML("beforeend", `<button class="fchip on" data-type="">All</button>` +
      topTypes.map((t) => `<button class="fchip" data-type="${esc(t.name)}">${esc(t.name)} <span class="c">${t.count}</span></button>`).join(""));

    // wire facets
    $$("[data-term]").forEach((b) => b.addEventListener("click", () => { setActive("[data-term]", b); state.term = b.dataset.term; apply(); }));
    $$("[data-dom]").forEach((b) => b.addEventListener("click", () => { setActive("[data-dom]", b); state.domain = b.dataset.dom || null; apply(); }));
    $$("[data-type]").forEach((b) => b.addEventListener("click", () => { setActive("[data-type]", b); state.type = b.dataset.type || null; apply(); }));

    let t;
    searchEl.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { state.q = searchEl.value.trim().toLowerCase(); apply(); }, 110); });

    $$("[data-focus-search]").forEach((b) => b.addEventListener("click", () => searchEl.focus()));
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchEl.focus(); searchEl.select(); }
    });
    $("[data-reset]") && $("[data-reset]").addEventListener("click", reset);

    // mobile nav
    const nav = $("#nav"), tog = $("[data-navtog]");
    if (tog) tog.addEventListener("click", () => nav.classList.toggle("open"));

    apply();
  }

  function setActive(sel, btn) { $$(sel).forEach((b) => b.classList.remove("on")); btn.classList.add("on"); }

  function reset() {
    state.term = "all"; state.domain = null; state.type = null; state.q = ""; searchEl.value = "";
    setActive("[data-term]", $('[data-term="all"]'));
    setActive("[data-dom]", $('[data-dom=""]'));
    setActive("[data-type]", $('[data-type=""]'));
    apply();
  }

  function apply() {
    if (!DATA) return;
    const q = state.q;
    const res = DATA.items.filter((it) => {
      if (state.term !== "all" && String(it.term) !== state.term) return false;
      if (state.domain && it.domain !== state.domain) return false;
      if (state.type && it.type !== state.type) return false;
      if (q && !(it.name + " " + it.desc + " " + it.domainShort + " " + it.subdomain + " " + it.type).toLowerCase().includes(q)) return false;
      return true;
    });

    countEl.innerHTML = `<b>${res.length}</b> of ${DATA.items.length} items`;
    emptyEl.hidden = res.length > 0;

    // cap DOM for very large result sets to keep it snappy
    const cap = 600;
    const slice = res.slice(0, cap);
    grid.innerHTML = slice.map((it) =>
      `<div class="ki"><div class="ki__top"><span class="ki__type">${esc(it.type)}</span><span class="ki__term">T${it.term}</span></div>` +
      `<div class="ki__name">${esc(it.name)}</div>` +
      (it.desc ? `<div class="ki__desc">${esc(it.desc)}</div>` : "") +
      `<div class="ki__dom">${esc(it.domainShort)}${it.subdomain ? " · " + esc(it.subdomain) : ""}</div></div>`
    ).join("");
    if (res.length > cap) grid.insertAdjacentHTML("beforeend", `<div class="kb-empty" style="grid-column:1/-1;padding:24px">Showing first ${cap}. Refine with search or filters to narrow.</div>`);
  }
})();
