import {
  allSemanticElementMappings,
  allSemanticElementNames,
  allThemeNames,
  allThemePresets,
  createAllPreviewManifest,
  createAllSemanticMap,
  createAllThemePack
} from '../../presets/src/all.js';
import { buildStylesheet, createPhantomTheme } from '../../core/src/index.js';

function renderThemeCard(name, preset) {
  const primary = preset.colors?.primary?.[500] || '#3b82f6';
  const surface = preset.colors?.surface || '#ffffff';
  const text = preset.colors?.text || '#0f172a';

  return `
    <article class="ui-card theme-card" data-theme="${name}" style="--preview-accent:${primary};--preview-surface:${surface};--preview-text:${text}">
      <header class="theme-card__header">
        <strong>${name}</strong>
        <span class="theme-card__badge">${name}</span>
      </header>
      <div class="theme-card__swatch"></div>
      <p class="theme-card__sample">The quick brown fox jumps over the lazy dog.</p>
    </article>
  `;
}

function renderSemanticRow(tag, mapping) {
  return `
    <tr>
      <th><code>&lt;${tag}&gt;</code></th>
      <td>${mapping.role}</td>
      <td><span class="semantic-pill">${mapping.theme}</span></td>
      <td><span class="semantic-pill">${mapping.className}</span></td>
      <td><${tag} class="${mapping.className}">${tag}</${tag}></td>
    </tr>
  `;
}

export function createPreviewApp(options = {}) {
  const theme = options.theme || createPhantomTheme(options.tokens || {});
  const stylesheet = buildStylesheet({ theme });
  const themePack = createAllThemePack();
  const semanticMap = createAllSemanticMap();
  const previewManifest = createAllPreviewManifest();

  const themes = allThemeNames.map((name) => renderThemeCard(name, allThemePresets[name]));
  const semanticRows = allSemanticElementNames.map((tag) => renderSemanticRow(tag, semanticMap[tag] || allSemanticElementMappings[tag] || {}));

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Phantom CSS Preview</title>
  <style>
    ${stylesheet.css}
    :root {
      --preview-bg: #020617;
      --preview-panel: rgba(15, 23, 42, 0.72);
      --preview-border: rgba(148, 163, 184, 0.2);
      --preview-text: #e2e8f0;
      --preview-muted: #94a3b8;
    }
    body {
      margin: 0;
      font-family: Inter, sans-serif;
      background: radial-gradient(circle at top, #1e293b, #020617 55%);
      color: var(--preview-text);
    }
    .preview-shell {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px;
    }
    .preview-hero {
      display: grid;
      gap: 12px;
      margin-bottom: 24px;
    }
    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .theme-card, .semantic-panel {
      background: var(--preview-panel);
      border: 1px solid var(--preview-border);
      border-radius: 18px;
      padding: 18px;
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
    }
    .theme-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      text-transform: capitalize;
    }
    .theme-card__badge, .semantic-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.14);
      color: var(--preview-text);
      font-size: 12px;
    }
    .theme-card__swatch {
      height: 64px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--preview-accent), var(--preview-surface));
      margin-bottom: 12px;
    }
    .theme-card__sample {
      color: var(--preview-muted);
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      vertical-align: top;
    }
    code {
      background: rgba(15, 23, 42, 0.6);
      padding: 2px 6px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <main class="preview-shell">
    <section class="preview-hero">
      <h1>Phantom CSS Preview</h1>
      <p>30 preset themes and semantic element mappings rendered automatically from the theme pack.</p>
    </section>

    <section>
      <h2>Theme Gallery</h2>
      <div class="preview-grid">
        ${themes.join('\n')}
      </div>
    </section>

    <section style="margin-top: 32px;">
      <h2>Semantic Mappings</h2>
      <div class="semantic-panel">
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Role</th>
              <th>Theme</th>
              <th>Class</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            ${semanticRows.join('\n')}
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>
  `.trim();

  return {
    name: 'Phantom CSS Preview App',
    themes: allThemeNames,
    themePack,
    semanticMap,
    manifest: previewManifest,
    css: stylesheet.css,
    html
  };
}

export default createPreviewApp;
