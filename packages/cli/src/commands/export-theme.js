import { writeJsonFile } from '../fs.js';
import { getPreset } from '@phantom-css/presets';

export function exportTheme(rootDir, name, options = {}) {
  const preset = getPreset(options.preset || 'light');
  const filePath = `${rootDir}/exports/themes/${name}.json`;
  writeJsonFile(filePath, { name, preset: options.preset || 'light', tokens: preset });
  return { ok: true, filePath, theme: name };
}

export default exportTheme;
