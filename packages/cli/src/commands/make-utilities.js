import { writeTextFile } from '../fs.js';
import { generateUtilities } from '@phantom-css/core';

export function makeUtilities(rootDir, name, options = {}) {
  const utilities = generateUtilities(options.tokens || {});
  const filePath = `${rootDir}/utilities/${name}.css`;
  writeTextFile(filePath, `${utilities.map((entry) => entry.css).join('\n')}\n`);
  return { ok: true, filePath, count: utilities.length };
}

export default makeUtilities;
