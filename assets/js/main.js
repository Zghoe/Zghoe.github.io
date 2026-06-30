/* Operator Console — interactions */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach((el) => io.observe(el));

  /* ---- mobile nav ---- */
  const nav = $("#nav"), tog = $("[data-navtog]");
  if (tog) tog.addEventListener("click", () => nav.classList.toggle("open"));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---- capability tabs ---- */
  $$(".cap__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".cap__tab").forEach((t) => t.classList.remove("on"));
      tab.classList.add("on");
      const id = tab.dataset.cap;
      $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== id; });
    });
  });

  /* ---- coursework term tabs ---- */
  $$(".term-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".term-tab").forEach((t) => t.classList.remove("on"));
      tab.classList.add("on");
      const t = tab.dataset.term;
      $$("[data-term-grid]").forEach((g) => { g.hidden = g.dataset.termGrid !== t; });
    });
  });

  /* ---- command palette ---- */
  const cmdk = $("#cmdk"), input = $("#cmdkInput"), list = $("#cmdkList");
  const items = [
    { ty: "section", nm: "Journey", dm: "the arc", go: "#journey" },
    { ty: "section", nm: "Capability Map", dm: "skills & tools", go: "#capabilities" },
    { ty: "section", nm: "Field Reports", dm: "real work", go: "#reports" },
    { ty: "section", nm: "Coursework", dm: "10 courses", go: "#coursework" },
    { ty: "section", nm: "Contact", dm: "get in touch", go: "#contact" },
    { ty: "page", nm: "Knowledge Base", dm: "581 skills", go: "knowledge/" },
    { ty: "report", nm: "IOC Analysis — Cobalt Strike", dm: "55 pp · CST8812", go: "assets/reports/ioc-analysis-cobalt-strike.pdf", ext: 1 },
    { ty: "report", nm: "Active Directory Hardening", dm: "44 pp · CST8812", go: "assets/reports/network-hardening-active-directory.pdf", ext: 1 },
    { ty: "report", nm: "Red-Team Proposal — British Library", dm: "12 pp · CST8807", go: "assets/reports/penetration-test-proposal-british-library.pdf", ext: 1 },
    { ty: "report", nm: "Digital Forensics Lab Proposal", dm: "11 pp · CST8806", go: "assets/reports/digital-forensics-lab-proposal.pdf", ext: 1 },
    { ty: "report", nm: "Mini-PKI Project Report", dm: "12 pp · CST8805", go: "assets/reports/mini-pki-project-report.pdf", ext: 1 },
    { ty: "report", nm: "Business Continuity Business Case", dm: "5 pp · CST8809", go: "assets/reports/business-continuity-business-case.pdf", ext: 1 },
    { ty: "link", nm: "Email", dm: "moha.zghoul@gmail.com", go: "mailto:moha.zghoul@gmail.com", ext: 1 },
    { ty: "link", nm: "LinkedIn", dm: "/in/mohammadzghoul777", go: "https://www.linkedin.com/in/mohammadzghoul777", ext: 1 },
    { ty: "link", nm: "GitHub", dm: "github.com/Zghoe", go: "https://github.com/Zghoe", ext: 1 },
  ];
  let sel = 0, shown = items;

  function render() {
    if (!shown.length) { list.innerHTML = '<div class="cmdk__empty">no matches</div>'; return; }
    list.innerHTML = shown.map((it, i) =>
      `<div class="cmdk__row${i === sel ? " sel" : ""}" data-i="${i}"><span class="ty">${it.ty}</span><span class="nm">${it.nm}</span><span class="dm">${it.dm}</span></div>`
    ).join("");
    $$(".cmdk__row", list).forEach((r) => {
      r.addEventListener("click", () => { sel = +r.dataset.i; run(); });
      r.addEventListener("mousemove", () => { sel = +r.dataset.i; paint(); });
    });
  }
  function paint() { $$(".cmdk__row", list).forEach((r, i) => r.classList.toggle("sel", i === sel)); }
  function filter(q) {
    q = q.trim().toLowerCase();
    shown = !q ? items : items.filter((it) => (it.nm + " " + it.dm + " " + it.ty).toLowerCase().includes(q));
    sel = 0; render();
  }
  function open() { cmdk.classList.add("on"); input.value = ""; filter(""); setTimeout(() => input.focus(), 30); }
  function close() { cmdk.classList.remove("on"); }
  function run() {
    const it = shown[sel]; if (!it) return; close();
    if (it.go.startsWith("#")) { const t = $(it.go); if (t) t.scrollIntoView({ behavior: "smooth" }); }
    else if (it.ext) { window.open(it.go, it.go.startsWith("http") ? "_blank" : "_self"); }
    else { window.location.href = it.go; }
  }
  $$("[data-cmdk]").forEach((b) => b.addEventListener("click", open));
  if (input) {
    input.addEventListener("input", () => filter(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
      else if (e.key === "Enter") { e.preventDefault(); run(); }
    });
  }
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.classList.contains("on") ? close() : open(); }
    else if (e.key === "Escape") close();
  });
  if (cmdk) cmdk.addEventListener("click", (e) => { if (e.target === cmdk) close(); });

  /* ---- year ---- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
