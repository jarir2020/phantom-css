import assert from 'node:assert/strict';
import {
  createFrameworkAdapter,
  frameworkNames,
  getFrameworkAdapter,
  listFrameworkAdapters
} from './src/index.js';
import { installPhantomCSS as installReact } from './src/frameworks/react.js';
import { installPhantomCSS as installVue } from './src/frameworks/vue.js';
import { installPhantomCSS as installNext } from './src/frameworks/next.js';
import { installPhantomCSS as installNuxt } from './src/frameworks/nuxt.js';
import { installPhantomCSS as installSvelte } from './src/frameworks/svelte.js';
import { installPhantomCSS as installAngular } from './src/frameworks/angular.js';
import { installPhantomCSS as installLaravel } from './src/frameworks/laravel.js';
import { installPhantomCSS as installPlain } from './src/frameworks/plain.js';
import { exportPhantomPlainDocs } from './src/frameworks/plain.js';
import { exportPhantomLaravelDocs } from './src/frameworks/laravel.js';
import { exportPhantomReactDocs } from './src/frameworks/react.js';
import { exportPhantomVueDocs } from './src/frameworks/vue.js';
import { exportPhantomSvelteDocs } from './src/frameworks/svelte.js';
import { exportPhantomNextDocs } from './src/frameworks/next.js';

assert.deepEqual(listFrameworkAdapters(), frameworkNames);

const react = installReact();
const vue = installVue();
const next = installNext();
const nuxt = installNuxt();
const svelte = installSvelte();
const angular = installAngular();
const laravel = installLaravel();
const plain = installPlain();
const plainDocs = exportPhantomPlainDocs();
const laravelDocs = exportPhantomLaravelDocs();
const reactDocs = exportPhantomReactDocs();
const vueDocs = exportPhantomVueDocs();
const svelteDocs = exportPhantomSvelteDocs();
const nextDocs = exportPhantomNextDocs();

for (const adapter of [react, vue, next, nuxt, svelte, angular, laravel, plain]) {
  assert.ok(adapter.framework);
  assert.ok(adapter.files['src/index.css'].length > 0);
  assert.ok(adapter.files['src/tokens.json'].includes('"name": "default"'));
}

assert.equal(react.framework, 'react');
assert.equal(vue.framework, 'vue');
assert.equal(next.framework, 'next');
assert.equal(nuxt.framework, 'nuxt');
assert.equal(svelte.framework, 'svelte');
assert.equal(angular.framework, 'angular');
assert.equal(laravel.framework, 'laravel');
assert.equal(plain.framework, 'plain');
assert.equal(plainDocs.framework, 'plain');
assert.equal(plainDocs.adapterName, 'phantom-plain');
assert.ok(plainDocs.manifest.includes('"framework": "plain"'));
assert.ok(plainDocs.files.includes('src/manifest.json'));
assert.ok(plainDocs.files.includes('src/theme.css'));
assert.equal(reactDocs.framework, 'react');
assert.equal(reactDocs.adapterName, 'phantom-react');
assert.ok(reactDocs.manifest.includes('"framework": "react"'));
assert.ok(reactDocs.files.includes('src/manifest.json'));
assert.ok(reactDocs.files.includes('src/components/input.css'));
assert.equal(vueDocs.framework, 'vue');
assert.equal(vueDocs.adapterName, 'phantom-vue');
assert.ok(vueDocs.manifest.includes('"framework": "vue"'));
assert.ok(vueDocs.files.includes('src/manifest.json'));
assert.ok(vueDocs.files.includes('src/components/card.css'));
assert.equal(svelteDocs.framework, 'svelte');
assert.equal(svelteDocs.adapterName, 'phantom-svelte');
assert.ok(svelteDocs.manifest.includes('"framework": "svelte"'));
assert.ok(svelteDocs.files.includes('src/manifest.json'));
assert.ok(svelteDocs.files.includes('src/components/input.css'));
assert.equal(nextDocs.framework, 'next');
assert.equal(nextDocs.adapterName, 'phantom-next');
assert.ok(nextDocs.manifest.includes('"framework": "next"'));
assert.ok(nextDocs.files.includes('src/manifest.json'));
assert.ok(nextDocs.files.includes('src/components/card.css'));
assert.equal(laravelDocs.framework, 'laravel');
assert.equal(laravelDocs.adapterName, 'phantom-laravel');
assert.ok(laravelDocs.manifest.includes('"framework": "laravel"'));
assert.ok(laravelDocs.files.includes('src/manifest.json'));
assert.ok(laravelDocs.files.includes('src/components/button.css'));

const custom = createFrameworkAdapter('react', {
  tokens: {
    themes: {
      light: {
        spacing: {
          4: '1.25rem'
        }
      }
    }
  }
});

assert.equal(custom.framework, 'react');
assert.ok(custom.files['src/theme.css'].includes('--pc-spacing-4'));
assert.equal(custom.files['src/components/button.css'], '.ui-button { display: inline-flex; align-items: center; justify-content: center; padding: var(--pc-spacing-2) var(--pc-spacing-4); border-radius: var(--pc-radius-md); background: var(--pc-color-primary-500); color: white; }\n');
assert.equal(custom.files['src/components/card.css'], '.ui-card { background: white; border-radius: var(--pc-radius-lg); box-shadow: var(--pc-shadow-md); padding: var(--pc-spacing-4); }\n');
assert.ok(custom.files['templates/app-entry.js'].includes("phantom.files['src/index.css']"));

const viaGetter = getFrameworkAdapter('vue');
assert.equal(viaGetter.framework, 'vue');

const reactSnapshot = createFrameworkAdapter('react');
assert.equal(reactSnapshot.files['src/phantom.config.json'], '{\n  "framework": "react"\n}');
assert.ok(reactSnapshot.files['src/theme.css'].startsWith(':root {'));
assert.ok(reactSnapshot.files['src/components/input.css'].includes('.ui-input'));
assert.equal(JSON.parse(reactSnapshot.files['src/manifest.json']).framework, 'react');
assert.equal(JSON.parse(reactSnapshot.files['src/manifest.json']).components.button, 'src/components/button.css');
assert.deepEqual(
  Object.keys(reactSnapshot.files).sort(),
  [
    'src/components/button.css',
    'src/components/card.css',
    'src/components/input.css',
    'src/index.css',
    'src/manifest.json',
    'src/phantom.config.json',
    'src/theme.css',
    'src/tokens.json',
    'templates/app-entry.js'
  ]
);

const nextSnapshot = createFrameworkAdapter('next');
assert.equal(nextSnapshot.framework, 'next');
assert.ok(nextSnapshot.files['templates/app-entry.js'].includes('phantomComponents'));
assert.ok(nextSnapshot.files['templates/app-entry.js'].includes("phantom.files['src/components/button.css']"));
assert.ok(nextSnapshot.files['templates/app-entry.js'].includes("phantom.files['src/components/card.css']"));
assert.ok(nextSnapshot.files['templates/app-entry.js'].includes("phantom.files['src/components/input.css']"));
assert.ok(nextSnapshot.files['src/manifest.json'].includes('"framework": "next"'));
assert.ok(nextSnapshot.files['src/manifest.json'].includes('"components"'));
assert.ok(Object.keys(nextSnapshot.files).includes('src/components/button.css'));
assert.ok(Object.keys(nextSnapshot.files).includes('src/components/card.css'));
assert.ok(Object.keys(nextSnapshot.files).includes('src/components/input.css'));
assert.ok(Object.keys(nextSnapshot.files).includes('src/manifest.json'));
assert.ok(nextSnapshot.files['src/theme.css'].includes('--pc-color-primary-500'));

const vueSnapshot = createFrameworkAdapter('vue');
assert.equal(vueSnapshot.framework, 'vue');
assert.ok(vueSnapshot.files['templates/app-entry.js'].includes('phantomStylesheet'));
assert.ok(vueSnapshot.files['templates/app-entry.js'].includes('phantomConfig'));
assert.ok(vueSnapshot.files['templates/app-entry.js'].includes('usePhantomCSS'));
assert.equal(JSON.parse(vueSnapshot.files['src/manifest.json']).framework, 'vue');
assert.equal(JSON.parse(vueSnapshot.files['src/manifest.json']).components.input, 'src/components/input.css');

const nuxtSnapshot = createFrameworkAdapter('nuxt');
assert.equal(nuxtSnapshot.framework, 'nuxt');
assert.ok(nuxtSnapshot.files['templates/app-entry.js'].includes('definePhantomNuxtPlugin'));
assert.ok(nuxtSnapshot.files['templates/app-entry.js'].includes("name: 'phantom-css'"));
assert.deepEqual(
  Object.keys(nuxtSnapshot.files).sort(),
  [
    'src/components/button.css',
    'src/components/card.css',
    'src/components/input.css',
    'src/index.css',
    'src/manifest.json',
    'src/phantom.config.json',
    'src/theme.css',
    'src/tokens.json',
    'templates/app-entry.js'
  ]
);

const svelteSnapshot = createFrameworkAdapter('svelte');
assert.equal(svelteSnapshot.framework, 'svelte');
assert.ok(svelteSnapshot.files['templates/app-entry.js'].includes('usePhantomSvelteAssets'));
assert.ok(svelteSnapshot.files['templates/app-entry.js'].includes('phantomImportMap'));
assert.ok(svelteSnapshot.files['templates/app-entry.js'].includes('phantomTheme'));
assert.equal(JSON.parse(svelteSnapshot.files['src/manifest.json']).framework, 'svelte');
assert.equal(JSON.parse(svelteSnapshot.files['src/manifest.json']).components.button, 'src/components/button.css');

const angularSnapshot = createFrameworkAdapter('angular');
assert.equal(angularSnapshot.framework, 'angular');
assert.ok(angularSnapshot.files['templates/app-entry.js'].includes('providePhantomCSS'));
assert.ok(angularSnapshot.files['templates/app-entry.js'].includes('phantomAngularProvider'));
assert.ok(angularSnapshot.files['templates/app-entry.js'].includes('phantomImportMap'));
assert.equal(JSON.parse(angularSnapshot.files['src/manifest.json']).framework, 'angular');
assert.equal(JSON.parse(angularSnapshot.files['src/manifest.json']).components.input, 'src/components/input.css');
assert.deepEqual(
  Object.keys(angularSnapshot.files).sort(),
  [
    'src/components/button.css',
    'src/components/card.css',
    'src/components/input.css',
    'src/index.css',
    'src/manifest.json',
    'src/phantom.config.json',
    'src/theme.css',
    'src/tokens.json',
    'templates/app-entry.js'
  ]
);

const laravelSnapshot = createFrameworkAdapter('laravel');
assert.equal(laravelSnapshot.framework, 'laravel');
assert.ok(laravelSnapshot.files['templates/app-entry.js'].includes('usePhantomLaravelAssets'));
assert.ok(laravelSnapshot.files['templates/app-entry.js'].includes('phantomImportMap'));
assert.ok(laravelSnapshot.files['templates/app-entry.js'].includes('resolvePhantomAsset'));
assert.ok(laravelSnapshot.files['templates/app-entry.js'].includes("phantomManifest.files['src/manifest.json']"));
assert.equal(JSON.parse(laravelSnapshot.files['src/manifest.json']).framework, 'laravel');
assert.equal(JSON.parse(laravelSnapshot.files['src/manifest.json']).components.card, 'src/components/card.css');
assert.deepEqual(
  Object.keys(laravelSnapshot.files).sort(),
  [
    'src/components/button.css',
    'src/components/card.css',
    'src/components/input.css',
    'src/index.css',
    'src/manifest.json',
    'src/phantom.config.json',
    'src/theme.css',
    'src/tokens.json',
    'templates/app-entry.js'
  ]
);

const plainSnapshot = createFrameworkAdapter('plain');
assert.equal(plainSnapshot.framework, 'plain');
assert.ok(plainSnapshot.files['templates/app-entry.js'].includes('phantomStylesheet'));
assert.deepEqual(
  Object.keys(plainSnapshot.files).sort(),
  [
    'src/components/button.css',
    'src/components/card.css',
    'src/components/input.css',
    'src/index.css',
    'src/manifest.json',
    'src/phantom.config.json',
    'src/theme.css',
    'src/tokens.json',
    'templates/app-entry.js'
  ]
);

console.log('✅ Phantom CSS adapters tests passed!');
