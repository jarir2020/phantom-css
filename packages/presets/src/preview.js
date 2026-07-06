import { listThemeLibrary } from './library.js';
import { listSemanticElements } from './semantic.js';

export function createPreviewManifest() {
  const themes = listThemeLibrary();
  const semanticElements = listSemanticElements();

  return {
    name: 'Phantom CSS Preview Manifest',
    version: '1.0.0',
    themes,
    semanticElements,
    pages: [
      {
        name: 'theme-gallery',
        title: 'Theme Gallery',
        description: 'Preview all preset themes in one place.',
        route: '/preview/themes',
        cards: themes.map((theme) => ({
          theme,
          title: `${theme} theme`,
          sample: `<section class="ui-card ${theme}">Preview ${theme}</section>`
        }))
      },
      {
        name: 'semantic-elements',
        title: 'Semantic Elements',
        description: 'Preview the element-to-theme mappings that cover common HTML tags.',
        route: '/preview/elements',
        elements: semanticElements.map((tag) => ({
          tag,
          mapping: tag,
          sample: `<${tag}>${tag}</${tag}>`
        }))
      }
    ]
  };
}

export const previewManifest = createPreviewManifest();

export default previewManifest;
