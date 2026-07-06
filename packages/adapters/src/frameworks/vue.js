import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('vue', options);
}

export function exportPhantomVueDocs(options = {}) {
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

export const phantomVueAdapter = installPhantomCSS;
export const phantomVueDocs = exportPhantomVueDocs;

export default phantomVueAdapter;
