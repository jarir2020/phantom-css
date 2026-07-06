import { writeJsonFile } from '../fs.js';

export function makeKit(rootDir, name, options = {}) {
  const kit = {
    name,
    components: options.components || ['button', 'input', 'card']
  };
  const filePath = `${rootDir}/kits/${name}.json`;
  writeJsonFile(filePath, kit);
  return { ok: true, filePath, kit: name };
}

export default makeKit;
