import { writeJsonFile } from '../fs.js';
import { defaultTokens } from '@phantom-css/core';

export function makeTokens(rootDir, name, options = {}) {
  const output = {
    name,
    version: options.version || defaultTokens.version,
    tokens: defaultTokens.themes.light
  };

  const filePath = `${rootDir}/tokens/${name}.json`;
  writeJsonFile(filePath, output);
  return { ok: true, filePath, tokenSet: name };
}

export default makeTokens;
