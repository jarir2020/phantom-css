import { writeJsonFile, writeTextFile } from '../fs.js';
import { createFrameworkAdapter } from '@phantom-css/adapters';

export function makeAdapter(rootDir, framework, options = {}) {
  const adapter = createFrameworkAdapter(framework, options);
  const filePath = `${rootDir}/adapters/${framework}/phantom.config.json`;
  writeJsonFile(filePath, {
    framework: adapter.framework,
    packageName: adapter.packageName,
    adapterName: adapter.adapterName
  });
  writeTextFile(`${rootDir}/adapters/${framework}/index.css`, `${adapter.files['src/index.css']}\n`);
  writeTextFile(`${rootDir}/adapters/${framework}/theme.css`, `${adapter.files['src/theme.css']}\n`);
  writeTextFile(`${rootDir}/adapters/${framework}/components.css`, `${adapter.files['src/components.css']}\n`);
  writeTextFile(`${rootDir}/adapters/${framework}/app-entry.js`, adapter.files['templates/app-entry.js']);
  return { ok: true, filePath, framework };
}

export default makeAdapter;
