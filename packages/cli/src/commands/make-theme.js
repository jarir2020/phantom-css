import { writeJsonFile } from '../fs.js';
import { getPreset } from '@phantom-css/presets';

export function makeTheme(rootDir, name, options = {}) {
  const preset = getPreset(options.preset || 'light');
  const output = {
    name,
    preset: options.preset || 'light',
    tokens: preset
  };

  const filePath = `${rootDir}/themes/${name}.json`;
  writeJsonFile(filePath, output);
  return { ok: true, filePath, theme: name };
}

export default makeTheme;
