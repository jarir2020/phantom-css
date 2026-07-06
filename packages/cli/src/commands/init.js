import { writeJsonFile, writeTextFile } from '../fs.js';
import { createPhantomTheme } from '@phantom-css/core';
import { getPreset } from '@phantom-css/presets';

export function initProject(rootDir, options = {}) {
  const projectName = options.name || 'phantom-app';
  const framework = options.framework || 'plain';
  const themeName = options.theme || 'light';
  const preset = getPreset(themeName);
  const theme = createPhantomTheme({ themes: { light: preset } });

  const files = {
    'package.json': {
      name: projectName,
      private: true,
      type: 'module',
      scripts: {
        dev: 'phantom dev',
        build: 'phantom build'
      }
    },
    'phantom.config.json': {
      name: projectName,
      framework,
      theme: themeName
    },
    'src/index.js': `import { createPhantomTheme } from '@phantom-css/core';\n\nexport const theme = createPhantomTheme();\nconsole.log('Phantom CSS app ready');\n`,
    'src/theme.css': Object.entries(theme.cssVariables)
      .map(([name, value]) => `:root { ${name}: ${value}; }`)
      .join('\n'),
    'README.md': `# ${projectName}\n\nCreated with Phantom CSS.\n`
  };

  for (const [relativePath, content] of Object.entries(files)) {
    const target = `${rootDir}/${relativePath}`;
    if (relativePath.endsWith('.json')) {
      writeJsonFile(target, content);
    } else {
      writeTextFile(target, content);
    }
  }

  return {
    ok: true,
    projectName,
    framework,
    theme: themeName,
    files: Object.keys(files)
  };
}

export default initProject;
