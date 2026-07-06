// JobKey LinkedIn overlay (PRD flows CE1 save, CE2 quick submit, CE4
// duplicate detection). Profile data is read from the page; CRM/watchlist
// data is mocked until the backend exists.
(function jobkeyContent() {
  "use strict";

  if (document.getElementById("jk-fab-stack")) return; // already injected

  // --- mock data -----------------------------------------------------------
  // Candidates already in the CRM (duplicate detection keys on LinkedIn URL
  // per the PRD; name is the fallback used on fixture pages).
  const CRM_CANDIDATES = [
    { name: "Annette Black", url: "/in/annette-black", submissions: [
      { vacancy: "Senior Developer · TechCorp", status: "Interview" },
      { vacancy: "Product Manager · Stellaris Inc.", status: "Pending" },
    ] },
    { name: "Darlene Robertson", url: "/in/darlene-robertson", submissions: [
      { vacancy: "UX Designer · Quantum Leap Corp", status: "Offer" },
    ] },
  ];

  const WATCHLIST = [
    { title: "Senior Software Engineer · Spotify", match: 88, midpoint: 80000 },
    { title: "Engineering Manager · Electronic Arts", match: 74, midpoint: 95000 },
    { title: "Customer Success Lead · Snap Inc", match: 61, midpoint: 62000 },
    { title: "Lead Software Engineer · Fitbit", match: 42, midpoint: 85000 },
  ];

  const HEX_SVG =
    '<svg class="jk-hex" viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg"><path d="M20 1L38.19 11.5V32.5L20 43L1.81 32.5V11.5L20 1Z" fill="currentColor"/><circle cx="20" cy="17.5" r="5.5" fill="#fff"/><path d="M17 20H23L25 31H15L17 20Z" fill="#fff"/></svg>';

  // --- profile extraction (CE: name, headline, location; URL locked) -------
  function extractProfile() {
    const name = document.querySelector("h1")?.textContent?.trim() ?? "";
    const headline =
      document.querySelector('[data-jobkey="headline"], .text-body-medium')?.textContent?.trim() ?? "";
    const location =
      document.querySelector('[data-jobkey="location"], .text-body-small.inline')?.textContent?.trim() ?? "";
    return { name, headline, location, url: location ? window.location.pathname : window.location.pathname };
  }

  function findDuplicate(profile) {
    return CRM_CANDIDATES.find(
      (c) => c.url === profile.url || (profile.name && c.name.toLowerCase() === profile.name.toLowerCase())
    );
  }

  // --- ui helpers -----------------------------------------------------------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function toast(message) {
    const node = el(`<div class="jk-toast"><span class="jk-check">✓</span>${message}</div>`);
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  let openPanel = null;
  function showPanel(title, bodyNode) {
    closePanel();
    const panel = el(
      `<div class="jk-panel" id="jk-panel">
        <div class="jk-panel-head"><span>${title}</span><button type="button" class="jk-panel-close" aria-label="Close">✕</button></div>
      </div>`
    );
    const body = el('<div class="jk-panel-body"></div>');
    body.appendChild(bodyNode);
    panel.appendChild(body);
    panel.querySelector(".jk-panel-close").addEventListener("click", closePanel);
    document.body.appendChild(panel);
    openPanel = panel;
  }
  function closePanel() {
    openPanel?.remove();
    openPanel = null;
  }

  // --- CE1: save to CRM ------------------------------------------------------
  function saveForm(profile, onSaved) {
    const wrap = el("<div></div>");
    wrap.innerHTML = `
      <div class="jk-field"><label>Name</label><input id="jk-name" type="text" /></div>
      <div class="jk-field"><label>Tags</label><input id="jk-tags" type="text" placeholder="e.g. frontend, senior" /></div>
      <div class="jk-field"><label>Folder</label>
        <select id="jk-folder">
          <option>Frontend Engineers</option>
          <option>Product Designers</option>
          <option>Engineering Leaders</option>
          <option>Data &amp; Analytics</option>
        </select>
      </div>
      <div class="jk-field"><label>Quick note</label><textarea id="jk-note" rows="2" placeholder="Anything worth remembering…"></textarea></div>
      <button type="button" class="jk-submit" id="jk-save">Save to JobKey</button>`;
    wrap.querySelector("#jk-name").value = profile.name;
    wrap.querySelector("#jk-save").addEventListener("click", () => {
      closePanel();
      toast("Candidate saved to your CRM");
      onSaved();
    });
    return wrap;
  }

  // --- CE2: quick submit ------------------------------------------------------
  function submitForm(profile) {
    const wrap = el("<div></div>");
    const options = WATCHLIST.map(
      (v, i) => `<option value="${i}">${v.title} (${v.match}% match)</option>`
    ).join("");
    wrap.innerHTML = `
      <div class="jk-field"><label>Vacancy (watchlist first)</label><select id="jk-vacancy">${options}</select></div>
      <div class="jk-field"><label>Commission bid %</label><input id="jk-bid" type="number" min="8" max="25" value="15" /></div>
      <div class="jk-earnings" id="jk-earnings"></div>
      <div class="jk-field"><label>Quick note</label><textarea id="jk-qnote" rows="2" placeholder="Why ${profile.name || "this candidate"} fits…"></textarea></div>
      <label class="jk-consent"><input id="jk-consent" type="checkbox" /><span>I confirm I have obtained candidate consent</span></label>
      <button type="button" class="jk-submit" id="jk-quick-submit" disabled>Submit</button>`;

    const bidInput = wrap.querySelector("#jk-bid");
    const vacancySelect = wrap.querySelector("#jk-vacancy");
    const earnings = wrap.querySelector("#jk-earnings");
    const consent = wrap.querySelector("#jk-consent");
    const submitBtn = wrap.querySelector("#jk-quick-submit");

    function refresh() {
      const vacancy = WATCHLIST[Number(vacancySelect.value)];
      const bid = Number(bidInput.value || 0);
      const est = Math.round((vacancy.midpoint * bid) / 100);
      earnings.textContent = `Estimated earnings if placed: £${est.toLocaleString()}`;
      submitBtn.disabled = !consent.checked || bid <= 0;
    }
    bidInput.addEventListener("input", refresh);
    vacancySelect.addEventListener("change", refresh);
    consent.addEventListener("change", refresh);
    refresh();

    submitBtn.addEventListener("click", () => {
      closePanel();
      toast("Candidate submitted — track it in JobKey");
    });
    return wrap;
  }

  // --- CE4: existing record ---------------------------------------------------
  function existingRecord(duplicate) {
    const wrap = el("<div></div>");
    const rows = duplicate.submissions
      .map(
        (s) =>
          `<div class="jk-record-row"><span>${s.vacancy}</span><span class="jk-status">${s.status}</span></div>`
      )
      .join("");
    wrap.innerHTML = `
      <p style="margin:0"><strong>${duplicate.name}</strong> is already in your CRM.</p>
      <p style="margin:0;color:#737373;font-size:12px">Previous submissions</p>
      ${rows}
      <button type="button" class="jk-submit" id="jk-open-record">View in JobKey</button>`;
    wrap.querySelector("#jk-open-record").addEventListener("click", () => {
      window.open("http://localhost:5173/recruiter/candidates", "_blank");
    });
    return wrap;
  }

  // --- mount ------------------------------------------------------------------
  function mount() {
    const profile = extractProfile();
    if (!profile.name) return; // not a profile page

    const stack = el('<div class="jk-fab-stack" id="jk-fab-stack"></div>');
    const duplicate = findDuplicate(profile);

    if (duplicate) {
      const badge = el(`<button type="button" class="jk-badge-duplicate">${HEX_SVG}Already in your CRM</button>`);
      badge.addEventListener("click", () => showPanel("Existing Record", existingRecord(duplicate)));
      stack.appendChild(badge);
    } else {
      const saveBtn = el(`<button type="button" class="jk-btn jk-btn-primary" id="jk-save-btn">${HEX_SVG}Save to JobKey</button>`);
      saveBtn.addEventListener("click", () =>
        showPanel("Save Candidate", saveForm(profile, () => {
          saveBtn.className = "jk-btn jk-btn-saved";
          saveBtn.innerHTML = `${HEX_SVG}✓ View in JobKey`;
          saveBtn.onclick = () => window.open("http://localhost:5173/recruiter/candidates", "_blank");
        }))
      );
      stack.appendChild(saveBtn);
    }

    const submitBtn = el(`<button type="button" class="jk-btn jk-btn-secondary">Submit to Vacancy</button>`);
    submitBtn.addEventListener("click", () => showPanel("Quick Submit", submitForm(profile)));
    stack.appendChild(submitBtn);

    document.body.appendChild(stack);
  }

  // LinkedIn is an SPA; wait for the profile header to exist.
  if (document.querySelector("h1")) {
    mount();
  } else {
    const observer = new MutationObserver(() => {
      if (document.querySelector("h1")) {
        observer.disconnect();
        mount();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
