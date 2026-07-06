import { buildStylesheet, createPhantomTheme, createRecipe } from '../../core/src/index.js';

export const frameworkNames = [
  'react',
  'vue',
  'next',
  'nuxt',
  'svelte',
  'angular',
  'laravel',
  'plain'
];

function buildStarter(framework) {
  switch (framework) {
    case 'react':
      return `import { installPhantomCSS } from '@phantom-css/adapters/react';\n\nexport const phantom = installPhantomCSS();\nexport const phantomStylesheet = phantom.files['src/index.css'];\nexport const phantomConfig = phantom.files['src/phantom.config.json'];\nexport default phantom;\n`;
    case 'vue':
      return `import { installPhantomCSS } from '@phantom-css/adapters/vue';\n\nexport function usePhantomCSS(app) {\n  const phantom = installPhantomCSS({ app });\n  const phantomStylesheet = phantom.files['src/index.css'];\n  const phantomConfig = phantom.files['src/phantom.config.json'];\n  return { app, phantom, phantomStylesheet, phantomConfig };\n}\n\nexport default usePhantomCSS;\n`;
    case 'next':
      return `import { installPhantomCSS } from '@phantom-css/adapters/next';\n\nexport const phantom = installPhantomCSS();\nexport const phantomConfig = phantom.files['src/phantom.config.json'];\nexport const phantomStylesheet = phantom.files['src/index.css'];\nexport const phantomComponents = {\n  button: phantom.files['src/components/button.css'],\n  card: phantom.files['src/components/card.css'],\n  input: phantom.files['src/components/input.css']\n};\nexport default phantom;\n`;
    case 'nuxt':
      return `import { installPhantomCSS } from '@phantom-css/adapters/nuxt';\n\nexport function definePhantomNuxtPlugin() {\n  const phantom = installPhantomCSS();\n  return {\n    name: 'phantom-css',\n    phantom,\n    phantomStylesheet: phantom.files['src/index.css'],\n    phantomConfig: phantom.files['src/phantom.config.json']\n  };\n}\n\nexport default definePhantomNuxtPlugin;\n`;
    case 'svelte':
      return `import { installPhantomCSS } from '@phantom-css/adapters/svelte';\n\nexport const phantomManifest = installPhantomCSS();\nexport const phantomImportMap = {\n  manifest: phantomManifest.files['src/manifest.json'],\n  config: phantomManifest.files['src/phantom.config.json'],\n  stylesheet: phantomManifest.files['src/index.css'],\n  theme: phantomManifest.files['src/theme.css'],\n  components: {\n    button: phantomManifest.files['src/components/button.css'],\n    card: phantomManifest.files['src/components/card.css'],\n    input: phantomManifest.files['src/components/input.css']\n  }\n};\n\nexport const phantomStylesheet = phantomImportMap.stylesheet;\nexport const phantomTheme = phantomManifest.theme;\nexport function usePhantomSvelteAssets() {\n  return phantomImportMap;\n}\n\nexport default usePhantomSvelteAssets;\n`;
    case 'angular':
      return `import { installPhantomCSS } from '@phantom-css/adapters/angular';\n\nexport function providePhantomCSS() {\n  const phantomManifest = installPhantomCSS();\n  return {\n    phantomManifest,\n    phantomImportMap: {\n      manifest: phantomManifest.files['src/manifest.json'],\n      config: phantomManifest.files['src/phantom.config.json'],\n      stylesheet: phantomManifest.files['src/index.css'],\n      theme: phantomManifest.files['src/theme.css']\n    }\n  };\n}\n\nexport const phantomAngularProvider = providePhantomCSS;\n\nexport default phantomAngularProvider;\n`;
    case 'laravel':
      return `import { installPhantomCSS } from '@phantom-css/adapters/laravel';\n\nexport const phantomManifest = installPhantomCSS();\nexport const phantomImportMap = {\n  manifest: phantomManifest.files['src/manifest.json'],\n  config: phantomManifest.files['src/phantom.config.json'],\n  stylesheet: phantomManifest.files['src/index.css'],\n  theme: phantomManifest.files['src/theme.css'],\n  components: {\n    button: phantomManifest.files['src/components/button.css'],\n    card: phantomManifest.files['src/components/card.css'],\n    input: phantomManifest.files['src/components/input.css']\n  }\n};\n\nexport const phantomStylesheet = phantomImportMap.stylesheet;\nexport const phantomTheme = phantomManifest.theme;\nexport function resolvePhantomAsset(name) {\n  return phantomManifest.files[name] ?? null;\n}\n\nexport function usePhantomLaravelAssets() {\n  return phantomImportMap;\n}\n\nexport default usePhantomLaravelAssets;\n`;
    case 'plain':
    default:
      return `import { installPhantomCSS } from '@phantom-css/adapters/plain';\n\nexport const phantomStylesheet = installPhantomCSS();\nexport default phantomStylesheet;\n`;
  }
}

function buildComponentFiles() {
  const button = createRecipe('button');
  const card = createRecipe('card');
  const input = createRecipe('input');

  return {
    'src/components/button.css': `${button.css}\n`,
    'src/components/card.css': `${card.css}\n`,
    'src/components/input.css': `${input.css}\n`
  };
}

function buildManifestFile(framework, theme) {
  return JSON.stringify(
    {
      framework,
      packageName: '@phantom-css/adapters',
      adapterName: `phantom-${framework}`,
      stylesheet: 'src/index.css',
      theme: 'src/theme.css',
      config: 'src/phantom.config.json',
      components: {
        button: 'src/components/button.css',
        card: 'src/components/card.css',
        input: 'src/components/input.css'
      },
      tokens: theme.tokens
    },
    null,
    2
  );
}

export function createFrameworkAdapter(framework = 'plain', options = {}) {
  const theme = options.theme || createPhantomTheme(options.tokens || {});
  const stylesheet = buildStylesheet({ theme });
  const starter = options.starter || buildStarter(framework);
  const componentFiles = buildComponentFiles();
  const themeVariables = Object.entries(theme.cssVariables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    framework,
    packageName: '@phantom-css/adapters',
    adapterName: `phantom-${framework}`,
    theme,
    stylesheet: stylesheet.css,
    tokens: theme.tokens,
    files: {
      'src/index.css': stylesheet.css,
      'src/theme.css': `:root {\n${themeVariables}\n}\n`,
      'src/tokens.json': JSON.stringify(theme.tokens, null, 2),
      'src/phantom.config.json': JSON.stringify({ framework }, null, 2),
      'src/manifest.json': buildManifestFile(framework, theme),
      'templates/app-entry.js': starter,
      ...componentFiles
    }
  };
}

export function listFrameworkAdapters() {
  return [...frameworkNames];
}

export function getFrameworkAdapter(framework = 'plain', options = {}) {
  return createFrameworkAdapter(framework, options);
}

export function installPhantomCSS(framework = 'plain', options = {}) {
  return createFrameworkAdapter(framework, options);
}

export default {
  frameworkNames,
  createFrameworkAdapter,
  listFrameworkAdapters,
  getFrameworkAdapter,
  installPhantomCSS
};
