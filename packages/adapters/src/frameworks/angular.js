import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('angular', options);
}

export const phantomAngularAdapter = installPhantomCSS;

export default phantomAngularAdapter;
