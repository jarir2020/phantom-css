const utilityMap = [
  ['flex', 'display: flex;'],
  ['inline-flex', 'display: inline-flex;'],
  ['grid', 'display: grid;'],
  ['items-center', 'align-items: center;'],
  ['justify-between', 'justify-content: space-between;'],
  ['gap-4', 'gap: var(--pc-spacing-4);'],
  ['p-4', 'padding: var(--pc-spacing-4);'],
  ['px-6', 'padding-left: var(--pc-spacing-6); padding-right: var(--pc-spacing-6);'],
  ['py-2', 'padding-top: var(--pc-spacing-2); padding-bottom: var(--pc-spacing-2);'],
  ['text-sm', 'font-size: var(--pc-font-size-sm);'],
  ['font-medium', 'font-weight: 500;'],
  ['rounded-lg', 'border-radius: var(--pc-radius-lg);'],
  ['shadow-md', 'box-shadow: var(--pc-shadow-md);']
];

function toUtilityRule(name, declaration) {
  return `.${name} { ${declaration} }`;
}

export function generateUtilities(tokens = {}) {
  const spacing = tokens.themes?.light?.spacing || {};
  const colors = tokens.themes?.light?.colors || {};
  const baseUtilities = utilityMap.map(([name, declaration]) => ({
    name,
    declaration,
    css: toUtilityRule(name, declaration)
  }));

  const semanticColors = Object.entries(colors).flatMap(([group, shades]) => {
    if (!shades || typeof shades !== 'object') return [];

    return Object.entries(shades).map(([shade, value]) => ({
      name: `bg-${group}-${shade}`,
      declaration: `background-color: ${value};`,
      css: toUtilityRule(`bg-${group}-${shade}`, `background-color: ${value};`)
    }));
  });

  const semanticSpacing = Object.entries(spacing).map(([scale, value]) => ({
    name: `space-${scale}`,
    declaration: `--pc-space-${scale}: ${value};`,
    css: `:root { --pc-space-${scale}: ${value}; }`
  }));

  return [...baseUtilities, ...semanticColors, ...semanticSpacing];
}

export function generateResponsiveUtility(name, breakpoint, declaration) {
  return `@media (min-width: var(--pc-breakpoint-${breakpoint})) { .${breakpoint}\\:${name} { ${declaration} } }`;
}
