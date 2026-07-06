import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('plain', options);
}

export function exportPhantomPlainDocs(options = {}) {
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

export const phantomPlainAdapter = installPhantomCSS;
export const phantomPlainDocs = exportPhantomPlainDocs;

export default phantomPlainAdapter;
