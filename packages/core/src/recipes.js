export const defaultRecipes = {
  button: {
    className: 'ui-button',
    css: '.ui-button { display: inline-flex; align-items: center; justify-content: center; padding: var(--pc-spacing-2) var(--pc-spacing-4); border-radius: var(--pc-radius-md); background: var(--pc-color-primary-500); color: white; }'
  },
  card: {
    className: 'ui-card',
    css: '.ui-card { background: white; border-radius: var(--pc-radius-lg); box-shadow: var(--pc-shadow-md); padding: var(--pc-spacing-4); }'
  },
  input: {
    className: 'ui-input',
    css: '.ui-input { border: 1px solid var(--pc-color-neutral-200); border-radius: var(--pc-radius-md); padding: var(--pc-spacing-2) var(--pc-spacing-3); }'
  }
};

export function createRecipe(name, options = {}) {
  const recipe = defaultRecipes[name] || {
    className: `ui-${name}`,
    css: `.${`ui-${name}`} { display: block; }`
  };

  return {
    name,
    className: options.className || recipe.className,
    css: options.css || recipe.css,
    variants: options.variants || {}
  };
}

export function generateRecipes(names = []) {
  return names.map((name) => createRecipe(name));
}
