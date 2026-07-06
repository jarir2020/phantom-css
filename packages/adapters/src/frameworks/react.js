import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('react', options);
}

export function exportPhantomReactDocs(options = {}) {
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

export const phantomReactAdapter = installPhantomCSS;
export const phantomReactDocs = exportPhantomReactDocs;

export default phantomReactAdapter;
