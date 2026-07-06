import { createTokenGroup } from '../../core/src/index.js';
import lightPreset from './light.js';
import darkPreset from './dark.js';
import neutralPreset from './neutral.js';
import brandPreset from './brand.js';
import themeLibrary, { createThemePack, getThemePreset, listThemeLibrary } from './library.js';
import semanticElementMappings, { createSemanticMap, getSemanticElementMapping, listSemanticElements } from './semantic.js';
import previewManifest, { createPreviewManifest } from './preview.js';

export const presets = {
  light: lightPreset,
  dark: darkPreset,
  neutral: neutralPreset,
  brand: brandPreset,
  ...themeLibrary
};

export function listPresets() {
  return listThemeLibrary();
}

export function getPreset(name = 'light') {
  return getThemePreset(name) || presets.light;
}

export function createPresetTheme(name = 'light', overrides = {}) {
  const preset = getPreset(name);
  return createTokenGroup(overrides, preset);
}

export { lightPreset, darkPreset, neutralPreset, brandPreset };
export { themeLibrary, createThemePack };
export { semanticElementMappings, createSemanticMap, getSemanticElementMapping, listSemanticElements };
export { previewManifest, createPreviewManifest };
export default themeLibrary;
