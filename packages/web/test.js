import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createDocsIndex,
  createPlayground,
  createPreviewApp,
  createPreviewWatcher,
  createStaticPreviewSite,
  startPreviewServer,
  createWebManifest,
  writePreviewSite
} from './src/index.js';

const playground = createPlayground();
assert.equal(playground.name, 'Phantom CSS Playground');
assert.ok(playground.css.includes('.ui-button'));
assert.ok(playground.presets.includes('light'));
assert.ok(playground.adapters.includes('react'));

const previewApp = createPreviewApp();
assert.equal(previewApp.name, 'Phantom CSS Preview App');
assert.equal(previewApp.themes.length, 30);
assert.ok(previewApp.html.length < 50000);
assert.ok(previewApp.html.includes('Theme Gallery'));
assert.ok(previewApp.html.includes('Semantic Mappings'));
assert.ok(previewApp.html.includes('<button class="ui-button">button</button>'));

const docs = createDocsIndex();
assert.ok(docs.sections.includes('Adapters'));

const manifest = createWebManifest();
assert.equal(manifest.packageName, '@phantom-css/web');
assert.equal(manifest.docs.name, 'Phantom CSS Docs');
assert.equal(manifest.preview.name, 'Phantom CSS Preview App');
assert.equal(manifest.staticPreview.name, 'Phantom CSS Static Preview Site');

const staticSite = createStaticPreviewSite();
assert.equal(staticSite.files['index.html'].includes('Semantic Mappings'), true);
assert.equal(staticSite.files['preview.json'].includes('theme-gallery'), true);

const tempDir = mkdtempSync(join(tmpdir(), 'phantom-web-site-'));
const written = writePreviewSite(tempDir);
assert.ok(readFileSync(written.htmlPath, 'utf8').includes('Phantom CSS Preview'));
assert.ok(readFileSync(written.manifestPath, 'utf8').includes('semantic-elements'));
rmSync(tempDir, { recursive: true, force: true });

const serverDir = mkdtempSync(join(tmpdir(), 'phantom-web-server-'));
const server = await startPreviewServer(serverDir, {
  port: 0,
  open: { command: process.execPath, args: ['-e', 'process.exit(0)'] }
});
const response = await fetch(server.url);
assert.equal(response.status, 200);
assert.equal(await response.text(), readFileSync(server.htmlPath, 'utf8'));
server.server.close();
rmSync(serverDir, { recursive: true, force: true });

const watchRoot = mkdtempSync(join(tmpdir(), 'phantom-web-watch-'));
const watchSource = join(watchRoot, 'signal.js');
const watchOutput = join(watchRoot, 'out');
writeFileSync(watchSource, 'export const signal = 1;\n');
let rebuildCount = 0;
const watcher = createPreviewWatcher(watchOutput, {
  watchPaths: [watchSource],
  onRebuild: () => {
    rebuildCount += 1;
  },
  debounceMs: 20
});
await new Promise((resolve) => setTimeout(resolve, 100));
assert.ok(rebuildCount >= 1);
writeFileSync(watchSource, 'export const signal = 2;\n');
await new Promise((resolve) => setTimeout(resolve, 120));
assert.ok(rebuildCount >= 2);
watcher.close();
rmSync(watchRoot, { recursive: true, force: true });

console.log('✅ Phantom CSS web tests passed!');
