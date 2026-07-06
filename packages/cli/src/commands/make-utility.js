import { writeTextFile } from '../fs.js';
import { generateUtilities } from '@phantom-css/core';

export function makeUtility(rootDir, name, options = {}) {
  const utilities = generateUtilities(options.tokens || {});
  const utility = utilities.find((entry) => entry.name === name) || {
    name,
    css: `.${name} { display: block; }`
  };
  const filePath = `${rootDir}/utilities/${name}.css`;
  writeTextFile(filePath, `${utility.css}\n`);
  return { ok: true, filePath, utility: name };
}

export default makeUtility;
