import assert from 'node:assert/strict';
import {
  buildStylesheet,
  compilePhantomCSS,
  createPhantomTheme,
  createRecipe,
  defaultRecipes,
  defaultTokens,
  generateUtilities,
  normalizeTokens
} from './src/index.js';

const normalized = normalizeTokens(defaultTokens);
assert.equal(normalized.name, 'default');
assert.ok(normalized.themes.light.colors.primary[500]);

const theme = createPhantomTheme();
assert.equal(theme.name, 'default');
assert.ok(theme.cssVariables['--pc-spacing-4']);
assert.ok(theme.cssVariables['--pc-font-size-sm']);

const utilities = generateUtilities(theme.tokens);
assert.ok(utilities.some((entry) => entry.name === 'flex'));
assert.ok(utilities.some((entry) => entry.name === 'bg-primary-500'));

const recipe = createRecipe('button');
assert.equal(recipe.className, 'ui-button');
assert.ok(recipe.css.includes('.ui-button'));
assert.equal(recipe.css, '.ui-button { display: inline-flex; align-items: center; justify-content: center; padding: var(--pc-spacing-2) var(--pc-spacing-4); border-radius: var(--pc-radius-md); background: var(--pc-color-primary-500); color: white; }');

const cardRecipe = createRecipe('card');
assert.equal(cardRecipe.className, 'ui-card');
assert.equal(cardRecipe.css, '.ui-card { background: white; border-radius: var(--pc-radius-lg); box-shadow: var(--pc-shadow-md); padding: var(--pc-spacing-4); }');

const fallbackRecipe = createRecipe('badge');
assert.equal(fallbackRecipe.className, 'ui-badge');
assert.equal(fallbackRecipe.css, '.ui-badge { display: block; }');

const stylesheet = compilePhantomCSS({ theme });
assert.ok(stylesheet.includes('.flex'));
assert.ok(stylesheet.includes('.ui-button'));

const built = buildStylesheet();
assert.ok(built.css.length > 0);
assert.ok(built.css.length < 10000);
assert.equal(built.theme.name, 'default');

assert.ok(defaultRecipes.button);
assert.ok(defaultTokens.themes.dark.colors.primary[500]);

console.log('✅ Phantom CSS core tests passed!');
