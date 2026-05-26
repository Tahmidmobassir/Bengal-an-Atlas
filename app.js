/**
 * Bengal Site — Application Logic
 *
 * Architecture:
 *   ContentRenderer        — pure function: TimelineEvent → DOM
 *   ScrollController       — Intersection Observer that fires events
 *                            as scenes enter the viewport
 *   SidePanelController    — listens to scroll events, updates metrics
 *                            with a visual flash (AI-2027-style)
 *   TrackFilter            — handles the Bangladesh / West Bengal toggle
 *   ProgressController     — top progress bar + chapter indicator
 *
 * Data structures used:
 *   - TIMELINE is an ordered Array (O(n) render, preserves chronology)
 *   - TIMELINE_INDEX is a Map (O(1) lookup by id)
 *   - Side-panel metric history is a tiny LRU-like queue
 */

// ============================================================
// 1. CONTENT RENDERING
// ============================================================
const ContentRenderer = {

  /** Render the full timeline into the #timeline container */
  renderTimeline(container) {
    const fragments = document.createDocumentFragment();
    let lastEra = null;
    let displayIndex = 0;

    TIMELINE.forEach(event => {
      if (event.era !== lastEra) {
        fragments.appendChild(this.buildChapter(event.era));
        lastEra = event.era;
      }
      displayIndex += 1;
      fragments.appendChild(this.buildScene(event, displayIndex));

      // After the 1947 partition scene, inject the dual-track selector.
      // This is the editorial moment where the two Bengals literally diverge.
      if (event.id === 'partition-1947') {
        fragments.appendChild(this.buildTrackSelector());
      }
    });

    container.appendChild(fragments);
  },

  /** Build the dual-track selector — appears once after the 1947 partition */
  buildTrackSelector() {
    const section = document.createElement('section');
    section.className = 'dual-track-intro fade-up';
    section.id = 'track-selector';
    section.innerHTML = `
      <div class="eyebrow" style="margin-bottom: 1.5rem;">A fork in the road</div>
      <h2>From here, two countries.</h2>
      <p style="max-width: 60ch; margin: 0 auto 2rem; color: var(--ink-soft); font-size: 1.1rem; line-height: 1.6;">
        After 1947 the Bengali people are governed by two states with two flags, two scripts of nationalism,
        two political grammars. Some scenes ahead are shared (the language movement, the diaspora) but most
        belong to one Bengal or the other. You can read both, or filter by one.
      </p>
      <div class="track-selector" role="tablist" aria-label="Filter timeline by Bengal">
        <button data-track="both" class="active" role="tab">Both Bengals</button>
        <button data-track="bangladesh" role="tab">Bangladesh →</button>
        <button data-track="west-bengal" role="tab">← West Bengal</button>
      </div>
    `;
    return section;
  },

  /** Build a chapter divider for an era */
  buildChapter(eraId) {
    const era = ERAS.find(e => e.id === eraId);
    if (!era) return document.createDocumentFragment();

    const section = document.createElement('section');
    section.className = 'chapter fade-up';
    section.dataset.era = eraId;
    section.id = `chapter-${eraId}`;
    section.innerHTML = `
      <div class="chapter-mark">Chapter · ${era.label}</div>
      <h2 class="chapter-title">${era.label}</h2>
      <div class="chapter-range">${era.range}</div>
      ${era.kicker ? `<p class="chapter-kicker">${era.kicker}</p>` : ''}
    `;
    return section;
  },

  /** Build a single scene from a TimelineEvent */
  buildScene(event, displayIndex) {
    const section = document.createElement('section');
    section.className = 'scene fade-up';
    section.dataset.track = event.track;
    section.dataset.year = event.year;
    section.dataset.eventId = event.id;
    section.dataset.era = event.era;
    section.id = `scene-${event.id}`;

    const trackLabel = {
      'shared':      'Both Bengals',
      'bangladesh':  'Bangladesh',
      'west-bengal': 'West Bengal'
    }[event.track];

    section.innerHTML = `
      <div class="scene-prose">
        <div class="scene-meta">
          <span class="order">${String(displayIndex).padStart(2, '0')}</span>
          <span class="date">${event.dateDisplay}</span>
          <span class="track-tag">${trackLabel}</span>
        </div>
        <h2 class="scene-title">${event.title}</h2>
        <p class="scene-subtitle">${event.subtitle}</p>
        <p class="scene-summary">${event.summary}</p>
        <div class="scene-body">
          ${event.body.map((p, i) =>
            `<p${i === 0 ? ' class="drop-cap"' : ''}>${p}</p>`
          ).join('')}
        </div>
        ${event.quote ? `
          <div class="scene-quote">
            <blockquote>
              ${event.quote}
              <cite>— ${event.quoteAuthor}</cite>
            </blockquote>
          </div>
        ` : ''}
        ${event.disputed ? `
          <div class="scene-disputed">
            <strong>Disputed</strong>
            ${event.disputed}
          </div>
        ` : ''}
      </div>
      <aside class="scene-media">
        ${this.buildMediaCard(event)}
        ${this.buildMetricGrid(event.metrics)}
        ${this.buildSources(event.sources)}
      </aside>
    `;
    return section;
  },

  /** Build the visual for a scene — uses a real image if provided, else the themed SVG */
  buildMediaCard(event) {
    const m = event.media?.[0] || {};
    // Real image path takes precedence
    if (m.image) {
      const credit = m.credit ? `<div class="media-credit">${m.credit}</div>` : '';
      const caption = m.caption ? `<div class="media-caption">${m.caption}</div>` : '';
      const fallbackId = `media-fb-${event.id}`;
      const fallbackSvg = SceneIllustration.render(m.motif || 'default', event);
      // If the image fails to load, replace the entire media-card content with the SVG fallback
      // (this also removes the caption/credit overlays that wouldn't make sense without the photo)
      const onErr = `var c=this.closest('.media-card');var f=document.getElementById('${fallbackId}');if(c&&f){c.innerHTML=f.innerHTML;}`;
      return `
        <div class="media-card">
          <img src="${m.image}"
               alt="${m.caption || event.title}"
               loading="lazy"
               onerror="${onErr}">
          ${caption}
          ${credit}
          <template id="${fallbackId}">${fallbackSvg}</template>
        </div>
      `;
    }
    // No image — fall through to the SVG illustration
    return `<div class="media-card">${SceneIllustration.render(m.motif || 'default', event)}</div>`;
  },

  buildMetricGrid(metrics) {
    if (!metrics || Object.keys(metrics).length === 0) return '';
    return `
      <div class="metric-grid">
        ${Object.entries(metrics).map(([k, v]) => `
          <div class="metric-cell">
            <div class="metric-label">${this.humanize(k)}</div>
            <div class="metric-value">${v}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  buildSources(sources) {
    if (!sources?.length) return '';
    return `
      <div class="scene-sources">
        <strong>Sources</strong>
        ${sources.join(' · ')}
      </div>
    `;
  },

  humanize(camel) {
    return camel.replace(/([A-Z])/g, ' $1')
                .replace(/^./, c => c.toUpperCase())
                .trim();
  }
};

// ============================================================
// 2. SCENE ILLUSTRATIONS — custom SVG per motif
// ============================================================
// Each motif is an SVG that represents the scene visually.
// They're hand-authored, themed to the period, and use the
// CSS palette via currentColor and CSS variables.
const SceneIllustration = {

  render(motif, event) {
    const renderer = this[motif] || this.default;
    return renderer.call(this, event);
  },

  // 1. Chalcolithic — terracotta pottery pattern
  'terracotta-pottery'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#D6CBB1"/>
      <g transform="translate(200,250)">
        <ellipse cx="0" cy="60" rx="85" ry="20" fill="#1A1410" opacity="0.15"/>
        <path d="M -75 -80 Q -75 -110 -50 -110 L 50 -110 Q 75 -110 75 -80 L 75 30 Q 75 65 0 65 Q -75 65 -75 30 Z"
              fill="#B5532A"/>
        <path d="M -75 -80 Q -75 -110 -50 -110 L 50 -110 Q 75 -110 75 -80 L 75 30 Q 75 65 0 65 Q -75 65 -75 30 Z"
              fill="none" stroke="#1A1410" stroke-width="1.5" opacity="0.4"/>
        <line x1="-75" y1="-55" x2="75" y2="-55" stroke="#1A1410" stroke-width="1" opacity="0.4"/>
        <line x1="-75" y1="-30" x2="75" y2="-30" stroke="#1A1410" stroke-width="1" opacity="0.4"/>
        <g stroke="#1A1410" stroke-width="0.8" opacity="0.5" fill="none">
          <path d="M -70 -45 Q -60 -50 -50 -45 T -30 -45 T -10 -45 T 10 -45 T 30 -45 T 50 -45 T 70 -45"/>
        </g>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">PANDU RAJAR DHIBI</text>
        <text x="20" y="480">c. 1600–1400 BCE</text>
      </g>
    </svg>`;
  },

  'elephant-frieze'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1F3A5F"/>
      <g transform="translate(0,200)" fill="#B8923B">
        <!-- Stylized elephant silhouette -->
        <path d="M 80 80 Q 80 50 110 50 L 200 50 Q 250 50 260 80 L 280 80 Q 295 80 295 95 L 290 105 Q 290 120 275 120 L 270 145 L 255 145 L 255 130 L 200 130 L 200 145 L 185 145 L 185 130 Q 150 130 130 125 L 120 145 L 105 145 L 105 130 Q 90 125 80 110 Q 75 95 80 80 Z"/>
        <!-- Trunk -->
        <path d="M 80 95 Q 60 100 55 115 Q 55 125 65 125 Q 75 120 75 105" />
        <!-- Tusk -->
        <path d="M 75 110 L 90 120 L 85 122 Z" fill="#F1EADA"/>
        <!-- Eye -->
        <circle cx="105" cy="80" r="2" fill="#1F3A5F"/>
      </g>
      <g fill="#B8923B" opacity="0.3">
        <circle cx="60" cy="100" r="2"/>
        <circle cx="340" cy="180" r="2"/>
        <circle cx="80" cy="350" r="2"/>
        <circle cx="320" cy="380" r="2"/>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">GANGARIDAI</text>
        <text x="20" y="480">4,000 WAR ELEPHANTS</text>
      </g>
    </svg>`;
  },

  'mauryan-coin'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <g transform="translate(200,250)">
        <circle r="120" fill="#B8923B" opacity="0.9"/>
        <circle r="120" fill="none" stroke="#8E3E1F" stroke-width="2"/>
        <circle r="105" fill="none" stroke="#1A1410" stroke-width="0.5" opacity="0.4"/>
        <!-- Punch-marks -->
        <g fill="#1A1410" opacity="0.6">
          <circle cx="-40" cy="-30" r="14"/>
          <path d="M 30 -40 L 50 -20 L 30 0 L 10 -20 Z"/>
          <rect x="-15" y="20" width="30" height="20"/>
          <circle cx="40" cy="35" r="10"/>
          <path d="M -50 30 L -30 30 L -40 50 Z"/>
        </g>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">MAHASTHANGARH</text>
        <text x="20" y="480">PUNCH-MARKED · MAURYAN</text>
      </g>
    </svg>`;
  },

  'pala-bronze-buddha'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#B8923B"/>
          <stop offset="100%" stop-color="#6B4F1F"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Halo -->
      <circle cx="200" cy="180" r="100" fill="none" stroke="url(#bronze)" stroke-width="1.5" opacity="0.6"/>
      <circle cx="200" cy="180" r="80" fill="none" stroke="url(#bronze)" stroke-width="0.5" opacity="0.4"/>
      <!-- Buddha silhouette -->
      <g fill="url(#bronze)">
        <!-- Head -->
        <ellipse cx="200" cy="170" rx="42" ry="50"/>
        <!-- Ushnisha -->
        <ellipse cx="200" cy="125" rx="15" ry="20"/>
        <!-- Body in lotus pose -->
        <path d="M 145 220 Q 145 200 200 200 Q 255 200 255 220 L 270 290 Q 280 330 200 340 Q 120 330 130 290 Z"/>
        <!-- Lotus throne -->
        <path d="M 110 340 Q 100 360 110 380 L 140 365 Q 170 360 200 360 Q 230 360 260 365 L 290 380 Q 300 360 290 340 Z"/>
        <path d="M 130 360 L 150 370 M 170 360 L 180 372 M 230 360 L 220 372 M 270 360 L 250 370" stroke="#1A1410" stroke-width="0.8" fill="none" opacity="0.4"/>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">PALA BRONZE</text>
        <text x="20" y="480">SOMAPURA · NALANDA · VIKRAMASHILA</text>
      </g>
    </svg>`;
  },

  'khalji-coin'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#3A2E24"/>
      <g transform="translate(200,250)">
        <circle r="130" fill="#B8923B"/>
        <circle r="130" fill="none" stroke="#1A1410" stroke-width="2"/>
        <circle r="115" fill="none" stroke="#1A1410" stroke-width="0.5"/>
        <!-- Faux Arabic calligraphy as decorative curves -->
        <g fill="none" stroke="#1A1410" stroke-width="2.5" stroke-linecap="round">
          <path d="M -70 -10 Q -50 -30 -20 -20 Q 10 -10 30 -25 Q 50 -35 75 -20"/>
          <path d="M -70 20 Q -50 35 -20 25 Q 0 18 20 30 Q 40 40 70 25"/>
          <path d="M -55 -55 Q -30 -55 -10 -50 M 10 -50 Q 30 -55 55 -55"/>
          <path d="M -55 55 Q -30 60 -10 55 M 10 55 Q 30 60 55 55"/>
        </g>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">601 AH · 1204 CE</text>
        <text x="20" y="480">GHURID GOLD TANKA · LAKHNAUTI</text>
      </g>
    </svg>`;
  },

  'adina-mosque'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Mosque silhouette: domes + arches -->
      <g fill="#B5532A">
        <!-- Multiple domes (Adina had 350) -->
        <ellipse cx="120" cy="270" rx="30" ry="25"/>
        <ellipse cx="200" cy="260" rx="45" ry="38"/>
        <ellipse cx="280" cy="270" rx="30" ry="25"/>
        <!-- Mihrab arches -->
        <path d="M 70 360 L 70 300 Q 70 280 90 280 Q 110 280 110 300 L 110 360 Z" fill="#3A2E24"/>
        <path d="M 130 360 L 130 290 Q 130 265 165 265 Q 200 265 200 290 L 200 360 Z" fill="#3A2E24"/>
        <path d="M 220 360 L 220 290 Q 220 265 255 265 Q 290 265 290 290 L 290 360 Z" fill="#3A2E24"/>
        <path d="M 310 360 L 310 300 Q 310 280 330 280 Q 350 280 350 300 L 350 360 Z" fill="#3A2E24"/>
        <!-- Platform -->
        <rect x="50" y="360" width="310" height="40"/>
        <!-- Pinnacles -->
        <path d="M 200 222 L 195 240 L 205 240 Z" fill="#B8923B"/>
        <circle cx="200" cy="218" r="3" fill="#B8923B"/>
      </g>
      <!-- Decorative carving line -->
      <g stroke="#1A1410" stroke-width="0.5" opacity="0.3" fill="none">
        <path d="M 50 405 L 360 405"/>
        <path d="M 50 412 L 360 412"/>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">BENGAL SULTANATE</text>
        <text x="20" y="480">ADINA MASJID · 350 DOMES · 1368</text>
      </g>
    </svg>`;
  },

  'river-shift'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Old river course (faded) -->
      <path d="M 200 50 Q 180 150 150 220 Q 120 300 100 400 Q 90 450 80 480"
            stroke="#5C4E3F" stroke-width="3" fill="none" opacity="0.25" stroke-dasharray="6 4"/>
      <!-- New river course (Padma channel — eastward) -->
      <path d="M 200 50 Q 210 130 240 200 Q 280 280 310 360 Q 330 430 340 480"
            stroke="#1F3A5F" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Arrow showing shift -->
      <g stroke="#B5532A" stroke-width="2" fill="none">
        <path d="M 130 280 Q 200 280 270 280" stroke-dasharray="3 3"/>
        <path d="M 260 273 L 275 280 L 260 287" fill="#B5532A"/>
      </g>
      <text x="200" y="270" text-anchor="middle" font-family="Fraunces, serif"
            font-style="italic" font-size="13" fill="#B5532A">eastward</text>
      <!-- Dhaka marker -->
      <g transform="translate(280,300)">
        <circle r="4" fill="#1A1410"/>
        <text x="10" y="4" font-family="JetBrains Mono, monospace" font-size="10" fill="#1A1410">DHAKA</text>
      </g>
      <!-- Old capital -->
      <g transform="translate(120,260)" opacity="0.5">
        <circle r="3" fill="#5C4E3F"/>
        <text x="-50" y="4" font-family="JetBrains Mono, monospace" font-size="9" fill="#5C4E3F">GAUR</text>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">16TH C. RIVER SHIFT</text>
        <text x="20" y="480">GANGES → PADMA CHANNEL</text>
      </g>
    </svg>`;
  },

  // Nawabs of Murshidabad — silver rupee with Persian-style calligraphy,
  // set against the silhouette of the Murshidabad palace skyline by the
  // Bhagirathi river. Indigo + gold palette signals the wealth of
  // independent Bengal in the early 18th century before Plassey.
  'nawabs-murshidabad'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1F3A5F"/>

      <!-- Faint Bhagirathi river wave at bottom -->
      <g fill="none" stroke="#B8923B" stroke-width="0.6" opacity="0.4">
        <path d="M 0 420 Q 50 410 100 420 T 200 420 T 300 420 T 400 420"/>
        <path d="M 0 432 Q 50 422 100 432 T 200 432 T 300 432 T 400 432"/>
        <path d="M 0 444 Q 50 434 100 444 T 200 444 T 300 444 T 400 444"/>
      </g>

      <!-- Murshidabad palace skyline silhouette (Hazarduari-inspired) -->
      <g fill="#0E1F36" opacity="0.85">
        <!-- Main palace block -->
        <rect x="80" y="370" width="240" height="50"/>
        <!-- Columned facade hint -->
        <g fill="#1F3A5F">
          <rect x="100" y="380" width="6" height="30"/>
          <rect x="125" y="380" width="6" height="30"/>
          <rect x="150" y="380" width="6" height="30"/>
          <rect x="175" y="380" width="6" height="30"/>
          <rect x="200" y="380" width="6" height="30"/>
          <rect x="225" y="380" width="6" height="30"/>
          <rect x="250" y="380" width="6" height="30"/>
          <rect x="275" y="380" width="6" height="30"/>
          <rect x="295" y="380" width="6" height="30"/>
        </g>
        <!-- Central dome -->
        <path d="M 170 370 Q 170 340 200 340 Q 230 340 230 370 Z"/>
        <!-- Side domes -->
        <ellipse cx="120" cy="370" rx="14" ry="10"/>
        <ellipse cx="280" cy="370" rx="14" ry="10"/>
        <!-- Pinnacle on central dome -->
        <rect x="199" y="328" width="2" height="14"/>
        <circle cx="200" cy="326" r="2.5" fill="#B8923B"/>
      </g>

      <!-- The coin: a silver rupee of the Nawab era -->
      <g transform="translate(200,200)">
        <!-- Outer rim (silver, edged with gold accent) -->
        <circle r="105" fill="#C9C3B0"/>
        <circle r="105" fill="none" stroke="#B8923B" stroke-width="1.6"/>
        <circle r="98" fill="none" stroke="#5C4E3F" stroke-width="0.4" opacity="0.6"/>
        <circle r="92" fill="none" stroke="#5C4E3F" stroke-width="0.3" opacity="0.4"/>

        <!-- Inner field with subtle texture -->
        <circle r="88" fill="#D6CFBA"/>

        <!-- Faux Persian calligraphy: three horizontal lines of stylised script -->
        <g fill="none" stroke="#1A1410" stroke-width="1.8" stroke-linecap="round" opacity="0.85">
          <!-- Line 1 (top): sweeping nasta'liq curves -->
          <path d="M -62 -45 Q -45 -55 -25 -50 Q -10 -45 5 -52 Q 22 -58 40 -50 Q 55 -45 65 -52"/>
          <path d="M -55 -38 Q -50 -32 -45 -38"/>
          <path d="M 35 -38 Q 40 -32 45 -38"/>
          <!-- Line 2 (middle): ruler's name area -->
          <path d="M -68 0 Q -50 -8 -30 -3 Q -15 0 0 -8 Q 15 -14 35 -6 Q 55 0 70 -8"/>
          <path d="M -40 6 L -32 6 M -10 6 L 0 6 M 25 6 L 35 6"/>
          <!-- Line 3 (bottom): date AH (faux) -->
          <path d="M -50 38 Q -35 45 -20 40 Q 0 35 20 42 Q 35 47 55 40"/>
        </g>

        <!-- Decorative arabesque at top and bottom of inner field -->
        <g fill="#1A1410" opacity="0.5">
          <circle cx="0" cy="-72" r="1.5"/>
          <circle cx="-12" cy="-70" r="1"/>
          <circle cx="12" cy="-70" r="1"/>
          <circle cx="0" cy="72" r="1.5"/>
          <circle cx="-12" cy="70" r="1"/>
          <circle cx="12" cy="70" r="1"/>
        </g>

        <!-- Crescent finial top -->
        <path d="M -8 -82 A 8 8 0 0 1 8 -82 A 6 6 0 0 0 -8 -82 Z" fill="#B8923B"/>
      </g>

      <!-- Date plate floating beside the coin -->
      <g transform="translate(60,200)" font-family="JetBrains Mono, monospace" fill="#B8923B" opacity="0.9">
        <text x="0" y="0" font-size="11" letter-spacing="2">1129 AH</text>
        <text x="0" y="14" font-size="9" letter-spacing="2" opacity="0.7">1717 CE</text>
      </g>

      <!-- Caption -->
      <text x="200" y="478" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#F1EADA" opacity="0.9">"In Bengal\u2019s richest century, the Mughal got tribute and nothing else."</text>

      <!-- Meta tags -->
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">MURSHIDABAD · NAWAB NAZIM</text>
      </g>
    </svg>`;
  },

  'plassey-mango-grove'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Mango trees in rows -->
      <g>
        ${Array.from({length: 12}).map((_, i) => {
          const x = 50 + (i % 4) * 100;
          const y = 200 + Math.floor(i / 4) * 80;
          return `<g transform="translate(${x},${y})">
            <rect x="-2" y="0" width="4" height="20" fill="#3A2E24"/>
            <ellipse cx="0" cy="-5" rx="22" ry="18" fill="#2E5A4B" opacity="0.85"/>
          </g>`;
        }).join('')}
      </g>
      <!-- Cannon -->
      <g transform="translate(200,140)" fill="#1A1410">
        <rect x="-30" y="0" width="60" height="14" rx="2"/>
        <circle cx="-26" cy="20" r="8" fill="none" stroke="#1A1410" stroke-width="2"/>
        <circle cx="26" cy="20" r="8" fill="none" stroke="#1A1410" stroke-width="2"/>
      </g>
      <!-- Smoke -->
      <g fill="#5C4E3F" opacity="0.3">
        <circle cx="240" cy="120" r="10"/>
        <circle cx="255" cy="110" r="8"/>
        <circle cx="270" cy="115" r="6"/>
      </g>
      <!-- Rain streaks -->
      <g stroke="#1F3A5F" stroke-width="1" opacity="0.3">
        ${Array.from({length: 30}).map((_, i) =>
          `<line x1="${10 + i * 13}" y1="60" x2="${i * 13}" y2="100"/>`
        ).join('')}
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">23 JUNE 1757</text>
        <text x="20" y="480">PALASHI · 50,000 vs 3,000</text>
      </g>
    </svg>`;
  },

  'indigo-revolt'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#122340"/>
      <!-- Indigo vat -->
      <g transform="translate(200,260)">
        <ellipse cx="0" cy="60" rx="80" ry="15" fill="#1A1410" opacity="0.4"/>
        <path d="M -85 -60 L 85 -60 L 75 60 L -75 60 Z" fill="#1F3A5F"/>
        <ellipse cx="0" cy="-60" rx="85" ry="15" fill="#0a1428"/>
        <!-- Indigo liquid surface ripples -->
        <ellipse cx="0" cy="-60" rx="70" ry="10" fill="none" stroke="#B8923B" stroke-width="0.5" opacity="0.5"/>
        <ellipse cx="0" cy="-60" rx="50" ry="7" fill="none" stroke="#B8923B" stroke-width="0.5" opacity="0.4"/>
      </g>
      <!-- Currency overlay -->
      <g transform="translate(80,100)" opacity="0.5">
        <rect width="80" height="40" rx="2" fill="#B8923B" opacity="0.3"/>
        <text x="40" y="26" text-anchor="middle" font-family="Fraunces, serif" font-size="14" fill="#B8923B">£45T</text>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">COMPANY RULE</text>
        <text x="20" y="480">1770 FAMINE · INDIGO · PERMANENT SETTLEMENT</text>
      </g>
    </svg>`;
  },

  'tagore-portrait'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Stylized Tagore silhouette -->
      <g transform="translate(200,200)">
        <!-- Beard -->
        <path d="M -60 30 Q -50 100 -20 120 Q 0 130 20 120 Q 50 100 60 30 Q 70 -20 50 -40 Q 30 -60 0 -60 Q -30 -60 -50 -40 Q -70 -20 -60 30 Z"
              fill="#F1EADA"/>
        <!-- Forehead -->
        <path d="M -60 -30 Q -60 -70 0 -80 Q 60 -70 60 -30 L 50 -40 Q 30 -55 0 -55 Q -30 -55 -50 -40 Z"
              fill="#F1EADA"/>
        <!-- Eyes -->
        <g fill="#1A1410">
          <ellipse cx="-22" cy="-15" rx="5" ry="3"/>
          <ellipse cx="22" cy="-15" rx="5" ry="3"/>
        </g>
        <!-- Hair -->
        <path d="M -65 -55 Q -70 -90 -40 -100 Q 0 -110 40 -100 Q 70 -90 65 -55 L 60 -30 Q 60 -70 0 -80 Q -60 -70 -60 -30 Z"
              fill="#F1EADA"/>
      </g>
      <!-- Bangla calligraphy "Tagore" -->
      <text x="200" y="380" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="28" fill="#B8923B">রবীন্দ্রনাথ</text>
      <text x="200" y="410" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="14" fill="#F1EADA" opacity="0.7">First non-European Nobel · 1913</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">BENGAL RENAISSANCE</text>
        <text x="20" y="480">TAGORE · BOSE · VIDYASAGAR · ROY</text>
      </g>
    </svg>`;
  },

  'swadeshi-flag'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Three-band Swadeshi flag (1906 Calcutta) -->
      <g transform="translate(100,140)">
        <rect width="200" height="50" fill="#2E5A4B"/>
        <rect y="50" width="200" height="50" fill="#B8923B"/>
        <rect y="100" width="200" height="50" fill="#B5532A"/>
        <!-- Lotuses on green band -->
        <g fill="#F1EADA" opacity="0.9">
          <circle cx="40" cy="25" r="4"/><circle cx="80" cy="25" r="4"/>
          <circle cx="120" cy="25" r="4"/><circle cx="160" cy="25" r="4"/>
        </g>
        <!-- Sun and moon on middle -->
        <circle cx="60" cy="75" r="12" fill="#F1EADA"/>
        <path d="M 130 65 Q 150 75 130 85 Q 145 75 130 65" fill="#F1EADA"/>
        <!-- Vande Mataram on red -->
        <text x="100" y="135" text-anchor="middle" font-family="Hind Siliguri, serif"
              font-size="16" fill="#F1EADA">বন্দে মাতরম্</text>
      </g>
      <!-- Pole -->
      <rect x="98" y="140" width="3" height="200" fill="#3A2E24"/>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">SWADESHI 1905</text>
        <text x="20" y="480">CURZON PARTITIONS BENGAL</text>
      </g>
    </svg>`;
  },

  'famine-figure'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#3A2E24"/>
      <!-- Empty rice bowl -->
      <g transform="translate(200,260)">
        <ellipse cx="0" cy="40" rx="80" ry="15" fill="#1A1410"/>
        <path d="M -80 0 Q -80 40 0 40 Q 80 40 80 0 Z" fill="#5C4E3F"/>
        <ellipse cx="0" cy="0" rx="80" ry="20" fill="#1A1410"/>
        <ellipse cx="0" cy="0" rx="65" ry="15" fill="#3A2E24"/>
      </g>
      <!-- Counter -->
      <g transform="translate(200,400)">
        <text text-anchor="middle" font-family="Fraunces, serif" font-size="40" fill="#C0392B" font-style="italic">3,000,000</text>
        <text text-anchor="middle" y="22" font-family="JetBrains Mono, monospace" font-size="9" fill="#F1EADA" letter-spacing="3" opacity="0.6">DEAD · POLICY · NOT DROUGHT</text>
      </g>
      <!-- Rain (above-normal monsoon — the famine without drought) -->
      <g stroke="#1F3A5F" stroke-width="0.8" opacity="0.4">
        ${Array.from({length: 40}).map((_, i) =>
          `<line x1="${i * 10}" y1="50" x2="${i * 10 - 15}" y2="120"/>`
        ).join('')}
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">BENGAL FAMINE 1943</text>
      </g>
    </svg>`;
  },

  'radcliffe-line'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Stylized Bengal outline split -->
      <g transform="translate(200,250)">
        <!-- West Bengal mass (left) -->
        <path d="M -160 -100 Q -180 -50 -170 50 Q -160 120 -120 150 L -20 150 L -20 -100 Z"
              fill="#B5532A" opacity="0.85"/>
        <!-- East Bengal mass (right) -->
        <path d="M 20 -100 L 160 -80 Q 180 0 170 80 Q 150 140 100 160 L 20 160 Z"
              fill="#2E5A4B" opacity="0.85"/>
        <!-- The Radcliffe Line -->
        <line x1="0" y1="-100" x2="0" y2="160" stroke="#1A1410" stroke-width="2" stroke-dasharray="8 4"/>
        <!-- Labels -->
        <text x="-90" y="20" text-anchor="middle" font-family="Fraunces, serif" font-size="14" font-style="italic" fill="#F1EADA">West Bengal</text>
        <text x="-90" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#F1EADA">70.8% Hindu</text>
        <text x="90" y="20" text-anchor="middle" font-family="Fraunces, serif" font-size="14" font-style="italic" fill="#F1EADA">East Bengal</text>
        <text x="90" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#F1EADA">71% Muslim</text>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">14–15 AUGUST 1947</text>
        <text x="20" y="480">CYRIL RADCLIFFE · 5 WEEKS · NEVER VISITED</text>
      </g>
    </svg>`;
  },

  'shaheed-minar'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Central pillar with bowed pillars around -->
      <g transform="translate(200,360)">
        <!-- Platform -->
        <rect x="-140" y="-10" width="280" height="20" fill="#F1EADA"/>
        <!-- Central pillar -->
        <rect x="-15" y="-200" width="30" height="200" fill="#F1EADA"/>
        <!-- Sun disc -->
        <circle cx="0" cy="-210" r="32" fill="#C0392B"/>
        <!-- Bowed pillars on left -->
        <path d="M -80 0 L -85 -120 Q -85 -135 -75 -130 L -65 0 Z" fill="#F1EADA"/>
        <path d="M -45 0 L -50 -160 Q -50 -175 -40 -170 L -30 0 Z" fill="#F1EADA"/>
        <!-- Bowed pillars on right -->
        <path d="M 30 0 L 40 -170 Q 50 -175 50 -160 L 45 0 Z" fill="#F1EADA"/>
        <path d="M 65 0 L 75 -130 Q 85 -135 85 -120 L 80 0 Z" fill="#F1EADA"/>
      </g>
      <!-- Flowers at the foot -->
      <g transform="translate(200,380)" fill="#C0392B">
        <circle cx="-50" cy="5" r="4"/>
        <circle cx="-30" cy="8" r="3"/>
        <circle cx="-10" cy="6" r="4"/>
        <circle cx="10" cy="7" r="3"/>
        <circle cx="30" cy="5" r="4"/>
        <circle cx="50" cy="8" r="3"/>
      </g>
      <text x="200" y="60" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="22" fill="#F1EADA">একুশে ফেব্রুয়ারি</text>
      <text x="200" y="85" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="12" fill="#F1EADA" opacity="0.7">21 February</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">LANGUAGE MARTYRS · 1952</text>
        <text x="20" y="480">INTERNATIONAL MOTHER LANGUAGE DAY</text>
      </g>
    </svg>`;
  },

  // Bhashani — the Red Maulana addressing a peasant rally.
  // Stylised silhouette: the iconic figure in a homespun lungi and
  // pointed cap (Bhashani's signature), one arm raised, addressing a
  // crowd indicated by a band of shoulders and turbans. Red flag in
  // the background. Three pivotal years stamped down the right edge:
  // 1949 Awami League founding, 1957 NAP, 1969 mass uprising.
  'bhashani-rally'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>

      <!-- Red flag (the Red Maulana) -->
      <g transform="translate(310,60)">
        <!-- Flagpole -->
        <rect x="0" y="0" width="2" height="220" fill="#3A2E24"/>
        <!-- Flag itself, waving -->
        <path d="M 2 6 L 70 6 Q 78 18 70 30 L 76 42 Q 80 54 70 64 L 2 60 Z" fill="#C0392B"/>
        <!-- Faint star (a tiny socialist suggestion) -->
        <g transform="translate(35,33)" fill="#F1EADA" opacity="0.8">
          <polygon points="0,-7 2,-2 7,-2 3,1 4,7 0,3 -4,7 -3,1 -7,-2 -2,-2"/>
        </g>
      </g>

      <!-- Crowd in the background: rows of shoulders & turbans -->
      <g opacity="0.45">
        <!-- Far back row -->
        <g fill="#5C4E3F">
          ${Array.from({length: 14}).map((_,i) =>
            `<circle cx="${30 + i*26}" cy="380" r="6"/>` +
            `<rect x="${24 + i*26}" y="385" width="12" height="20" rx="2"/>`
          ).join('')}
        </g>
        <!-- Mid row -->
        <g fill="#3A2E24">
          ${Array.from({length: 10}).map((_,i) =>
            `<circle cx="${50 + i*36}" cy="405" r="8"/>` +
            `<rect x="${42 + i*36}" y="412" width="16" height="28" rx="2"/>`
          ).join('')}
        </g>
        <!-- Front row -->
        <g fill="#1A1410">
          ${Array.from({length: 7}).map((_,i) =>
            `<circle cx="${70 + i*52}" cy="440" r="10"/>` +
            `<rect x="${60 + i*52}" y="450" width="20" height="40" rx="2"/>`
          ).join('')}
        </g>
      </g>

      <!-- Bhashani: a tall, austere figure addressing the crowd -->
      <g transform="translate(160,210)">
        <!-- Robe / lungi (homespun white) -->
        <path d="M -38 60 L -36 200 L -28 215 L 28 215 L 36 200 L 38 60 Q 38 50 28 50 L -28 50 Q -38 50 -38 60 Z"
              fill="#F1EADA" stroke="#5C4E3F" stroke-width="1.2"/>
        <!-- Sash / waistcloth -->
        <path d="M -40 110 L 40 110 L 38 120 L -38 120 Z" fill="#8E3E1F" opacity="0.7"/>

        <!-- Right arm raised in oratorical gesture -->
        <path d="M 30 60 Q 60 50 75 20 Q 80 8 78 -2 L 72 -2 Q 74 8 70 18 Q 60 38 30 50 Z"
              fill="#D6CFBA" stroke="#5C4E3F" stroke-width="1"/>
        <!-- Left arm relaxed, holding a stick -->
        <path d="M -32 60 L -42 130 L -38 132 L -28 65 Z" fill="#D6CFBA" stroke="#5C4E3F" stroke-width="1"/>
        <line x1="-40" y1="100" x2="-40" y2="200" stroke="#3A2E24" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Beard -->
        <path d="M -16 -2 Q -18 30 -8 38 L 8 38 Q 18 30 16 -2 Q 14 14 0 16 Q -14 14 -16 -2 Z"
              fill="#F1EADA" stroke="#5C4E3F" stroke-width="1"/>

        <!-- Head -->
        <ellipse cx="0" cy="-15" rx="20" ry="24" fill="#D6CFBA" stroke="#5C4E3F" stroke-width="1.2"/>

        <!-- Iconic pointed/dome topi (cap) — Bhashani's signature -->
        <path d="M -22 -30 Q -22 -56 0 -56 Q 22 -56 22 -30 Z" fill="#1A1410"/>
        <ellipse cx="0" cy="-30" rx="22" ry="3" fill="#1A1410"/>

        <!-- Eyes hint -->
        <circle cx="-7" cy="-18" r="1.2" fill="#1A1410"/>
        <circle cx="7" cy="-18" r="1.2" fill="#1A1410"/>
      </g>

      <!-- Year stamps cascading down right side -->
      <g font-family="JetBrains Mono, monospace" fill="#8E3E1F">
        <text x="320" y="295" font-size="11" letter-spacing="2" font-weight="500">1949</text>
        <text x="320" y="308" font-size="7" letter-spacing="1.5" opacity="0.7">AWAMI LEAGUE</text>

        <text x="320" y="328" font-size="11" letter-spacing="2" font-weight="500">1957</text>
        <text x="320" y="341" font-size="7" letter-spacing="1.5" opacity="0.7">NAP · KAGMARI</text>

        <text x="320" y="361" font-size="11" letter-spacing="2" font-weight="500">1969</text>
        <text x="320" y="374" font-size="7" letter-spacing="1.5" opacity="0.7">MASS UPRISING</text>
      </g>

      <!-- Bangla label -->
      <text x="200" y="470" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="22" fill="#8E3E1F">লাল মাওলানা</text>
      <text x="200" y="488" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="11" fill="#5C4E3F" opacity="0.85">The Red Maulana · Leader of the Oppressed</text>

      <!-- Meta tag top-left -->
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">BHASHANI · 1880\u20131976</text>
      </g>
    </svg>`;
  },

  'cyclone-spiral'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#122340"/>
      <!-- Spiral storm -->
      <g transform="translate(200,250)" fill="none" stroke="#F1EADA" stroke-width="1.5" opacity="0.9">
        <path d="M 0 0 Q 30 -10 50 10 Q 60 30 40 50 Q 10 60 -10 40 Q -25 10 -5 -10 Q 15 -20 30 -5"/>
        <path d="M 0 0 Q 60 -20 100 20 Q 120 60 80 100 Q 20 120 -20 80 Q -50 20 -10 -20 Q 30 -40 60 -10"/>
        <path d="M 0 0 Q 90 -30 150 30 Q 180 90 120 150 Q 30 180 -30 120 Q -75 30 -15 -30 Q 45 -60 90 -15"/>
        <circle r="6" fill="#F1EADA"/>
      </g>
      <text x="200" y="430" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="28" fill="#F1EADA">500,000</text>
      <text x="200" y="455" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#F1EADA" letter-spacing="3" opacity="0.6">DEAD IN ONE NIGHT · 185 KM/H</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">BHOLA CYCLONE · 12 NOV 1970</text>
      </g>
    </svg>`;
  },

  'mukti-bahini'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Bangladesh flag -->
      <g transform="translate(200,250)">
        <rect x="-140" y="-90" width="280" height="180" fill="#006A4E"/>
        <circle r="55" fill="#C0392B"/>
      </g>
      <!-- Date -->
      <text x="200" y="400" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="22" fill="#F1EADA">16 December 1971</text>
      <text x="200" y="425" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="18" fill="#B8923B">বিজয় দিবস</text>
      <text x="200" y="445" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#F1EADA" letter-spacing="3" opacity="0.6">VICTORY DAY · BANGLADESH BORN</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">LIBERATION WAR · 9 MONTHS</text>
      </g>
    </svg>`;
  },

  // Concert for Bangladesh — 1 August 1971, Madison Square Garden.
  // Visual: a stylised vinyl record (echo of the bestselling 3-LP boxed set)
  // with the Apple Records orange-on-cream palette, the date stamped onto
  // the centre label, and "Bangla Desh" rendered as the album originally
  // spelt it. Concentric grooves do double duty as the radial echo of a
  // packed concert hall.
  'concert-bangladesh'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>

      <!-- Vinyl record -->
      <g transform="translate(200,230)">
        <!-- Outer disc -->
        <circle r="170" fill="#0E0A07"/>
        <circle r="170" fill="none" stroke="#3A2E24" stroke-width="1"/>

        <!-- Grooves (concentric arcs, slight variation) -->
        <g fill="none" stroke="#3A2E24" stroke-width="0.4" opacity="0.55">
          <circle r="160"/><circle r="152"/><circle r="144"/><circle r="136"/>
          <circle r="128"/><circle r="120"/><circle r="112"/><circle r="104"/>
          <circle r="96"/><circle r="88"/><circle r="80"/>
        </g>
        <g fill="none" stroke="#1F1612" stroke-width="0.4" opacity="0.9">
          <circle r="156"/><circle r="140"/><circle r="124"/><circle r="108"/><circle r="92"/>
        </g>

        <!-- Light reflection arc (gives the disc a slight sheen) -->
        <path d="M -150 -50 A 158 158 0 0 1 -50 -150" fill="none" stroke="#5C4E3F" stroke-width="0.8" opacity="0.4"/>

        <!-- Centre label — Apple Records orange -->
        <circle r="70" fill="#B5532A"/>
        <circle r="70" fill="none" stroke="#8E3E1F" stroke-width="1"/>
        <circle r="62" fill="none" stroke="#F1EADA" stroke-width="0.5" opacity="0.3"/>

        <!-- Label typography -->
        <text x="0" y="-32" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.5" fill="#F1EADA" letter-spacing="2" opacity="0.85">THE CONCERT FOR</text>
        <text x="0" y="-8" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-weight="600" font-size="22" fill="#F1EADA">Bangla Desh</text>
        <text x="0" y="14" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="#F1EADA" letter-spacing="2.5" opacity="0.75">MADISON SQUARE GARDEN</text>
        <text x="0" y="28" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="#F1EADA" letter-spacing="2.5" opacity="0.75">1 AUGUST 1971</text>

        <!-- Centre spindle hole -->
        <circle r="4" fill="#1A1410"/>
        <circle r="4" fill="none" stroke="#F1EADA" stroke-width="0.3" opacity="0.5"/>

        <!-- A tiny lotus motif tying the album back to Bengal -->
        <g transform="translate(0,46)" fill="#F1EADA" opacity="0.6">
          <ellipse cx="0" cy="0" rx="1.5" ry="5"/>
          <ellipse cx="0" cy="0" rx="1.5" ry="5" transform="rotate(45)"/>
          <ellipse cx="0" cy="0" rx="1.5" ry="5" transform="rotate(90)"/>
          <ellipse cx="0" cy="0" rx="1.5" ry="5" transform="rotate(135)"/>
        </g>
      </g>

      <!-- Audience dots (40,000 abstracted to a sprinkle) -->
      <g fill="#B8923B" opacity="0.35">
        <circle cx="40" cy="60" r="1.5"/>
        <circle cx="60" cy="80" r="1"/>
        <circle cx="350" cy="70" r="1.5"/>
        <circle cx="370" cy="55" r="1"/>
        <circle cx="30" cy="430" r="1.5"/>
        <circle cx="55" cy="450" r="1"/>
        <circle cx="370" cy="430" r="1.5"/>
        <circle cx="345" cy="455" r="1"/>
      </g>

      <!-- Caption block, bottom -->
      <text x="200" y="430" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="14" fill="#F1EADA" opacity="0.9">"In one day, the whole world knew the name."</text>
      <text x="200" y="450" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#B8923B" letter-spacing="3" opacity="0.75">RAVI SHANKAR · GEORGE HARRISON</text>

      <!-- Top-left meta tag -->
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">BENEFIT CONCERT · FIRST OF ITS KIND</text>
        <text x="20" y="480">40,000 SEATS · 2 SHOWS · ~$12M RAISED</text>
      </g>
    </svg>`;
  },

  'mujib-portrait'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Mujib silhouette in iconic glasses -->
      <g transform="translate(200,210)">
        <!-- Head -->
        <ellipse cx="0" cy="0" rx="55" ry="65" fill="#F1EADA"/>
        <!-- Hair -->
        <path d="M -55 -30 Q -65 -80 0 -75 Q 65 -80 55 -30 L 50 -10 Q 35 -25 0 -25 Q -35 -25 -50 -10 Z" fill="#1A1410"/>
        <!-- Glasses (his iconic black frames) -->
        <g fill="none" stroke="#1A1410" stroke-width="3">
          <rect x="-32" y="-15" width="22" height="14" rx="2"/>
          <rect x="10" y="-15" width="22" height="14" rx="2"/>
          <line x1="-10" y1="-8" x2="10" y2="-8"/>
        </g>
        <!-- Mustache -->
        <path d="M -18 20 Q -10 25 0 25 Q 10 25 18 20" stroke="#1A1410" stroke-width="3" fill="none"/>
        <!-- Body / Mujib coat -->
        <path d="M -90 90 Q -80 70 -40 60 L 40 60 Q 80 70 90 90 L 90 130 L -90 130 Z" fill="#3A2E24"/>
      </g>
      <text x="200" y="380" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="26" fill="#006A4E">বঙ্গবন্ধু</text>
      <text x="200" y="405" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#F1EADA" opacity="0.8">Bangabandhu, Friend of Bengal</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">MUJIB · 1920–1975</text>
        <text x="20" y="480">DHANMONDI 32 · 15 AUGUST 1975</text>
      </g>
    </svg>`;
  },

  'red-flag-kolkata'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Hammer and sickle stylized -->
      <g transform="translate(200,220)">
        <circle r="100" fill="#C0392B"/>
        <g transform="translate(-30,-10)" fill="#B8923B">
          <!-- Sickle blade -->
          <path d="M 0 0 Q 30 -40 70 -20 Q 60 -10 50 -20 Q 30 -30 0 0 Z"/>
          <!-- Hammer head -->
          <rect x="20" y="20" width="35" height="14" transform="rotate(45 35 25)"/>
          <!-- Handle -->
          <rect x="-5" y="0" width="3" height="50" transform="rotate(45 -3 25)"/>
        </g>
      </g>
      <text x="200" y="380" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="22" fill="#1A1410">34 years</text>
      <text x="200" y="405" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">LONGEST DEMOCRATIC COMMUNIST GOVT</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">LEFT FRONT · WEST BENGAL</text>
        <text x="20" y="480">JYOTI BASU · OPERATION BARGA</text>
      </g>
    </svg>`;
  },

  'garment-factory'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Spool/thread layered -->
      <g transform="translate(200,250)">
        ${[0, 12, 24, 36, 48, 60, 72].map(o =>
          `<ellipse cx="0" cy="${-30 + o}" rx="100" ry="6" fill="#B5532A" opacity="${0.5 + o/200}"/>`
        ).join('')}
        <rect x="-100" y="-35" width="6" height="100" fill="#3A2E24"/>
        <rect x="94" y="-35" width="6" height="100" fill="#3A2E24"/>
      </g>
      <text x="200" y="400" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="30" fill="#B5532A">$38B</text>
      <text x="200" y="425" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#5C4E3F" letter-spacing="3">EXPORTS · 5M WORKERS · 80% WOMEN</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">RMG · WORLD #2</text>
        <text x="20" y="480">DESH-DAEWOO · 1978 → 2024</text>
      </g>
    </svg>`;
  },

  // Achin Pakhi — the 2008 airport sculpture removal.
  // Visual: a Baul ektara silhouette that doubles as a cage. The bird
  // (Lalon's Moner Manush, the "unknown bird" of the famous song) has
  // already flown out. A few cage bars at one corner are tilted/snapped,
  // ropes dangling — the actual act of dismantling. Bangla title at
  // the bottom reads "আছিন পাখি" (Achin Pakhi).
  'achin-pakhi'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>

      <!-- Subtle alpana echo in the corners (very faint) -->
      <g stroke="#B5532A" stroke-width="0.4" fill="none" opacity="0.15">
        <circle cx="40" cy="60" r="20"/>
        <circle cx="40" cy="60" r="12"/>
        <circle cx="360" cy="60" r="20"/>
        <circle cx="360" cy="60" r="12"/>
      </g>

      <!-- The cage: stylised ektara-shaped, with vertical bars -->
      <g transform="translate(200,250)">
        <!-- Cage outline (rounded gourd shape echoing ektara) -->
        <path d="M -80 -90 Q -90 -50 -90 0 Q -90 60 -55 90 L 55 90 Q 90 60 90 0 Q 90 -50 80 -90 Z"
              fill="none" stroke="#1F3A5F" stroke-width="1.6" opacity="0.85"/>

        <!-- Top hoop (where the ektara string would mount) -->
        <ellipse cx="0" cy="-90" rx="40" ry="6" fill="none" stroke="#1F3A5F" stroke-width="1.4" opacity="0.85"/>

        <!-- Vertical cage bars (intact, left & centre) -->
        <g stroke="#1F3A5F" stroke-width="1.1" opacity="0.75">
          <line x1="-65" y1="-85" x2="-65" y2="80"/>
          <line x1="-45" y1="-88" x2="-45" y2="85"/>
          <line x1="-25" y1="-90" x2="-25" y2="88"/>
          <line x1="-5"  y1="-90" x2="-5"  y2="90"/>
          <line x1="15"  y1="-90" x2="15"  y2="88"/>
          <line x1="35"  y1="-88" x2="35"  y2="85"/>
        </g>

        <!-- BROKEN bars on the right side — tilted, snapped, falling out -->
        <g stroke="#B5532A" stroke-width="1.3" opacity="0.95" stroke-linecap="round">
          <!-- A bar leaning outward, broken in the middle -->
          <line x1="55" y1="-85" x2="58" y2="-15"/>
          <line x1="75" y1="20" x2="92" y2="78"/>
          <!-- A bar fully detached, falling -->
          <line x1="72" y1="-80" x2="105" y2="-40" transform="rotate(8 88 -60)"/>
        </g>

        <!-- Horizontal hoops -->
        <g fill="none" stroke="#1F3A5F" stroke-width="0.9" opacity="0.6">
          <ellipse cx="0" cy="-40" rx="86" ry="6"/>
          <ellipse cx="0" cy="20"  rx="89" ry="6"/>
          <ellipse cx="0" cy="70"  rx="65" ry="5"/>
        </g>

        <!-- The empty silhouette where the bird used to perch — negative shape -->
        <g fill="#E6DDC8" stroke="#5C4E3F" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.7">
          <path d="M -20 0 Q -28 -12 -18 -22 Q -8 -28 4 -22 L 18 -16 Q 24 -8 22 2 L 16 8 Q 4 12 -8 10 Q -18 8 -20 0 Z"/>
          <!-- Phantom beak -->
          <path d="M 22 -10 L 30 -8 L 22 -4 Z" fill="#E6DDC8"/>
        </g>

        <!-- The bird, in flight, outside the cage -->
        <g transform="translate(140,-130)" fill="#1F3A5F" opacity="0.9">
          <!-- Body -->
          <ellipse cx="0" cy="0" rx="12" ry="6"/>
          <!-- Wings (upward stroke) -->
          <path d="M -8 -2 Q -22 -16 -28 -10 Q -20 -4 -10 0 Z"/>
          <path d="M 4 -2 Q 18 -16 24 -10 Q 16 -4 6 0 Z"/>
          <!-- Beak -->
          <path d="M 10 -1 L 18 0 L 10 2 Z"/>
        </g>

        <!-- Cord/rope dangling from a snapped bar (the dismantling crew) -->
        <path d="M 90 -50 Q 105 -20 100 30 Q 95 60 110 90"
              fill="none" stroke="#5C4E3F" stroke-width="0.7" opacity="0.6" stroke-dasharray="3 2"/>
      </g>

      <!-- Bangla title -->
      <text x="200" y="385" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="28" fill="#1F3A5F">আছিন পাখি</text>
      <text x="200" y="408" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="14" fill="#5C4E3F" opacity="0.85">"Look, how a strange bird flits in and out of the cage."</text>
      <text x="200" y="428" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#B5532A" letter-spacing="3">LALON, c. 1880 · DISMANTLED 15 OCT 2008</text>

      <!-- Meta tags -->
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">ZIA INTERNATIONAL AIRPORT</text>
        <text x="20" y="480">5 SCULPTURES · MRINAL HAQUE · TK 1 CRORE</text>
      </g>
    </svg>`;
  },

  'mamata-portrait'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#F1EADA"/>
      <!-- Stylized Mamata silhouette with white sari -->
      <g transform="translate(200,210)">
        <!-- Body in white -->
        <path d="M -90 90 Q -80 60 -50 60 L 50 60 Q 80 60 90 90 L 90 140 L -90 140 Z" fill="#F1EADA" stroke="#1A1410" stroke-width="1"/>
        <!-- Head -->
        <ellipse cx="0" cy="0" rx="50" ry="60" fill="#3A2E24"/>
        <!-- Hair -->
        <path d="M -50 -20 Q -50 -70 0 -70 Q 50 -70 50 -20 L 50 0 Q 45 -15 30 -10 L -30 -10 Q -45 -15 -50 0 Z" fill="#1A1410"/>
        <!-- Sari border/anchal -->
        <rect x="-90" y="60" width="180" height="6" fill="#C0392B"/>
      </g>
      <text x="200" y="380" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="24" fill="#C0392B">দিদি</text>
      <text x="200" y="405" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="14" fill="#1A1410">Didi, elder sister</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">MAMATA BANERJEE · TMC</text>
        <text x="20" y="480">FIRST WOMAN CM · 2011–2026</text>
      </g>
    </svg>`;
  },

  'july-uprising'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#1A1410"/>
      <!-- Raised fists in silhouette -->
      <g fill="#C0392B" transform="translate(0,150)">
        ${[80, 160, 240, 320].map((x, i) => `
          <g transform="translate(${x},${50 - i * 10})">
            <!-- Forearm -->
            <rect x="-8" y="0" width="16" height="60" />
            <!-- Fist -->
            <rect x="-14" y="-22" width="28" height="28" rx="6"/>
          </g>
        `).join('')}
      </g>
      <text x="200" y="370" text-anchor="middle" font-family="Hind Siliguri, serif" font-size="22" fill="#F1EADA">জুলাই অভ্যুত্থান</text>
      <text x="200" y="395" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="14" fill="#F1EADA">July Uprising · 2024</text>
      <text x="200" y="425" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#B8923B" letter-spacing="3">875+ KILLED · HASINA FLED · YUNUS SWORN IN</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">5 AUGUST 2024</text>
      </g>
    </svg>`;
  },

  'bengal-flags'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Two flags side by side -->
      <!-- Bangladesh flag -->
      <g transform="translate(80,200)">
        <rect width="100" height="60" fill="#006A4E"/>
        <circle cx="45" cy="30" r="18" fill="#C0392B"/>
        <rect x="-2" y="0" width="2" height="100" fill="#3A2E24"/>
      </g>
      <!-- Saffron BJP-WB era flag -->
      <g transform="translate(220,200)">
        <rect width="100" height="60" fill="#FF9933"/>
        <rect y="20" width="100" height="20" fill="#F1EADA"/>
        <rect y="40" width="100" height="20" fill="#138808"/>
        <rect x="-2" y="0" width="2" height="100" fill="#3A2E24"/>
      </g>
      <!-- Divider -->
      <line x1="200" y1="180" x2="200" y2="320" stroke="#1A1410" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <text x="200" y="370" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="18" fill="#1A1410">two Bengals</text>
      <text x="200" y="395" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#5C4E3F" letter-spacing="3">CULTURAL DIVISION NOW MATCHES POLITICAL</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">2026 · SUVENDU ADHIKARI · 9 MAY</text>
      </g>
    </svg>`;
  },

  // The geographic prologue — braided rivers + delta
  'delta-rivers'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <!-- Subtle land mass -->
      <path d="M 0 250 Q 50 240 100 250 L 400 280 L 400 500 L 0 500 Z" fill="#D6CBB1"/>
      <!-- Bay of Bengal -->
      <rect x="0" y="450" width="400" height="50" fill="#1F3A5F" opacity="0.18"/>
      <!-- River braiding — three main rivers fanning out into delta -->
      <g fill="none" stroke="#1F3A5F" stroke-linecap="round" opacity="0.85">
        <!-- Ganges/Padma main stem -->
        <path d="M 50 60 Q 100 130 130 200 Q 160 270 180 340 Q 200 410 220 460" stroke-width="5"/>
        <!-- Brahmaputra/Jamuna -->
        <path d="M 200 50 Q 220 130 230 200 Q 240 280 245 360 Q 250 420 260 465" stroke-width="5"/>
        <!-- Meghna -->
        <path d="M 350 70 Q 330 150 310 230 Q 295 310 290 390 Q 285 430 290 470" stroke-width="4"/>
        <!-- Small distributaries fanning out in the delta -->
        <path d="M 180 340 Q 160 370 140 410 Q 120 440 110 470" stroke-width="2.2" opacity="0.7"/>
        <path d="M 230 350 Q 210 390 195 430 Q 180 455 175 475" stroke-width="2.2" opacity="0.7"/>
        <path d="M 250 360 Q 270 400 285 430 Q 300 455 310 475" stroke-width="2.2" opacity="0.7"/>
        <path d="M 245 360 Q 240 400 235 440 Q 232 460 230 475" stroke-width="1.8" opacity="0.6"/>
        <path d="M 290 390 Q 305 420 325 450 Q 340 465 350 475" stroke-width="2" opacity="0.7"/>
        <!-- Tributaries on east side -->
        <path d="M 310 230 Q 350 240 380 250" stroke-width="1.5" opacity="0.5"/>
        <path d="M 230 200 Q 270 195 305 200" stroke-width="1.5" opacity="0.5"/>
      </g>
      <!-- Dhaka marker -->
      <g transform="translate(245,340)">
        <circle r="4" fill="#B5532A"/>
        <text x="8" y="4" font-family="JetBrains Mono, monospace" font-size="9" fill="#1A1410">DHAKA</text>
      </g>
      <!-- Kolkata marker -->
      <g transform="translate(140,420)">
        <circle r="4" fill="#B5532A"/>
        <text x="-50" y="4" font-family="JetBrains Mono, monospace" font-size="9" fill="#1A1410">KOLKATA</text>
      </g>
      <text x="200" y="490" text-anchor="middle" font-family="JetBrains Mono, monospace"
            font-size="9" fill="#5C4E3F" letter-spacing="3" opacity="0.7">BAY OF BENGAL</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5C4E3F" letter-spacing="2">
        <text x="20" y="30">700 RIVERS · WORLD'S LARGEST DELTA</text>
      </g>
    </svg>`;
  },

  // The Biharis of Camp Geneva — tarpaulin tents, no flag
  'stranded-camp'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#3A2E24"/>
      <!-- Row of low tarp shacks -->
      <g fill="#5C4E3F">
        <path d="M 30 320 L 80 280 L 130 320 L 130 380 L 30 380 Z"/>
        <path d="M 130 320 L 180 280 L 230 320 L 230 380 L 130 380 Z"/>
        <path d="M 230 320 L 280 280 L 330 320 L 330 380 L 230 380 Z"/>
        <path d="M 330 320 L 370 290 L 400 320 L 400 380 L 330 380 Z"/>
      </g>
      <!-- Tarpaulin patches and stitching -->
      <g stroke="#1A1410" stroke-width="0.5" opacity="0.6" fill="none">
        <line x1="55" y1="300" x2="65" y2="310"/>
        <line x1="155" y1="295" x2="170" y2="305"/>
        <line x1="255" y1="300" x2="270" y2="312"/>
      </g>
      <!-- Dark doorways -->
      <g fill="#1A1410">
        <rect x="60" y="350" width="20" height="30"/>
        <rect x="160" y="345" width="20" height="35"/>
        <rect x="260" y="350" width="20" height="30"/>
      </g>
      <!-- Two flagless flagpoles (statelessness) -->
      <g stroke="#F1EADA" stroke-width="1" opacity="0.4">
        <line x1="180" y1="200" x2="180" y2="280"/>
        <line x1="220" y1="200" x2="220" y2="280"/>
      </g>
      <!-- Empty patches where flags would be -->
      <g fill="none" stroke="#F1EADA" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.4">
        <rect x="180" y="210" width="30" height="20"/>
        <rect x="220" y="210" width="30" height="20"/>
      </g>
      <text x="200" y="430" text-anchor="middle" font-family="Fraunces, serif"
            font-style="italic" font-size="22" fill="#F1EADA">~300,000</text>
      <text x="200" y="452" text-anchor="middle" font-family="JetBrains Mono, monospace"
            font-size="9" fill="#B8923B" letter-spacing="3">STATELESS · 66 CAMPS · 50+ YEARS</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">CAMP GENEVA · DHAKA</text>
      </g>
    </svg>`;
  },

  // Shahbag movement — the dense crowd of raised candles
  'shahbag-crowd'() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#122340"/>
      <!-- Crowd of small heads (silhouettes) -->
      <g fill="#1A1410">
        ${Array.from({length: 50}).map((_, i) => {
          const col = i % 10;
          const row = Math.floor(i / 10);
          const x = 40 + col * 35 + (row % 2 ? 12 : 0);
          const y = 300 + row * 30;
          return `<circle cx="${x}" cy="${y}" r="9"/>`;
        }).join('')}
      </g>
      <!-- Candle flames above the crowd -->
      <g fill="#B8923B">
        ${Array.from({length: 25}).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const x = 60 + col * 40 + (row % 2 ? 20 : 0);
          const y = 220 + row * 30;
          return `
            <path d="M ${x} ${y} Q ${x - 4} ${y - 8} ${x} ${y - 14} Q ${x + 4} ${y - 8} ${x} ${y} Z"/>
            <rect x="${x - 1}" y="${y}" width="2" height="14" fill="#F1EADA"/>
          `;
        }).join('')}
      </g>
      <!-- Glow above flames -->
      <ellipse cx="200" cy="220" rx="180" ry="40" fill="#B8923B" opacity="0.15"/>
      <text x="200" y="100" text-anchor="middle" font-family="Hind Siliguri, serif"
            font-size="24" fill="#F1EADA">প্রজন্ম চত্বর</text>
      <text x="200" y="125" text-anchor="middle" font-family="Fraunces, serif"
            font-style="italic" font-size="14" fill="#F1EADA" opacity="0.85">Projonmo Chottor · Generation Square</text>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#B8923B" letter-spacing="2">
        <text x="20" y="30">SHAHBAG · 5 FEBRUARY 2013</text>
        <text x="20" y="490">WAR CRIMES TRIBUNAL · DEATH FOR THE 1971 KILLERS</text>
      </g>
    </svg>`;
  },

  default() {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="#E6DDC8"/>
      <circle cx="200" cy="250" r="80" fill="#B5532A" opacity="0.5"/>
    </svg>`;
  }
};

// ============================================================
// 3. SCROLL CONTROLLER — fires events as scenes enter viewport
// ============================================================
class ScrollController {
  constructor() {
    this.listeners = new Set();
    this.activeScene = null;
    this.observer = null;
  }

  init() {
    this.observer = new IntersectionObserver(
      entries => this.handleIntersect(entries),
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    document.querySelectorAll('.scene, .chapter').forEach(el => {
      this.observer.observe(el);
    });

    // Reveal observer — for the simpler fade-up animation
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('scene')) {
          this.activeScene = entry.target;
          this.emit('scene-enter', entry.target);
        }
      }
    });
  }

  on(event, fn) { this.listeners.add({ event, fn }); }
  emit(event, payload) {
    this.listeners.forEach(l => l.event === event && l.fn(payload));
  }
}

// ============================================================
// 4. SIDE PANEL CONTROLLER — live metric updates
// ============================================================
class SidePanelController {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    this.state = {
      year: '— BCE',
      era: 'Origins',
      track: 'Shared',
      headline: 'Bengal in formation'
    };
  }

  init() {
    this.root.innerHTML = `
      <div class="side-panel-header">Reading</div>
      <div class="side-metric">
        <span class="label">Year</span>
        <span class="value" data-key="year">${this.state.year}</span>
      </div>
      <div class="side-metric">
        <span class="label">Era</span>
        <span class="value" data-key="era">${this.state.era}</span>
      </div>
      <div class="side-metric">
        <span class="label">Track</span>
        <span class="value" data-key="track">${this.state.track}</span>
      </div>
      <div class="side-metric">
        <span class="label">Headline</span>
        <span class="value" data-key="headline" style="font-size: 0.9rem; line-height: 1.3;">${this.state.headline}</span>
      </div>
    `;
  }

  show() { this.root.classList.add('visible'); }
  hide() { this.root.classList.remove('visible'); }

  /** Update one or more metrics with a brief flash */
  update(patch) {
    Object.entries(patch).forEach(([key, value]) => {
      if (this.state[key] === value) return;
      this.state[key] = value;
      const el = this.root.querySelector(`[data-key="${key}"]`);
      if (!el) return;
      el.textContent = value;
      el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 700);
    });
  }

  /** Called by the scroll controller when a new scene enters */
  applyScene(sceneEl) {
    const event = TIMELINE_INDEX.get(sceneEl.dataset.eventId);
    if (!event) return;

    const era = ERAS.find(e => e.id === event.era);
    // For the geography prologue (year very old / no fixed year), use a friendly label.
    const yearLabel =
      event.year <= -5000 ? 'Before history'
      : event.year < 0    ? `${Math.abs(event.year)} BCE`
      : `${event.year} CE`;

    this.update({
      year: yearLabel,
      era: era?.label || '—',
      track: this.formatTrack(event.track),
      headline: event.title
    });
  }

  formatTrack(t) {
    return { 'shared': 'Both Bengals', 'bangladesh': 'Bangladesh', 'west-bengal': 'West Bengal' }[t] || '—';
  }
}

// ============================================================
// 5. PROGRESS BAR & CHAPTER INDICATOR
// ============================================================
class ProgressController {
  constructor() {
    this.bar = document.querySelector('.progress-bar');
    this.chapterIndicator = document.querySelector('.chapter-indicator');
    this.ticking = false;
  }

  init() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollTop / Math.max(docHeight, 1);
    this.bar.style.transform = `scaleX(${pct})`;
  }

  setChapter(eraId) {
    const era = ERAS.find(e => e.id === eraId);
    if (era && this.chapterIndicator) {
      this.chapterIndicator.textContent = era.label;
    }
  }
}

// ============================================================
// 6. TRACK FILTER — Bangladesh / West Bengal toggle
// ============================================================
class TrackFilter {
  constructor() {
    this.current = 'both';
  }

  init() {
    document.querySelectorAll('.track-selector button').forEach(btn => {
      btn.addEventListener('click', () => this.set(btn.dataset.track));
    });
  }

  set(track) {
    this.current = track;
    document.body.classList.remove(
      'track-filter-bangladesh', 'track-filter-west-bengal'
    );
    if (track !== 'both') {
      document.body.classList.add(`track-filter-${track}`);
    }
    document.querySelectorAll('.track-selector button').forEach(b => {
      b.classList.toggle('active', b.dataset.track === track);
    });
  }
}

// ============================================================
// 7. CULTURE / DIASPORA CHART RENDERING
// ============================================================
// Compact, two-column interactive grid. Each cell shows the
// country name, its share-bar, and the count. Hovering or tapping
// a cell reveals the hub-city detail in a single shared readout
// row above the grid — keeping the vertical footprint tight while
// preserving every datum from the old long-form chart.
function renderDiaspora(container) {
  const data = [...CULTURE.diaspora].sort((a, b) => b.count - a.count);
  const max = data[0].count;
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const formatCount = (n) => n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : `${(n / 1000).toFixed(0)}K`;

  const cells = data.map((d, i) => {
    const scale = d.count / max;
    return `
      <button class="diaspora-cell fade-up"
              data-country="${d.country}"
              data-hub="${d.hub}"
              data-count="${formatCount(d.count)}"
              style="--scale: ${scale.toFixed(3)}; --i: ${i};"
              type="button">
        <span class="diaspora-cell-country">${d.country}</span>
        <span class="diaspora-cell-bar"><span class="diaspora-cell-bar-fill"></span></span>
        <span class="diaspora-cell-count">${formatCount(d.count)}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="diaspora-summary">
      <div class="diaspora-summary-left">
        <div class="diaspora-summary-num">${formatCount(total)}+</div>
        <div class="diaspora-summary-label">Bengalis abroad · ${data.length} principal hubs</div>
      </div>
      <div class="diaspora-readout" aria-live="polite">
        <span class="diaspora-readout-label">Hover a country</span>
        <span class="diaspora-readout-value"></span>
      </div>
    </div>
    <div class="diaspora-grid">${cells}</div>
  `;

  // Interactive hub-city readout. One shared readout row keeps the layout
  // compact instead of repeating the hub line beneath every bar.
  const readout      = container.querySelector('.diaspora-readout');
  const readoutLabel = readout.querySelector('.diaspora-readout-label');
  const readoutValue = readout.querySelector('.diaspora-readout-value');
  const cellEls      = container.querySelectorAll('.diaspora-cell');

  const setReadout = (cell) => {
    if (!cell) {
      readout.classList.remove('active');
      readoutLabel.textContent = 'Hover a country';
      readoutValue.textContent = '';
      return;
    }
    readout.classList.add('active');
    readoutLabel.textContent = `${cell.dataset.country} · ${cell.dataset.count}`;
    readoutValue.textContent = cell.dataset.hub;
  };

  cellEls.forEach(cell => {
    cell.addEventListener('mouseenter', () => setReadout(cell));
    cell.addEventListener('focus',      () => setReadout(cell));
    cell.addEventListener('click',      () => {
      // Toggle a sticky highlight on touch / click for mobile users
      cellEls.forEach(c => { if (c !== cell) c.classList.remove('active'); });
      cell.classList.toggle('active');
      setReadout(cell.classList.contains('active') ? cell : null);
    });
  });
  container.querySelector('.diaspora-grid').addEventListener('mouseleave', () => {
    const sticky = container.querySelector('.diaspora-cell.active');
    setReadout(sticky || null);
  });
}

// ============================================================
// 8. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Render the timeline
  ContentRenderer.renderTimeline(document.getElementById('timeline'));

  // Render the diaspora chart
  renderDiaspora(document.querySelector('.diaspora-chart'));

  // Initialize controllers
  const sidePanel = new SidePanelController('.side-panel');
  sidePanel.init();

  const progress = new ProgressController();
  progress.init();

  const scroll = new ScrollController();
  scroll.on('scene-enter', sceneEl => {
    sidePanel.applyScene(sceneEl);
    progress.setChapter(sceneEl.dataset.era);
  });
  scroll.init();

  // Show side panel after scrolling past hero
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidePanel.hide();
      } else if (entry.boundingClientRect.top < 0) {
        sidePanel.show();
      }
    });
  }, { threshold: 0 });
  heroObserver.observe(document.querySelector('.hero'));

  // Hide side panel once we've scrolled past the timeline (into the closing/culture/diaspora sections)
  // The closing section now leads this post-timeline block, so we observe it.
  const postTimeline = document.querySelector('.closing') || document.querySelector('.culture-section');
  if (postTimeline) {
    const postObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // bbox.top < 0 = the section's top edge is above the viewport,
        // meaning we've scrolled into or past it -> hide the panel.
        // When we scroll back up and it re-enters the viewport from below, show again.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          sidePanel.hide();
        } else {
          sidePanel.show();
        }
      });
    }, { threshold: 0 });
    postObserver.observe(postTimeline);
  }

  // Track filter
  const trackFilter = new TrackFilter();
  trackFilter.init();

  // Table of Contents drawer — built from TIMELINE + ERAS, listens to scene-enter
  // events from the scroll controller to highlight the user's current location.
  const toc = new TOCController();
  toc.init();
  scroll.on('scene-enter', sceneEl => toc.setActiveScene(sceneEl.dataset.eventId));
});

// ============================================================
// 8. THEME TOGGLE — light / dark
// ============================================================
// Persists across sessions via localStorage. Respects the user's
// OS-level preference on first visit. Toggling animates via the
// CSS transitions declared on html/body and component overrides.
const ThemeController = {
  STORAGE_KEY: 'bengal-theme',

  init() {
    const root = document.documentElement;
    const btn  = document.querySelector('.theme-toggle');
    if (!btn) return;

    // Resolve initial theme: stored > system preference > light
    let stored = null;
    try { stored = localStorage.getItem(this.STORAGE_KEY); } catch (_) {}
    const prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    this.apply(initial);

    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this.apply(next);
      try { localStorage.setItem(this.STORAGE_KEY, next); } catch (_) {}
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      const next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', `Switch to ${next} mode`);
      btn.setAttribute('title',      `Switch to ${next} mode`);
    }
  },
};

// ============================================================
// 9. JUMP-TO-BOTTOM WIDGET
// ============================================================
// Reveals after the user scrolls a small distance, hides again
// once they're within the last viewport of the page so it doesn't
// hover redundantly over the footer.
const JumpBottomController = {
  REVEAL_AFTER_PX: 320,

  init() {
    const btn = document.querySelector('.jump-bottom');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const target = document.documentElement.scrollHeight;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });

    const update = () => {
      const y          = window.scrollY;
      const viewport   = window.innerHeight;
      const docHeight  = document.documentElement.scrollHeight;
      const distFromBottom = docHeight - (y + viewport);

      btn.classList.toggle('visible',   y > this.REVEAL_AFTER_PX);
      btn.classList.toggle('at-bottom', distFromBottom < viewport * 0.6);
    };

    update();
    window.addEventListener('scroll',  update, { passive: true });
    window.addEventListener('resize',  update);
  },
};

// Initialize both after the DOM is ready. Wrapped in DOMContentLoaded
// so we don't race with the main bootstrap block above.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    JumpBottomController.init();
  });
} else {
  ThemeController.init();
  JumpBottomController.init();
}

// ============================================================
// 10. TABLE OF CONTENTS CONTROLLER
// ============================================================
// Slide-out drawer pinned to the left edge. Built from the same
// TIMELINE + ERAS data that drives the page, so new scenes show
// up automatically. On wide screens (>=1100px) opening the drawer
// shifts the entire page right (handled in CSS via body.toc-open);
// on narrower screens it overlays with a backdrop instead.
//
// Public surface:
//   .init()                 — build the drawer, wire all events
//   .open() / .close()      — programmatic control
//   .setActiveScene(id)     — highlight an entry (called by ScrollController)
class TOCController {
  constructor() {
    this.drawer       = document.querySelector('.toc-drawer');
    this.list         = this.drawer ? this.drawer.querySelector('.toc-list') : null;
    this.toggleBtn    = document.querySelector('.toc-toggle');
    this.closeBtn     = document.querySelector('.toc-drawer-close');
    this.backdrop     = document.querySelector('.toc-backdrop');
    this.body         = document.body;
    this.isOpen       = false;
    this.activeId     = null;
    this.previousFocus = null;
  }

  init() {
    // Guard: if the DOM doesn't have the drawer for some reason, exit quietly.
    if (!this.drawer || !this.list || !this.toggleBtn) return;

    this.build();
    this.bindEvents();
  }

  /** Build the drawer's entries from TIMELINE + ERAS. */
  build() {
    // Group timeline events by era, preserving the array order
    // (which is also chronological because data.js is authored that way).
    const groupsByEra = new Map();
    const eraOrder    = [];

    TIMELINE.forEach(ev => {
      if (!groupsByEra.has(ev.era)) {
        groupsByEra.set(ev.era, []);
        eraOrder.push(ev.era);
      }
      groupsByEra.get(ev.era).push(ev);
    });

    // Render each era as a group: chapter heading + nested entries
    const fragment = document.createDocumentFragment();

    eraOrder.forEach(eraId => {
      const era    = ERAS.find(e => e.id === eraId);
      const events = groupsByEra.get(eraId);
      if (!era) return;

      const group = document.createElement('section');
      group.className   = 'toc-group';
      group.dataset.era = eraId;

      // Chapter heading
      const chapterBtn = document.createElement('button');
      chapterBtn.type      = 'button';
      chapterBtn.className = 'toc-chapter';
      chapterBtn.dataset.targetId = `chapter-${eraId}`;
      chapterBtn.innerHTML = `
        <span class="toc-chapter-mark">Chapter</span>
        <span class="toc-chapter-label">${this.escape(era.label)}</span>
        <span class="toc-chapter-range">${this.escape(era.range)}</span>
      `;
      group.appendChild(chapterBtn);

      // Scene entries
      const entries = document.createElement('ul');
      entries.className = 'toc-entries';

      events.forEach(ev => {
        const li = document.createElement('li');
        li.className       = 'toc-entry';
        li.dataset.eventId = ev.id;

        const btn = document.createElement('button');
        btn.type     = 'button';
        btn.dataset.targetId = `scene-${ev.id}`;
        btn.innerHTML = `
          <span class="toc-entry-year">${this.escape(this.formatYear(ev.year, ev.dateDisplay))}</span>
          <span class="toc-entry-title">${this.escape(ev.title)}</span>
        `;
        li.appendChild(btn);
        entries.appendChild(li);
      });

      group.appendChild(entries);
      fragment.appendChild(group);
    });

    this.list.appendChild(fragment);
  }

  /** Wire up all interactions. */
  bindEvents() {
    // Toggle button
    this.toggleBtn.addEventListener('click', () => this.toggle());

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click (mobile/tablet)
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    // Click-outside-to-close on desktop. The TOC toggle is hidden under
    // the open drawer, so without this the user could only dismiss via
    // the X button or ESC. Listening on the document, we close on any
    // click that lands outside the drawer itself.
    document.addEventListener('click', e => {
      if (!this.isOpen) return;
      // Ignore clicks on the toggle (it's hidden but defensive) and inside the drawer
      if (this.drawer.contains(e.target)) return;
      if (this.toggleBtn.contains(e.target)) return;
      // Only act on wide screens — on narrow, the backdrop already handles this
      const isNarrow = window.matchMedia('(max-width: 1099px)').matches;
      if (isNarrow) return;
      this.close();
    });

    // ESC closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.toggleBtn.focus();
      }
    });

    // Delegate clicks inside the list — any button with data-target-id scrolls
    this.list.addEventListener('click', e => {
      const btn = e.target.closest('button[data-target-id]');
      if (!btn) return;
      const id = btn.dataset.targetId;
      this.navigateTo(id);
    });
  }

  /** Smooth-scroll to a target element and close the drawer on narrow screens. */
  navigateTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Offset for the fixed top bar (~56px) so the section heading isn't hidden behind it
    const topBarOffset = 56;
    const rect = target.getBoundingClientRect();
    const y    = window.scrollY + rect.top - topBarOffset;

    // On narrow screens close the drawer BEFORE scrolling, so the
    // page-scroll lock comes off; otherwise the scroll won't fire.
    const isNarrow = window.matchMedia('(max-width: 1099px)').matches;
    if (isNarrow) {
      this.close();
      // Give the close animation a beat so the user sees where they're going to.
      setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 280);
    } else {
      // On desktop the page is shifted but still scrollable — just scroll.
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /** Toggle open/closed. */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.previousFocus = document.activeElement;

    this.body.classList.add('toc-open');
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.toggleBtn.setAttribute('aria-expanded', 'true');
    this.toggleBtn.setAttribute('aria-label', 'Close table of contents');

    if (this.backdrop) this.backdrop.classList.add('visible');

    // If the user is in a known scene, scroll the active entry into view
    // inside the drawer so they don't have to hunt for it.
    if (this.activeId) {
      requestAnimationFrame(() => {
        const activeEl = this.list.querySelector(`.toc-entry[data-event-id="${this.activeId}"]`);
        if (activeEl && typeof activeEl.scrollIntoView === 'function') {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    // Move focus into the drawer for keyboard users
    if (this.closeBtn) {
      // Small delay so the focus ring doesn't flash before the drawer is visible
      setTimeout(() => this.closeBtn.focus({ preventScroll: true }), 60);
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.body.classList.remove('toc-open');
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    this.toggleBtn.setAttribute('aria-label', 'Open table of contents');

    if (this.backdrop) this.backdrop.classList.remove('visible');

    // Return focus to the trigger if focus was inside the drawer
    if (this.previousFocus && this.drawer.contains(document.activeElement)) {
      this.previousFocus.focus({ preventScroll: true });
    }
  }

  /**
   * Highlight the entry corresponding to the currently-visible scene.
   * Called by the ScrollController via the scene-enter event.
   */
  setActiveScene(eventId) {
    if (!eventId || eventId === this.activeId) return;
    this.activeId = eventId;

    // Clear previous active marks
    this.list.querySelectorAll('.toc-entry.active').forEach(el => el.classList.remove('active'));
    this.list.querySelectorAll('.toc-group.active').forEach(el => el.classList.remove('active'));

    // Mark this entry + its parent group active
    const entry = this.list.querySelector(`.toc-entry[data-event-id="${eventId}"]`);
    if (entry) {
      entry.classList.add('active');
      const group = entry.closest('.toc-group');
      if (group) group.classList.add('active');
    }
  }

  /** Resolve a display-friendly year label for the TOC. */
  formatYear(year, dateDisplay) {
    // The year field is signed (negative = BCE). Prefer a short label
    // that maps closely to the dateDisplay for periods we already
    // hand-curated. For broader cases, fall back to derived text.
    if (typeof year !== 'number') return dateDisplay || '';
    if (year <= -1000)  return `${Math.abs(year)} BCE`;
    if (year < 0)       return `${Math.abs(year)} BCE`;
    if (year === 0)     return '0';
    return String(year);
  }

  /** Minimal HTML-escape for text we splice into innerHTML. */
  escape(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
