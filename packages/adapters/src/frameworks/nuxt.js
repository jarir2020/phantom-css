import { createFrameworkAdapter } from '../index.js';

export function installPhantomCSS(options = {}) {
  return createFrameworkAdapter('nuxt', options);
}

export const phantomNuxtAdapter = installPhantomCSS;

export default phantomNuxtAdapter;
