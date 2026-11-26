// Renders the page from data.js. You normally don't need to edit this file.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const colorOf = {};
  SITE.lines.forEach((l) => { colorOf[l.name] = l.color; });
  const stationByName = {};
  SITE.stations.forEach((s) => { stationByName[s.name] = s; });

  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const word = (n) => WORDS[n] || String(n);
  const districts = new Set(SITE.stations.map((s) => s.district).filter(Boolean)).size;
  const lead = `${word(SITE.lines.length)} lines, ${word(SITE.stations.length)} stations and ${word(districts)} districts. Join the server and ride the network.`;
  $("hero-sub").textContent = lead.charAt(0).toUpperCase() + lead.slice(1);

  // ---- Hero status board ----
  $("board-rows").innerHTML = SITE.lines.map((l, i) => `
    <li style="--i:${i}">
      <span class="tab" style="background:${esc(l.color)}"></span>
      <span class="b-name">${esc(l.name)}</span>
      <span class="b-n">${l.stops.length} stops</span>
      <span class="b-route">${esc(l.route)}</span>
    </li>`).join("");

  // ---- About ----
  $("about-text").textContent = SITE.about;
  $("facts").innerHTML = Object.entries(SITE.facts)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  // ---- Map legend ----
  $("legend").innerHTML = SITE.lines
    .map((l) => `<li><span class="swatch" style="background:${esc(l.color)}"></span>${esc(l.name)}</li>`).join("");

  // ---- Lines with route diagrams and transfers ----
  $("lines-list").innerHTML = SITE.lines.map((l) => {
    const stops = l.stops.map((name) => {
      const st = stationByName[name];
      const others = st ? st.lines.filter((n) => n !== l.name) : [];
      const xfer = others.length
        ? `<span class="xfer">Change for ${others.map((n) => `<span class="xdot" style="background:${esc(colorOf[n] || "#888")}"></span>${esc(n)}`).join(", ")}</span>`
        : "";
      return `<li><span class="stop-name">${esc(name)}</span>${xfer}</li>`;
    }).join("");
    const kind = [l.type, l.length].filter(Boolean).join(", ");
    return `
    <article class="line" style="--c:${esc(l.color)}">
      <div class="line-head"><h3>${esc(l.name)}</h3></div>
      <div class="line-body">
        <p class="route-from"><strong>${esc(l.route)}</strong></p>
        ${kind ? `<p class="muted kind">${esc(kind)}</p>` : ""}
        <p>${esc(l.description)}</p>
        <ol class="route">${stops}</ol>
      </div>
    </article>`;
  }).join("");

  // ---- Stations table with search ----
  const lineChips = (names) => names.map((n) =>
    `<span class="lchip"><i style="background:${esc(colorOf[n] || "#888")}"></i>${esc(n)}</span>`).join("");
  const body = $("stations-body");
  function renderStations(filter) {
    const q = (filter || "").toLowerCase();
    body.innerHTML = SITE.stations
      .filter((s) => !q || (s.name + " " + s.lines.join(" ") + " " + s.district + " " + s.notes).toLowerCase().includes(q))
      .map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${lineChips(s.lines)}</td><td>${esc(s.district)}</td><td>${esc(s.notes)}</td></tr>`)
      .join("") || `<tr><td colspan="4">No stations match your search. Try a line or district name.</td></tr>`;
  }
  renderStations();
  $("station-filter").addEventListener("input", (e) => renderStations(e.target.value));

  // ---- Fleet ----
  $("fleet-list").innerHTML = SITE.fleet.map((f) => `
    <article class="train">
      <h3>${esc(f.name)}</h3>
      <p class="muted role">${esc(f.role)}</p>
      <p>${esc(f.description)}</p>
      <div class="tags">${f.tags.map((t) => `<span class="tag"><i style="background:${esc(colorOf[t] || "#575e66")}"></i>${esc(t)}</span>`).join("")}</div>
    </article>`).join("");

  // ---- News ----
  $("news-list").innerHTML = SITE.news.map((n) => `
    <li>
      <span class="when">${esc(n.date)}</span>
      <div><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></div>
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
      <article class="person">
        <h3>${esc(m.name)}</h3>
        <p class="muted role">${esc(m.role)}</p>
        ${m.note ? `<p>${esc(m.note)}</p>` : ""}
      </article>`).join("")
    : `<p class="empty">The team list is coming soon. Want to be on it? See the Jobs section.</p>`;

  // ---- Rules, ride steps (steps may contain simple trusted HTML) ----
  $("rules-list").innerHTML = SITE.rules.map((r) => `<li>${esc(r)}</li>`).join("");
  $("ride-steps").innerHTML = SITE.ride.map((s) => `<li>${s}</li>`).join("");

  // ---- Jobs ----
  $("jobs-intro").textContent = SITE.jobs.intro;
  $("jobs-apply").href = SITE.jobs.applyUrl;
  $("jobs-list").innerHTML = SITE.jobs.positions.map((j) => `
    <li><h3>${esc(j.title)}</h3><p>${esc(j.description)}</p></li>`).join("");

  // ---- Server card, copy button, live status ----
  const address = SITE.server.address;
  $("server-address").textContent = address;
  $("server-version").textContent = "Minecraft " + (SITE.facts["Minecraft version"] || "");
  $("server-copy").addEventListener("click", () => {
    const btn = $("server-copy");
    const done = () => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = "Copy"; }, 1500); };
    try { navigator.clipboard.writeText(address).then(done, () => {}); } catch (e) { /* ignore */ }
  });

  function setStatus(kind, text) {
    ["server-status", "board-status"].forEach((id) => { $(id).className = "status " + kind; });
    ["server-status-text", "board-status-text"].forEach((id) => { $(id).textContent = text; });
  }
  try {
    fetch("https://api.mcsrvstat.us/3/" + encodeURIComponent(address))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.online) {
          const p = d.players && typeof d.players.online === "number"
            ? `, ${d.players.online}${d.players.max ? " of " + d.players.max : ""} players` : "";
          setStatus("online", "Server online" + p);
        } else if (d && d.online === false) {
          setStatus("offline", "Server offline");
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
          $("discord-counts").textContent = `${d.approximate_presence_count || 0} online, ${d.approximate_member_count} members`;
        }
      })
      .catch(() => {});
  } catch (e) { /* ignore */ }

  // ---- Highlight the current station in the rail ----
  const links = Array.from(document.querySelectorAll(".rail ol a"));
  const byId = {};
  links.forEach((a) => { byId[a.getAttribute("href").slice(1)] = a; });
  function setActive(id) {
    links.forEach((a) => { if (a === byId[id]) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    const cur = byId[id];
    if (cur && window.matchMedia("(max-width: 959px)").matches && cur.scrollIntoView) {
      try { cur.parentNode.parentNode.scrollTo({ left: cur.offsetLeft - 80, behavior: "smooth" }); } catch (e) { /* ignore */ }
    }
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach((id) => { const el = $(id); if (el) io.observe(el); });
  }
})();
