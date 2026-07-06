import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createPreviewApp } from './preview.js';

export function createStaticPreviewSite(options = {}) {
  const preview = createPreviewApp(options);

  return {
    name: 'Phantom CSS Static Preview Site',
    preview,
    files: {
      'index.html': preview.html,
      'preview.json': `${JSON.stringify(preview.manifest, null, 2)}\n`
    }
  };
}

export function writePreviewSite(outputDir, options = {}) {
  const site = createStaticPreviewSite(options);
  const rootDir = outputDir || join(process.cwd(), 'preview');
  const htmlPath = join(rootDir, 'index.html');
  const manifestPath = join(rootDir, 'preview.json');

  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, site.files['index.html']);
  writeFileSync(manifestPath, site.files['preview.json']);

  return {
    ok: true,
    outputDir: rootDir,
    htmlPath,
    manifestPath,
    site
  };
}

export default createStaticPreviewSite;
