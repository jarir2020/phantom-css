import assert from 'node:assert/strict';
import { createAllPreviewManifest, createAllSemanticMap, createAllThemePack, allPreviewManifest, allSemanticElementNames, allThemeNames, allThemePresets } from './src/all.js';
import { createPresetTheme, createThemePack, getPreset, listPresets, presets, previewManifest, semanticElementMappings, themeLibrary } from './src/index.js';

assert.equal(listPresets().length, 30);
assert.equal(allThemeNames.length, 30);
assert.equal(getPreset('light').name, 'light');
assert.equal(getPreset('dark').name, 'dark');
assert.equal(getPreset('missing').name, 'light');
assert.ok(presets.brand.colors.accent[500]);
assert.ok(themeLibrary.ocean.colors.primary[500]);
assert.ok(semanticElementMappings.button);
assert.ok(previewManifest.pages.some((page) => page.name === 'theme-gallery'));

const theme = createPresetTheme('brand', {
  typography: {
    fontFamily: {
      sans: 'Space Grotesk, sans-serif'
    }
  }
});

assert.equal(theme.name, 'brand');
assert.equal(theme.typography.fontFamily.sans, 'Space Grotesk, sans-serif');
assert.equal(theme.colors.primary[500], '#f97316');

const pack = createThemePack(['light', 'dark', 'ocean', 'forest']);
assert.equal(Object.keys(pack).length, 4);
assert.equal(pack.ocean.name, 'ocean');

const allPack = createAllThemePack();
assert.equal(Object.keys(allPack).length, 30);
assert.equal(allThemePresets.sunset.name, 'sunset');

const semanticMap = createAllSemanticMap();
assert.equal(allSemanticElementNames.length > 0, true);
assert.equal(semanticMap.button.className, 'ui-button');

const allPreview = createAllPreviewManifest();
assert.equal(allPreview.pages.length, 2);
assert.equal(allPreviewManifest.name, 'Phantom CSS Preview Manifest');

console.log('✅ Phantom CSS presets tests passed!');
