import themeLibrary, { createThemePack, listThemeLibrary } from './library.js';
import semanticElementMappings, { createSemanticMap, listSemanticElements } from './semantic.js';
import previewManifest, { createPreviewManifest } from './preview.js';

export const allThemePresets = themeLibrary;
export const allThemeNames = listThemeLibrary();
export const allSemanticElementMappings = semanticElementMappings;
export const allSemanticElementNames = listSemanticElements();
export const allPreviewManifest = previewManifest;

export function createAllThemePack() {
  return createThemePack();
}

export function createAllSemanticMap() {
  return createSemanticMap();
}

export function createAllPreviewManifest() {
  return createPreviewManifest();
}

export default themeLibrary;
