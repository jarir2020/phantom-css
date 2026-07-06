import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initProject } from './src/commands/init.js';
import { makeTheme } from './src/commands/make-theme.js';
import { makeComponent } from './src/commands/make-component.js';
import { makeAdapter } from './src/commands/make-adapter.js';
import { themeList } from './src/commands/theme-list.js';
import { themeSwitch } from './src/commands/theme-switch.js';
import { preview } from './src/commands/preview.js';
import { help } from './src/commands/help.js';

const root = mkdtempSync(join(tmpdir(), 'phantom-cli-'));
const cliEntry = fileURLToPath(new URL('./src/index.js', import.meta.url));

const init = initProject(root, { name: 'demo-phantom', framework: 'react', theme: 'dark' });
assert.equal(init.ok, true);
assert.ok(readFileSync(join(root, 'package.json'), 'utf8').includes('demo-phantom'));
assert.ok(readFileSync(join(root, 'phantom.config.json'), 'utf8').includes('"framework": "react"'));

const theme = makeTheme(root, 'brand-theme', { preset: 'brand' });
assert.equal(theme.ok, true);
assert.ok(readFileSync(theme.filePath, 'utf8').includes('"preset": "brand"'));

const adapter = makeAdapter(root, 'react');
assert.equal(adapter.ok, true);
assert.ok(readFileSync(join(root, 'adapters/react/index.css'), 'utf8').includes('.ui-button'));

const component = makeComponent(root, 'badge');
assert.equal(component.ok, true);
assert.ok(readFileSync(component.filePath, 'utf8').includes('.ui-badge'));
assert.ok(readFileSync(component.metaPath, 'utf8').includes('"className": "ui-badge"'));

const helpOutput = help();
assert.ok(helpOutput.commands.includes('phantom make:adapter'));
assert.ok(helpOutput.commands.includes('phantom theme:list'));
assert.ok(helpOutput.commands.includes('phantom theme:switch'));
assert.ok(helpOutput.commands.includes('phantom preview serve'));
assert.ok(helpOutput.commands.includes('phantom preview watch'));
assert.ok(helpOutput.commands.includes('phantom preview open'));
assert.equal(helpOutput.preview.usage, 'phantom preview <build|html|serve|open|watch>');
assert.ok(helpOutput.preview.examples.includes('phantom preview serve --open'));
assert.equal(helpOutput.manifest.usage, 'phantom preview:manifest [--json] [--pretty] [--stdout] [--file=manifest.json]');
assert.ok(helpOutput.manifest.examples.includes('phantom preview:manifest --json --pretty'));
assert.ok(helpOutput.preview.examples.includes('phantom preview --json --file=preview.json'));

const manifestHelp = help('preview:manifest');
assert.equal(manifestHelp.topic, 'preview:manifest');
assert.ok(manifestHelp.examples.includes('phantom help preview:manifest'));

const previewHelp = help('preview');
assert.equal(previewHelp.topic, 'preview');
assert.ok(previewHelp.examples.includes('phantom preview --json --file=preview.json'));

const themes = themeList();
assert.equal(themes.ok, true);
assert.equal(themes.count, 30);
assert.ok(themes.themes.includes('light'));

const themeListFile = join(root, 'docs', 'themes.json');
const writtenThemes = themeList({ file: themeListFile });
assert.equal(writtenThemes.filePath, themeListFile);
assert.ok(readFileSync(themeListFile, 'utf8').includes('"count": 30'));

const themeListStdout = execFileSync(process.execPath, [cliEntry, 'theme:list', '--stdout', '--pretty'], {
  encoding: 'utf8'
});
const themeListStdoutData = JSON.parse(themeListStdout);
assert.equal(themeListStdoutData.count, 30);
assert.ok(themeListStdout.includes('\n  "count": 30'));

const switchResult = themeSwitch(root, 'dark');
assert.equal(switchResult.ok, true);
assert.equal(switchResult.theme, 'dark');
assert.ok(readFileSync(join(root, 'phantom.config.json'), 'utf8').includes('"theme": "dark"'));
assert.ok(readFileSync(join(root, 'src/theme.css'), 'utf8').includes('--pc-color-primary-500'));
assert.ok(readFileSync(join(root, 'themes/dark.json'), 'utf8').includes('"preset": "dark"'));

const switchCli = execFileSync(process.execPath, [cliEntry, 'theme:switch', 'brand'], {
  cwd: root,
  encoding: 'utf8'
});
const switchCliData = JSON.parse(switchCli);
assert.equal(switchCliData.theme, 'brand');
assert.ok(readFileSync(join(root, 'themes/brand.json'), 'utf8').includes('"preset": "brand"'));

const previewBuild = await preview(root, 'build', { out: join(root, 'preview-site') });
assert.equal(previewBuild.ok, true);
assert.equal(previewBuild.mode, 'build');
assert.ok(readFileSync(previewBuild.htmlPath, 'utf8').includes('Theme Gallery'));
assert.ok(readFileSync(previewBuild.manifestPath, 'utf8').includes('semantic-elements'));
assert.equal(previewBuild.preview.name, 'Phantom CSS Preview App');

const previewJson = await preview(root, 'build', { json: true, out: join(root, 'preview-json-site') });
assert.equal(previewJson.ok, true);
assert.equal(previewJson.mode, 'build');
assert.ok(previewJson.preview.manifest.pages.length >= 2);
assert.ok(previewJson.preview.manifest.pages[0].cards.length > 0);
assert.ok(previewJson.html.includes('Theme Gallery'));

const previewFile = join(root, 'docs', 'preview.json');
const previewJsonFileResult = await preview(root, 'build', {
  json: true,
  file: previewFile,
  out: join(root, 'preview-json-file-site')
});
assert.equal(previewJsonFileResult.ok, true);
const previewFileData = JSON.parse(readFileSync(previewFile, 'utf8'));
assert.equal(previewFileData.mode, 'build');
assert.ok(previewFileData.preview.manifest.pages.length >= 2);

const compactPreview = execFileSync(process.execPath, [cliEntry, 'preview', '--json'], {
  encoding: 'utf8'
});
assert.ok(compactPreview.trim().startsWith('{"ok":true'));

const prettyPreview = execFileSync(process.execPath, [cliEntry, 'preview', '--json', '--pretty'], {
  encoding: 'utf8'
});
assert.ok(prettyPreview.includes('\n  "ok": true'));

const manifestOutput = execFileSync(process.execPath, [cliEntry, 'preview:manifest', '--pretty'], {
  encoding: 'utf8'
});
const manifestData = JSON.parse(manifestOutput);
assert.equal(manifestData.mode, 'manifest');
assert.ok(manifestData.manifest.pages.length >= 2);

const manifestFile = join(root, 'docs', 'preview.manifest.json');
const manifestFileOutput = execFileSync(process.execPath, [cliEntry, 'preview:manifest', `--file=${manifestFile}`, '--pretty'], {
  encoding: 'utf8'
});
const manifestFileData = JSON.parse(manifestFileOutput);
assert.equal(manifestFileData.filePath, manifestFile);
assert.equal(manifestFileData.manifestPath, manifestFile);
assert.ok(readFileSync(manifestFile, 'utf8').includes('"theme-gallery"'));
assert.ok(manifestFileOutput.includes('\n  "filePath"'));

const manifestStdout = execFileSync(process.execPath, [cliEntry, 'preview:manifest', '--stdout', '--pretty'], {
  encoding: 'utf8'
});
const manifestStdoutData = JSON.parse(manifestStdout);
assert.equal(manifestStdoutData.name, 'Phantom CSS Preview Manifest');
assert.equal(manifestStdoutData.version, '1.0.0');
assert.ok(!Object.prototype.hasOwnProperty.call(manifestStdoutData, 'ok'));
assert.ok(manifestStdout.includes('\n  "name": "Phantom CSS Preview Manifest"'));

const previewManifestHelpOutput = execFileSync(process.execPath, [cliEntry, 'preview:manifest', '--help'], {
  encoding: 'utf8'
});
const previewManifestHelpData = JSON.parse(previewManifestHelpOutput);
assert.equal(previewManifestHelpData.topic, 'preview:manifest');
assert.ok(previewManifestHelpData.examples.includes('phantom help preview:manifest'));

const previewHelpOutput = execFileSync(process.execPath, [cliEntry, 'preview', '--help'], {
  encoding: 'utf8'
});
const previewHelpData = JSON.parse(previewHelpOutput);
assert.equal(previewHelpData.topic, 'preview');
assert.ok(previewHelpData.examples.includes('phantom preview --json --file=preview.json'));

const originalLog = console.log;
let previewHtml;
try {
  console.log = () => {};
  previewHtml = await preview(root, 'html');
} finally {
  console.log = originalLog;
}
assert.equal(previewHtml.ok, true);
assert.equal(previewHtml.mode, 'html');
assert.equal(previewHtml.themes, 30);
assert.ok(previewHtml.html.includes('Theme Gallery'));

const previewServer = await preview(root, 'serve', { port: 0, out: join(root, 'serve-site') });
assert.equal(previewServer.ok, true);
assert.equal(previewServer.mode, 'serve');
const previewResponse = await fetch(previewServer.url);
assert.equal(previewResponse.status, 200);
assert.ok((await previewResponse.text()).includes('Phantom CSS Preview'));
previewServer.server.close();

const previewOpen = await preview(root, 'open', {
  port: 0,
  open: { command: process.execPath, args: ['-e', 'process.exit(0)'] },
  out: join(root, 'open-site')
});
assert.equal(previewOpen.ok, true);
assert.equal(previewOpen.mode, 'serve');
assert.equal(previewOpen.opened, true);
previewOpen.server.close();

const watchRoot = mkdtempSync(join(tmpdir(), 'phantom-cli-watch-'));
const watchSource = join(watchRoot, 'signal.js');
writeFileSync(watchSource, 'export const signal = 1;\n');
let rebuildCount = 0;
const previewWatch = await preview(root, 'watch', {
  out: join(watchRoot, 'watch-site'),
  watchPaths: [watchSource],
  onRebuild: () => {
    rebuildCount += 1;
  },
  debounceMs: 20
});
assert.equal(previewWatch.ok, true);
assert.equal(previewWatch.mode, 'watch');
await new Promise((resolve) => setTimeout(resolve, 100));
assert.ok(rebuildCount >= 1);
writeFileSync(watchSource, 'export const signal = 2;\n');
await new Promise((resolve) => setTimeout(resolve, 120));
assert.ok(rebuildCount >= 2);
previewWatch.watcher.close();
rmSync(watchRoot, { recursive: true, force: true });

const watchOpenRoot = mkdtempSync(join(tmpdir(), 'phantom-cli-watch-open-'));
const watchOpenSource = join(watchOpenRoot, 'signal.js');
writeFileSync(watchOpenSource, 'export const signal = 1;\n');
let watchOpenRebuilds = 0;
const previewWatchOpen = await preview(root, 'watch', {
  port: 0,
  open: { command: process.execPath, args: ['-e', 'process.exit(0)'] },
  out: join(watchOpenRoot, 'watch-open-site'),
  watchPaths: [watchOpenSource],
  onRebuild: () => {
    watchOpenRebuilds += 1;
  },
  debounceMs: 20
});
assert.equal(previewWatchOpen.ok, true);
assert.equal(previewWatchOpen.mode, 'watch');
assert.equal(previewWatchOpen.opened, true);
assert.ok(previewWatchOpen.url);
await new Promise((resolve) => setTimeout(resolve, 100));
assert.ok(watchOpenRebuilds >= 1);
previewWatchOpen.server.close();
previewWatchOpen.watcher.close();
rmSync(watchOpenRoot, { recursive: true, force: true });

rmSync(root, { recursive: true, force: true });

console.log('✅ Phantom CSS CLI tests passed!');
