// Renders the page from data.js. You normally don't need to edit this file.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const colorOf = {};
  SITE.lines.forEach((l) => { colorOf[l.name] = l.color; });
  const stationByName = {};
  SITE.stations.forEach((s) => { stationByName[s.name] = s; });
  const address = SITE.server.address;

  // ---- Notice bar ----
  if (SITE.notice && SITE.notice.show) {
    $("notice").hidden = false;
    $("notice-text").textContent = SITE.notice.text;
    $("notice-addr").textContent = address;
  }

  // ---- Hero and board ----
  $("hero-title").textContent = SITE.hero.headline;
  $("hero-sub").textContent = SITE.hero.sub;
  $("board-address").innerHTML = esc(address).replace(/\./g, ".<wbr>");
  $("board-version").textContent = "Minecraft " + (SITE.facts["Minecraft version"] || "");
  $("discord-join").href = SITE.discord.invite;

  // ---- Copy buttons ----
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    const done = () => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = label; }, 1600); };
    btn.addEventListener("click", () => {
      const fallback = () => {
        const t = document.createElement("textarea");
        t.value = address; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
        document.body.removeChild(t);
      };
      try { navigator.clipboard.writeText(address).then(done, fallback); } catch (e) { fallback(); }
    });
  });

  // ---- About ----
  $("about-text").textContent = SITE.about;
  $("facts").innerHTML = Object.entries(SITE.facts)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  // ---- Map legend ----
  $("legend").innerHTML = SITE.lines
    .map((l) => `<li><span class="swatch" style="background:${esc(l.color)}"></span>${esc(l.name)}</li>`).join("");

  // ---- Lines as strip maps ----
  $("lines-list").innerHTML = SITE.lines.map((l) => {
    const last = l.stops.length - 1;
    const stops = l.stops.map((name, i) => {
      const st = stationByName[name];
      const others = st ? st.lines.filter((n) => n !== l.name) : [];
      const cls = [i === 0 || i === last ? "end" : "", others.length ? "x" : ""].join(" ").trim();
      const xfer = others.length
        ? `<span class="xfer">Change for ${others.map((n) => `<i class="xdot" style="background:${esc(colorOf[n] || "#888")}"></i>${esc(n)}`).join(", ")}</span>`
        : "";
      return `<li class="${cls}"><span class="stop-name">${esc(name)}</span>${xfer}</li>`;
    }).join("");
    const kind = [l.type, l.length].filter(Boolean).join(", ");
    return `
    <article class="line" style="--c:${esc(l.color)}">
      <div class="line-head"><h3>${esc(l.name)}</h3><p class="line-route">${esc(l.route)}${kind ? ", " + esc(kind.toLowerCase()) : ""}</p></div>
      <p class="line-desc">${esc(l.description)}</p>
      <ol class="strip" aria-label="Stops on the ${esc(l.name)}">${stops}</ol>
    </article>`;
  }).join("");

  // ---- Stations ----
  const lineChips = (names) => names.map((n) =>
    `<span class="lchip"><i style="background:${esc(colorOf[n] || "#888")}"></i>${esc(n)}</span>`).join("");
  const body = $("stations-body");
  function renderStations(filter) {
    const q = (filter || "").toLowerCase();
    body.innerHTML = SITE.stations
      .filter((s) => !q || (s.name + " " + s.lines.join(" ") + " " + s.district + " " + s.notes).toLowerCase().includes(q))
      .map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${lineChips(s.lines)}</td><td>${esc(s.district)}</td><td>${esc(s.notes)}</td></tr>`)
      .join("") || `<tr><td colspan="4">No stations match. Try a line or district name.</td></tr>`;
  }
  renderStations();
  $("station-filter").addEventListener("input", (e) => renderStations(e.target.value));

  // ---- Fleet ----
  $("fleet-list").innerHTML = SITE.fleet.map((f) => `
    <article>
      <div><h3>${esc(f.name)}</h3><p class="role">${esc(f.role)}</p></div>
      <div><p>${esc(f.description)}</p>
      <p class="tags">${f.tags.map((t) => `<span><i style="background:${esc(colorOf[t] || "#565c63")}"></i>${esc(t)}</span>`).join("")}</p></div>
    </article>`).join("");

  // ---- News ----
  $("news-list").innerHTML = SITE.news.map((n) => `
    <li class="${n.highlight ? "hl" : ""}">
      <span class="when">${esc(n.date)}</span>
      <div><h3>${esc(n.title)}${n.highlight ? '<span class="pill">New</span>' : ""}</h3><p>${esc(n.text)}</p></div>
    </li>`).join("");

  // ---- Gallery ----
  $("gallery-list").innerHTML = SITE.gallery.length
    ? SITE.gallery.map((g) => `
      <figure class="shot">
        <a href="${esc(g.src)}" target="_blank" rel="noopener"><img src="${esc(g.src)}" alt="${esc(g.caption || "Burlington Railways screenshot")}" loading="lazy"></a>
        ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}
      </figure>`).join("")
    : `<p class="empty">Screenshots are coming soon.</p>`;

  // ---- Team ----
  $("team-list").innerHTML = SITE.team.length
    ? SITE.team.map((m) => `
      <article>
        <div><h3>${esc(m.name)}</h3><p class="role">${esc(m.role)}</p></div>
        <div>${m.note ? `<p>${esc(m.note)}</p>` : ""}</div>
      </article>`).join("")
    : `<p class="empty">The team list is coming soon. Want to be on it? See Jobs below.</p>`;

  // ---- Rules, ride steps (steps may contain trusted HTML) ----
  $("rules-list").innerHTML = SITE.rules.map((r) => `<li>${esc(r)}</li>`).join("");
  $("ride-steps").innerHTML = SITE.ride.map((s) => `<li>${s}</li>`).join("");

  // ---- Jobs ----
  $("jobs-intro").textContent = SITE.jobs.intro;
  $("jobs-apply").href = SITE.jobs.applyUrl;
  $("jobs-list").innerHTML = SITE.jobs.positions.map((j) => `<li><h3>${esc(j.title)}</h3><p>${esc(j.description)}</p></li>`).join("");

  // ---- Live server status ----
  function setStatus(kind, text) { $("board-status").className = "status " + kind; $("board-status-text").textContent = text; }
  try {
    fetch("https://api.mcsrvstat.us/3/" + encodeURIComponent(address))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.online) {
          const p = d.players && typeof d.players.online === "number" ? `, ${d.players.online} playing` : "";
          setStatus("online", "Online" + p);
        } else if (d && d.online === false) setStatus("offline", "Offline");
        else setStatus("unknown", "Status unavailable");
      })
      .catch(() => setStatus("unknown", "Status unavailable"));
  } catch (e) { setStatus("unknown", "Status unavailable"); }

  // ---- Discord counts ----
  try {
    fetch("https://discord.com/api/v10/invites/" + encodeURIComponent(SITE.discord.code) + "?with_counts=true")
      .then((r) => r.json())
      .then((d) => { if (d && d.approximate_member_count) $("discord-counts").textContent = `${d.approximate_presence_count || 0} online, ${d.approximate_member_count} members in the Discord`; })
      .catch(() => {});
  } catch (e) { /* ignore */ }

  // ---- Current section in the nav ----
  const links = Array.from(document.querySelectorAll(".nav a"));
  const byId = {};
  links.forEach((a) => { byId[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        const a = byId[e.target.id];
        if (a) {
          a.setAttribute("aria-current", "true");
          const nav = a.parentNode;
          if (nav.scrollWidth > nav.clientWidth) { try { nav.scrollTo({ left: a.offsetLeft - 60, behavior: "smooth" }); } catch (x) { /* ignore */ } }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach((id) => { const el = $(id); if (el) io.observe(el); });
  }
})();
