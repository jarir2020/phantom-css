import { buildStylesheet, createPhantomTheme } from '../../core/src/index.js';
import { listPresets } from '../../presets/src/index.js';
import { listFrameworkAdapters } from '../../adapters/src/index.js';
import { createPreviewApp } from './preview.js';
import { createStaticPreviewSite, writePreviewSite } from './static.js';
import { createPreviewWatcher } from './watch.js';
import { startPreviewServer } from './server.js';

export function createPlayground(options = {}) {
  const theme = options.theme || createPhantomTheme(options.tokens || {});
  const stylesheet = buildStylesheet({ theme });

  return {
    name: 'Phantom CSS Playground',
    theme: theme.name,
    presets: listPresets(),
    adapters: listFrameworkAdapters(),
    css: stylesheet.css,
    examples: [
      {
        label: 'Button',
        markup: '<button class="ui-button">Phantom Button</button>'
      },
      {
        label: 'Card',
        markup: '<section class="ui-card">Phantom Card</section>'
      }
    ]
  };
}

export function createDocsIndex() {
  return {
    name: 'Phantom CSS Docs',
    sections: [
      'Getting Started',
      'Tokens',
      'Utilities',
      'Components',
      'Adapters',
      'Recipes'
    ]
  };
}

export { createPreviewApp };
export { createStaticPreviewSite, writePreviewSite };
export { createPreviewWatcher, startPreviewServer };

export function createWebManifest(options = {}) {
  return {
    packageName: '@phantom-css/web',
    version: '0.1.0',
    playground: createPlayground(options),
    docs: createDocsIndex(),
    preview: createPreviewApp(options),
    staticPreview: createStaticPreviewSite(options)
  };
}

export default {
  createPlayground,
  createDocsIndex,
  createWebManifest,
  createPreviewApp,
  createStaticPreviewSite,
  writePreviewSite,
  createPreviewWatcher,
  startPreviewServer
};
