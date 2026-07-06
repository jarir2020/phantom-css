import { writeJsonFile } from '../fs.js';
import { getPreset } from '@phantom-css/presets';

export function makePalette(rootDir, name, options = {}) {
  const preset = getPreset(options.preset || 'light');
  const filePath = `${rootDir}/palettes/${name}.json`;
  writeJsonFile(filePath, { name, colors: preset.colors || {} });
  return { ok: true, filePath, palette: name };
}

export default makePalette;
