import { listPresets } from '@phantom-css/presets';
import { writeJsonFile } from '../fs.js';

export function themeList(options = {}) {
  const payload = {
    ok: true,
    count: listPresets().length,
    themes: listPresets()
  };

  if (options.file) {
    writeJsonFile(options.file, payload);
  }

  if (options.stdout) {
    console.log(JSON.stringify(payload, null, options.pretty ? 2 : 0));
    return null;
  }

  return {
    ...payload,
    filePath: options.file || undefined
  };
}

export default themeList;
