import { readFileSync } from 'node:fs';
import { createPhantomTheme } from '@phantom-css/core';
import { getPreset } from '@phantom-css/presets';
import { writeJsonFile, writeTextFile } from '../fs.js';

function readConfig(rootDir) {
  const filePath = `${rootDir}/phantom.config.json`;

  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return {
      name: 'phantom-app',
      framework: 'plain',
      theme: 'light'
    };
  }
}

export function themeSwitch(rootDir, name, options = {}) {
  const themeName = options.theme || name || 'light';
  const preset = getPreset(themeName);
  const config = readConfig(rootDir);
  const theme = createPhantomTheme({ themes: { light: preset } });
  const configPath = `${rootDir}/phantom.config.json`;
  const themeCssPath = `${rootDir}/src/theme.css`;
  const themeJsonPath = `${rootDir}/themes/${themeName}.json`;

  const nextConfig = {
    ...config,
    theme: themeName
  };

  writeJsonFile(configPath, nextConfig);
  writeTextFile(
    themeCssPath,
    Object.entries(theme.cssVariables)
      .map(([variable, value]) => `:root { ${variable}: ${value}; }`)
      .join('\n')
  );
  writeJsonFile(themeJsonPath, {
    name: themeName,
    preset: themeName,
    tokens: preset
  });

  return {
    ok: true,
    theme: themeName,
    configPath,
    themeCssPath,
    themeJsonPath
  };
}

export default themeSwitch;
