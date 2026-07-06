import { createPhantomTheme } from './theme.js';
import { generateUtilities } from './utilities.js';
import { defaultRecipes } from './recipes.js';

function joinCss(blocks = []) {
  return blocks.filter(Boolean).join('\n');
}

export function compilePhantomCSS(options = {}) {
  const theme = options.theme || createPhantomTheme(options.tokens || {});
  const utilities = options.utilities || generateUtilities(theme.tokens);
  const recipes = options.recipes || Object.values(defaultRecipes);

  const themeVariables = Object.entries(theme.cssVariables)
    .map(([name, value]) => `:root { ${name}: ${value}; }`);

  const darkVariables = Object.entries(theme.darkCssVariables)
    .map(([name, value]) => `[data-theme="dark"] { ${name}: ${value}; }`);

  const utilityCss = utilities.map((utility) => utility.css);
  const recipeCss = recipes.map((recipe) => recipe.css);

  return joinCss([
    ...themeVariables,
    ...darkVariables,
    ...utilityCss,
    ...recipeCss
  ]);
}

export function buildStylesheet(options = {}) {
  return {
    css: compilePhantomCSS(options),
    theme: options.theme || createPhantomTheme(options.tokens || {})
  };
}
