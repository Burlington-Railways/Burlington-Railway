// Renders the page from data.js. You normally don't need to edit this file.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const stationByName = {};
  SITE.stations.forEach((s) => { stationByName[s.name] = s; });
  const lineColor = {};
  SITE.lines.forEach((l) => { lineColor[l.name] = l.color; });

  // ---- About + facts ----
  $("about-text").textContent = SITE.about;
  $("facts").innerHTML = Object.entries(SITE.facts)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");

  // ---- Map legend ----
  $("legend").innerHTML = SITE.lines
    .map((l) => `<li><span class="swatch" style="background:${esc(l.color)}"></span>${esc(l.name)}</li>`)
    .join("");

  // ---- Lines, each with a route diagram showing transfers ----
  $("lines-list").innerHTML = SITE.lines.map((l) => {
    const stops = l.stops.map((name) => {
      const st = stationByName[name];
      const others = st ? st.lines.filter((n) => n !== l.name) : [];
      const xfer = others.length
        ? `<span class="xfer">Transfer: ${others.map((n) => `<span class="xdot" style="background:${esc(lineColor[n] || "#999")}"></span>${esc(n)}`).join(", ")}</span>`
        : "";
      return `<li><span class="stop-name">${esc(name)}</span>${xfer}</li>`;
    }).join("");
    return `
    <article class="card line-card" style="--card-color:${esc(l.color)}">
      <h3>${esc(l.name)}</h3>
      <p class="meta">${[l.route, l.length, l.type].filter(Boolean).map(esc).join(" &middot; ")}</p>
      <p>${esc(l.description)}</p>
      <ol class="route">${stops}</ol>
    </article>`;
  }).join("");

  // ---- Fleet ----
  $("fleet-list").innerHTML = SITE.fleet.map((f) => `
    <article class="card">
      <h3>${esc(f.name)}</h3>
      <p class="meta">${esc(f.role)}</p>
      <p>${esc(f.description)}</p>
      <div class="chips">${f.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    </article>`).join("");

  // ---- News timeline ----
  $("news-list").innerHTML = SITE.news.map((n) => `
    <li>
      <span class="t-date">${esc(n.date)}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.text)}</p>
    </li>`).join("");

  // ---- Gallery ----
  $("gallery-list").innerHTML = SITE.gallery.length
    ? SITE.gallery.map((g) => `
      <figure class="shot">
        <a href="${esc(g.src)}" target="_blank" rel="noopener"><img src="${esc(g.src)}" alt="${esc(g.caption || "Burlington Railways screenshot")}" loading="lazy"></a>
        ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}
      </figure>`).join("")
    : `<p class="empty">Screenshots are coming soon. Check back later!</p>`;

  // ---- Team ----
  $("team-list").innerHTML = SITE.team.length
    ? SITE.team.map((m) => `
      <article class="card person">
        <h3>${esc(m.name)}</h3>
        <p class="meta">${esc(m.role)}</p>
        ${m.note ? `<p>${esc(m.note)}</p>` : ""}
      </article>`).join("")
    : `<p class="empty">The team list is coming soon. Want to be on it? See the Jobs section below.</p>`;

  // ---- Rules, How to ride (steps/answers may contain simple trusted HTML) ----
  $("rules-list").innerHTML = SITE.rules.map((r) => `<li>${esc(r)}</li>`).join("");
  $("ride-steps").innerHTML = SITE.ride.map((s) => `<li>${s}</li>`).join("");

  // ---- Jobs ----
  $("jobs-intro").textContent = SITE.jobs.intro;
  $("jobs-apply").href = SITE.jobs.applyUrl;
  $("jobs-list").innerHTML = SITE.jobs.positions.map((j) => `
    <article class="card">
      <h3>${esc(j.title)}</h3>
      <p>${esc(j.description)}</p>
      <div class="chips">${j.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    </article>`).join("");

  // ---- Stations table with search ----
  const body = $("stations-body");
  function renderStations(filter) {
    const q = (filter || "").toLowerCase();
    body.innerHTML = SITE.stations
      .filter((s) => !q || (s.name + " " + s.lines.join(" ") + " " + s.district + " " + s.notes).toLowerCase().includes(q))
      .map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.lines.join(", "))}</td><td>${esc(s.district)}</td><td>${esc(s.notes)}</td></tr>`)
      .join("") || `<tr><td colspan="4">No stations match your search.</td></tr>`;
  }
  renderStations();
  $("station-filter").addEventListener("input", (e) => renderStations(e.target.value));

  // ---- Server card ----
  const address = SITE.server.address;
  $("server-address").textContent = address;
  $("server-version").textContent = "Minecraft " + (SITE.facts["Minecraft version"] || "");
  $("server-copy").addEventListener("click", () => {
    const btn = $("server-copy");
    const done = () => { btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = "Copy"; }, 1500); };
    try { navigator.clipboard.writeText(address).then(done, () => {}); } catch (e) { /* ignore */ }
  });

  // Live server status (third-party API; fails quietly)
  function setStatus(kind, text) {
    $("server-status").className = "status " + kind;
    $("server-status-text").textContent = text;
  }
  try {
    fetch("https://api.mcsrvstat.us/3/" + encodeURIComponent(address))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.online) {
          const p = d.players && typeof d.players.online === "number"
            ? ` · ${d.players.online}${d.players.max ? "/" + d.players.max : ""} players`
            : "";
          setStatus("online", "Online" + p);
        } else if (d && d.online === false) {
          setStatus("offline", "Offline right now");
        } else {
          setStatus("unknown", "Status unavailable");
        }
      })
      .catch(() => setStatus("unknown", "Status unavailable"));
  } catch (e) { setStatus("unknown", "Status unavailable"); }

  // ---- Discord card ----
  $("discord-join").href = SITE.discord.invite;
  try {
    fetch("https://discord.com/api/v10/invites/" + encodeURIComponent(SITE.discord.code) + "?with_counts=true")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.approximate_member_count) {
          $("discord-counts").textContent = `${d.approximate_presence_count || 0} online · ${d.approximate_member_count} members`;
        }
      })
      .catch(() => {});
  } catch (e) { /* ignore */ }
})();
