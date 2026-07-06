import { createThemeVariables, mergeTokens, normalizeTokens } from './normalize.js';
import { defaultTokens } from './tokens.js';

export function createPhantomTheme(overrides = {}) {
  const base = normalizeTokens(defaultTokens);
  const merged = normalizeTokens(mergeTokens(base, overrides));

  return {
    name: merged.name,
    version: merged.version,
    tokens: merged,
    cssVariables: createThemeVariables(merged.themes.light),
    darkCssVariables: createThemeVariables(merged.themes.dark),
    extend(extra = {}) {
      return createPhantomTheme(mergeTokens(merged, extra));
    }
  };
}

export function resolveThemeTokens(theme = createPhantomTheme()) {
  return theme.tokens;
}
