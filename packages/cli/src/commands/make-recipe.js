import { writeJsonFile } from '../fs.js';
import { createRecipe } from '@phantom-css/core';

export function makeRecipe(rootDir, name, options = {}) {
  const recipe = createRecipe(name, options);
  const filePath = `${rootDir}/recipes/${name}.json`;
  writeJsonFile(filePath, recipe);
  return { ok: true, filePath, recipe: name };
}

export default makeRecipe;
