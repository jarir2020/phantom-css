import { writeJsonFile, writeTextFile } from '../fs.js';
import { createRecipe } from '@phantom-css/core';

export function makeComponent(rootDir, name, options = {}) {
  const recipe = createRecipe(name, options);
  const filePath = `${rootDir}/components/${name}.css`;
  const metaPath = `${rootDir}/components/${name}.json`;
  writeTextFile(filePath, `${recipe.css}\n`);
  writeJsonFile(metaPath, recipe);
  return { ok: true, filePath, metaPath, component: name };
}

export default makeComponent;
