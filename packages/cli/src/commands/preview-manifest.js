import { createPreviewApp } from '@phantom-css/web';
import { writeJsonFile } from '../fs.js';

export function previewManifest(options = {}) {
  const preview = createPreviewApp(options);
  const filePath = options.file || options.out || null;
  const spacing = options.pretty ? 2 : 0;

  if (filePath) {
    writeJsonFile(filePath, preview.manifest);
  }

  if (options.stdout) {
    console.log(JSON.stringify(preview.manifest, null, spacing));
    return null;
  }

  return {
    ok: true,
    mode: 'manifest',
    manifest: preview.manifest,
    filePath: filePath || undefined,
    manifestPath: filePath || undefined
  };
}

export default previewManifest;
