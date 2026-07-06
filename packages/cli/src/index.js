#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initProject } from './commands/init.js';
import { makeTheme } from './commands/make-theme.js';
import { makeTokens } from './commands/make-tokens.js';
import { makePalette } from './commands/make-palette.js';
import { makeUtility } from './commands/make-utility.js';
import { makeUtilities } from './commands/make-utilities.js';
import { makeComponent } from './commands/make-component.js';
import { makeRecipe } from './commands/make-recipe.js';
import { makeKit } from './commands/make-kit.js';
import { makeAdapter } from './commands/make-adapter.js';
import { exportTheme } from './commands/export-theme.js';
import { importTheme } from './commands/import-theme.js';
import { themeList } from './commands/theme-list.js';
import { themeSwitch } from './commands/theme-switch.js';
import { preview } from './commands/preview.js';
import { previewManifest } from './commands/preview-manifest.js';
import { help } from './commands/help.js';

function parseArgs(argv = []) {
  const [command = 'help', maybeSubject = '', ...rest] = argv;
  const subject = maybeSubject.startsWith('--') ? '' : maybeSubject;
  const optionTokens = maybeSubject.startsWith('--') ? [maybeSubject, ...rest] : rest;
  const options = {};
  for (const token of optionTokens) {
    if (!token.startsWith('--')) continue;
    const [key, rawValue] = token.slice(2).split('=');
    options[key] = rawValue === undefined ? true : rawValue;
  }
  return { command, subject, options };
}

const parsed = parseArgs(process.argv.slice(2));

async function run() {
  const rootDir = process.cwd();
  const { command, subject, options } = parsed;

  switch (command) {
    case 'init':
      return initProject(rootDir, {
        name: options.name || subject || 'phantom-app',
        framework: options.framework || 'plain',
        theme: options.theme || 'light'
      });
    case 'make:theme':
      return makeTheme(rootDir, subject || 'theme', options);
    case 'make:tokens':
      return makeTokens(rootDir, subject || 'tokens', options);
    case 'make:palette':
      return makePalette(rootDir, subject || 'palette', options);
    case 'make:utility':
      return makeUtility(rootDir, subject || 'utility', options);
    case 'make:utilities':
      return makeUtilities(rootDir, subject || 'utilities', options);
    case 'make:component':
      return makeComponent(rootDir, subject || 'component', options);
    case 'make:recipe':
      return makeRecipe(rootDir, subject || 'recipe', options);
    case 'make:kit':
      return makeKit(rootDir, subject || 'kit', options);
    case 'make:adapter':
      return makeAdapter(rootDir, subject || 'plain', options);
    case 'export:theme':
      return exportTheme(rootDir, subject || 'theme', options);
    case 'import:theme':
      return importTheme(rootDir, subject || 'theme', options);
    case 'theme:list':
      return themeList(options);
    case 'theme:switch':
      return themeSwitch(rootDir, subject || options.theme || 'light', options);
    case 'preview:manifest':
      if (options.help || options.h) {
        return help('preview:manifest');
      }
      return previewManifest(options);
    case 'preview': {
      if (options.help || options.h) {
        return help('preview');
      }
      const result = await preview(rootDir, subject || 'build', options);
      if ((subject === 'html' || options.stdout) && !options.json) {
        console.log(result.html);
        return null;
      }
      return result;
    }
    case 'help':
      return help(subject || '');
    default:
      return help();
  }
}

const result = await run();
if (result && typeof result === 'object') {
  const { server, watcher, ...safeResult } = result;
  const spacing = parsed.options.pretty ? 2 : 0;
  console.log(JSON.stringify(safeResult, null, spacing));
}
