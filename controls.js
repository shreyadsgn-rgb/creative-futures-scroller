/* ============================================================
   controls.js — shared dev control panel for section sandboxes
   ------------------------------------------------------------
   Usage:  <script src="controls.js" defer></script>
   Toggle: the "dev" button (bottom-right) or the ` (backtick) key.

   Sliders write live to CSS custom properties on :root.
   "Save" does NOT persist anything — it prints the current values
   as a copy-paste block for you to move into the stylesheet by hand.

   The panel also shows a live scroll-position readout: the active
   [data-scrub] section's id and its --p (0→1), plus overall page scroll %.
   "Copy ref" grabs it as text (e.g. "s-dreams  p=0.623") — handy for
   describing exactly where a timing/scroll change should happen.

   To override the slider set for a specific sandbox, define
   window.DEV_CONTROLS = [{ prop, label, min, max, step, unit }, ...]
   BEFORE this script loads.
   ============================================================ */
(function () {
  'use strict';

  const CONTROLS = window.DEV_CONTROLS || [
    { prop: '--section-gap',     label: 'Section gap',     min: 100, max: 800, step: 10,   unit: 'vh' },
    { prop: '--section-between', label: 'Between hold',    min: 0,   max: 400, step: 10,   unit: 'vh' },
    { prop: '--lede-beat',       label: 'Lede beat',       min: 40,  max: 400, step: 10,   unit: 'vh' },
    { prop: '--anim-duration',   label: 'Anim duration',   min: 0.1, max: 2.5, step: 0.05, unit: 's'  },
    { prop: '--anim-delay',      label: 'Anim delay',      min: 0,   max: 1.5, step: 0.05, unit: 's'  },
    { prop: '--stagger',         label: 'Stagger',         min: 0,   max: 500, step: 10,   unit: 'ms' },
  ];

  const root = document.documentElement;

  /* ---------- panel styles (scoped under .devpanel / #devtoggle) ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #devtoggle {
      position: fixed; right: 16px; bottom: 16px; z-index: 9999;
      font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #EBFE9B; background: rgba(5, 10, 10, 0.85);
      border: 1px solid rgba(235, 254, 155, 0.4); border-radius: 999px;
      padding: 8px 14px; cursor: pointer; backdrop-filter: blur(6px);
    }
    #devtoggle:hover { background: rgba(235, 254, 155, 0.12); }
    .devpanel {
      position: fixed; right: 16px; bottom: 56px; z-index: 9999; width: 300px;
      font: 400 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #dfe7e7; background: rgba(8, 14, 14, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 10px;
      padding: 14px 16px 16px; backdrop-filter: blur(10px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    }
    .devpanel[hidden] { display: none; }
    .devpanel h2 {
      font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: #0097A7; margin: 0 0 12px;
    }
    .devpanel .posblock {
      margin-bottom: 12px; padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .devpanel .poslabel {
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: rgba(223, 231, 231, 0.5); margin-bottom: 6px;
    }
    .devpanel .posline { display: flex; justify-content: space-between; align-items: baseline; }
    .devpanel .posline span:first-child { color: #EBFE9B; font-weight: 600; }
    .devpanel .posline output { color: #EBFE9B; }
    .devpanel .posline.dim { color: rgba(223, 231, 231, 0.5); font-size: 10.5px; margin-top: 2px; }
    .devpanel button.small { margin-top: 8px; padding: 5px 10px; font-size: 10px; }
    .devpanel .row { margin-bottom: 10px; }
    .devpanel .row label {
      display: flex; justify-content: space-between; margin-bottom: 3px;
    }
    .devpanel .row output { color: #EBFE9B; }
    .devpanel input[type="range"] { width: 100%; accent-color: #0097A7; }
    .devpanel .editrow {
      display: flex; align-items: center; gap: 8px;
      margin: 12px 0; padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .devpanel .editrow input { accent-color: #EBFE9B; }
    .devpanel .hint { color: rgba(223, 231, 231, 0.5); font-size: 10.5px; margin: 4px 0 0; }
    .devpanel .btns { display: flex; gap: 8px; margin-top: 12px; }
    .devpanel button {
      font: 600 11px/1 inherit; letter-spacing: 0.06em; text-transform: uppercase;
      color: #050A0A; background: #EBFE9B; border: 0; border-radius: 6px;
      padding: 7px 12px; cursor: pointer;
    }
    .devpanel button.ghost { background: transparent; color: #dfe7e7; border: 1px solid rgba(255,255,255,0.25); }
    .devpanel textarea {
      width: 100%; margin-top: 10px; min-height: 90px; resize: vertical;
      font: inherit; font-size: 11px; color: #EBFE9B;
      background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px; padding: 8px;
    }
    .devpanel textarea[hidden] { display: none; }
    /* edit-mode affordances on the page itself */
    body[data-dev-edit] [data-editable] { outline: 1px dashed rgba(235, 254, 155, 0.5); outline-offset: 4px; cursor: text; }
    body[data-dev-edit] [data-img-slot] { outline: 1px dashed rgba(0, 151, 167, 0.8); outline-offset: 2px; cursor: pointer; }
  `;
  document.head.appendChild(style);

  /* ---------- read initial values off the stylesheet ---------- */
  function currentValue(ctl) {
    const raw = getComputedStyle(root).getPropertyValue(ctl.prop).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : (ctl.min + ctl.max) / 2;
  }

  function fmt(ctl, n) {
    return (ctl.step < 1 ? n.toFixed(2).replace(/0$/, '') : String(Math.round(n))) + ctl.unit;
  }

  /* ---------- build panel ---------- */
  const panel = document.createElement('aside');
  panel.className = 'devpanel';
  panel.hidden = true;
  panel.innerHTML = '<h2>Dev controls</h2>';

  /* ---------- scroll position readout ----------
     Which [data-scrub] section you're in and its current --p (0→1) — the
     value the page's own scroll engine writes and everything else (--t,
     --focus, --exit, per-step --k windows, etc.) derives from. Lets you
     say "at s-dreams p=0.62" instead of guessing pixels when describing
     a timing change. */
  const posBlock = document.createElement('div');
  posBlock.className = 'posblock';
  posBlock.innerHTML = `
    <div class="poslabel">Scroll position</div>
    <div class="posline"><span data-pos-section>—</span><output data-pos-p></output></div>
    <div class="posline dim">page <span data-pos-pct>0%</span></div>
    <button type="button" class="ghost small" data-copy-pos>Copy ref</button>
  `;
  panel.appendChild(posBlock);

  const posSection = posBlock.querySelector('[data-pos-section]');
  const posP = posBlock.querySelector('[data-pos-p]');
  const posPct = posBlock.querySelector('[data-pos-pct]');
  const trackedSections = [...document.querySelectorAll('section[id]')];
  let lastRef = '';

  function updatePosition() {
    const vh = innerHeight;
    const line = vh * 0.5; // "current" section = whichever crosses viewport center
    let active = trackedSections.find(s => {
      const r = s.getBoundingClientRect();
      return r.top <= line && r.bottom > line;
    });
    if (!active && trackedSections.length) {
      if (scrollY <= 0) {
        active = trackedSections[0];
      } else {
        // nearest section to the center line — never jump to the last
        // section (that made mid-page gaps look like "s-brand-closer")
        let best = null;
        let bestDist = Infinity;
        for (const s of trackedSections) {
          const r = s.getBoundingClientRect();
          const mid = (r.top + r.bottom) / 2;
          const dist = Math.abs(mid - line);
          if (dist < bestDist) { bestDist = dist; best = s; }
        }
        active = best;
      }
    }

    const scrollable = document.documentElement.scrollHeight - vh;
    const pagePct = scrollable > 0 ? Math.min(100, Math.max(0, (scrollY / scrollable) * 100)) : 0;
    posPct.textContent = Math.round(pagePct) + '%';

    if (!active) { posSection.textContent = '—'; posP.textContent = ''; lastRef = ''; return; }

    posSection.textContent = active.id;
    if (active.hasAttribute('data-scrub')) {
      const p = parseFloat(getComputedStyle(active).getPropertyValue('--p'));
      const pStr = Number.isFinite(p) ? p.toFixed(3) : '?';
      posP.textContent = 'p=' + pStr;
      lastRef = `${active.id}  p=${pStr}`;
    } else {
      posP.textContent = '';
      lastRef = active.id;
    }
  }

  let posQueued = false;
  addEventListener('scroll', () => {
    if (posQueued) return;
    posQueued = true;
    requestAnimationFrame(() => { updatePosition(); posQueued = false; });
  }, { passive: true });
  addEventListener('resize', updatePosition);
  updatePosition();

  posBlock.querySelector('[data-copy-pos]').addEventListener('click', () => {
    if (!lastRef) return;
    if (navigator.clipboard) navigator.clipboard.writeText(lastRef);
    else {
      const tmp = document.createElement('textarea');
      tmp.value = lastRef;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
    }
  });

  const outputs = new Map(); // prop -> { ctl, input, out }

  CONTROLS.forEach(ctl => {
    const row = document.createElement('div');
    row.className = 'row';
    const val = currentValue(ctl);
    row.innerHTML = `
      <label><span>${ctl.label} <small>(${ctl.prop})</small></span><output></output></label>
      <input type="range" min="${ctl.min}" max="${ctl.max}" step="${ctl.step}">
    `;
    const input = row.querySelector('input');
    const out = row.querySelector('output');
    input.value = val;
    out.textContent = fmt(ctl, val);
    root.style.setProperty(ctl.prop, fmt(ctl, val));
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      out.textContent = fmt(ctl, v);
      root.style.setProperty(ctl.prop, fmt(ctl, v));
    });
    outputs.set(ctl.prop, { ctl, input, out });
    panel.appendChild(row);
  });

  /* ---------- edit mode (contenteditable text + image URL swap) ---------- */
  const editRow = document.createElement('div');
  editRow.className = 'editrow';
  editRow.innerHTML = `
    <input type="checkbox" id="dev-edit-mode">
    <label for="dev-edit-mode">Edit mode</label>
  `;
  const editHint = document.createElement('p');
  editHint.className = 'hint';
  editHint.textContent = 'Edit mode: click text to retype it, click an image slot to paste a URL. Changes are throwaway — not saved.';
  panel.appendChild(editRow);
  panel.appendChild(editHint);

  const editToggle = editRow.querySelector('#dev-edit-mode');
  editToggle.addEventListener('change', () => {
    const on = editToggle.checked;
    document.body.toggleAttribute('data-dev-edit', on);
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = on ? 'true' : 'false';
    });
  });

  document.addEventListener('click', e => {
    if (!editToggle.checked) return;
    const slot = e.target.closest('[data-img-slot]');
    if (!slot) return;
    const url = prompt('Image URL for: ' + (slot.dataset.label || 'this slot'));
    if (!url) return;
    slot.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = slot.dataset.label || '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    slot.appendChild(img);
  });

  /* ---------- save (print values, no persistence) ---------- */
  const btns = document.createElement('div');
  btns.className = 'btns';
  btns.innerHTML = `
    <button type="button" data-save>Save → text</button>
    <button type="button" class="ghost" data-copy hidden>Copy</button>
  `;
  const ta = document.createElement('textarea');
  ta.readOnly = true;
  ta.hidden = true;
  ta.setAttribute('aria-label', 'Saved CSS variable values');
  panel.appendChild(btns);
  panel.appendChild(ta);

  btns.querySelector('[data-save]').addEventListener('click', () => {
    const lines = CONTROLS.map(ctl =>
      `${ctl.prop}: ${getComputedStyle(root).getPropertyValue(ctl.prop).trim()};`
    );
    ta.value = lines.join('\n');
    ta.hidden = false;
    btns.querySelector('[data-copy]').hidden = false;
    ta.focus();
    ta.select();
  });

  btns.querySelector('[data-copy]').addEventListener('click', () => {
    ta.select();
    if (navigator.clipboard) navigator.clipboard.writeText(ta.value);
    else document.execCommand('copy');
  });

  /* ---------- toggle button + keyboard shortcut ---------- */
  const toggle = document.createElement('button');
  toggle.id = 'devtoggle';
  toggle.type = 'button';
  toggle.textContent = '◐ dev';
  toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; });

  document.addEventListener('keydown', e => {
    if (e.key !== '`') return;
    const t = e.target;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    e.preventDefault();
    panel.hidden = !panel.hidden;
  });

  document.body.appendChild(panel);
  document.body.appendChild(toggle);
})();
