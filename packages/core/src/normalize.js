function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base = {}, overrides = {}) {
  const result = { ...base };

  for (const [key, value] of Object.entries(overrides || {})) {
    if (isObject(value) && isObject(base[key])) {
      result[key] = deepMerge(base[key], value);
      continue;
    }

    result[key] = value;
  }

  return result;
}

export function normalizeTokens(input = {}) {
  const themes = isObject(input.themes) ? input.themes : {};
  const light = isObject(themes.light) ? themes.light : {};
  const dark = isObject(themes.dark) ? themes.dark : {};
  const base = {
    name: input.name || 'default',
    version: input.version || '1.0.0',
    themes: {
      light,
      dark
    }
  };

  return deepMerge(base, input);
}

export function mergeTokens(baseTokens = {}, overrides = {}) {
  return deepMerge(baseTokens, overrides);
}

export function tokenToCssVariables(tokens = {}, prefix = '--pc') {
  const flat = {};

  function walk(value, path = []) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, [...path, String(index)]));
      return;
    }

    if (isObject(value)) {
      for (const [key, child] of Object.entries(value)) {
        walk(child, [...path, key]);
      }
      return;
    }

    flat[`${prefix}-${path.join('-')}`] = String(value);
  }

  walk(tokens);
  return flat;
}

export function createThemeVariables(theme = {}) {
  const vars = {};
  const assign = (prefix, value, path = []) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => assign(prefix, item, [...path, String(index)]));
      return;
    }

    if (isObject(value)) {
      for (const [key, child] of Object.entries(value)) {
        assign(prefix, child, [...path, key]);
      }
      return;
    }

    const suffix = path.length ? `-${path.join('-')}` : '';
    vars[`--pc-${prefix}${suffix}`] = String(value);
  };

  assign('color', theme.colors);
  assign('spacing', theme.spacing);
  assign('font-family', theme.typography?.fontFamily);
  assign('font-size', theme.typography?.fontSize);
  assign('line-height', theme.typography?.lineHeight);
  assign('shadow', theme.shadows);
  assign('radius', theme.radii);
  assign('motion', theme.motion);
  assign('z-index', theme.zIndex);
  assign('breakpoint', theme.breakpoints);
  assign('container', theme.containers);
  assign('border', theme.borders);
  assign('opacity', theme.opacity);
  assign('blur', theme.blur);

  return vars;
}
