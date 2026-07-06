import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('svelte', options);
}

export function exportPhantomSvelteDocs(options = {}) {
  const phantom = installPhantomCSS(options);

  return {
    framework: phantom.framework,
    adapterName: phantom.adapterName,
    manifest: phantom.files['src/manifest.json'],
    config: phantom.files['src/phantom.config.json'],
    stylesheet: phantom.files['src/index.css'],
    theme: phantom.files['src/theme.css'],
    files: Object.keys(phantom.files)
  };
}

export const phantomSvelteAdapter = installPhantomCSS;
export const phantomSvelteDocs = exportPhantomSvelteDocs;

export default phantomSvelteAdapter;
