import { writeJsonFile } from '../fs.js';

export function importTheme(rootDir, fileName, options = {}) {
  const filePath = `${rootDir}/imports/themes/${fileName}.json`;
  writeJsonFile(filePath, {
    source: options.source || 'manual',
    fileName
  });
  return { ok: true, filePath, imported: fileName };
}

export default importTheme;
