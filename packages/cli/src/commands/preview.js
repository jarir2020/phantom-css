import { createPreviewApp, createPreviewWatcher, startPreviewServer, writePreviewSite } from '@phantom-css/web';
import { writeJsonFile } from '../fs.js';

export async function preview(rootDir, subject = 'build', options = {}) {
  const preview = createPreviewApp(options);
  const outputDir = options.out || options.output || `${rootDir}/preview`;

  if (subject === 'open') {
    subject = 'serve';
    options = { ...options, open: options.open ?? true };
  }

  if (subject === 'serve') {
    const server = await startPreviewServer(outputDir, options);
    const result = {
      ok: true,
      mode: 'serve',
      name: preview.name,
      preview: {
        name: preview.name,
        themes: preview.themes,
        manifest: preview.manifest,
        html: options.json ? preview.html : undefined
      },
      ...server,
      themes: preview.themes.length
    };
    if (options.file) {
      writeJsonFile(options.file, result);
    }
    return result;
  }

  if (subject === 'watch') {
    let server = null;
    if (options.open) {
      server = await startPreviewServer(outputDir, options);
    }
    const watcher = createPreviewWatcher(outputDir, options);
    const result = {
      ok: true,
      mode: 'watch',
      name: preview.name,
      outputDir,
      opened: Boolean(options.open),
      ...(server || {}),
      watchPaths: watcher.watchPaths,
      themes: preview.themes.length,
      preview: {
        name: preview.name,
        themes: preview.themes,
        manifest: preview.manifest,
        html: options.json ? preview.html : undefined
      },
      watcher
    };
    if (options.file) {
      writeJsonFile(options.file, result);
    }
    return result;
  }

  const site = writePreviewSite(outputDir, options);
  const outputMode = subject === 'html' || options.stdout ? 'html' : 'build';

  const result = {
    ok: true,
    mode: outputMode,
    name: preview.name,
    outputDir: site.outputDir,
    htmlPath: site.htmlPath,
    manifestPath: site.manifestPath,
    themes: preview.themes.length,
    preview: {
      name: preview.name,
      themes: preview.themes,
      manifest: preview.manifest,
      html: options.json ? preview.html : undefined
    },
    html: subject === 'html' || options.stdout || options.json ? preview.html : undefined,
    format: subject === 'html' || options.stdout ? 'html' : 'json'
  };
  if (options.file) {
    writeJsonFile(options.file, result);
  }
  return result;
}

export default preview;
