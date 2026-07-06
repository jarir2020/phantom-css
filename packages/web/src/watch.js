import { existsSync, readdirSync, statSync, watch } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writePreviewSite } from './static.js';

function collectWatchDirectories(paths) {
  const dirs = new Set();

  for (const input of paths) {
    if (!existsSync(input)) continue;

    const stack = [input];
    while (stack.length > 0) {
      const current = stack.pop();
      const stat = statSync(current);

      if (stat.isDirectory()) {
        dirs.add(current);
        for (const entry of readdirSync(current)) {
          stack.push(join(current, entry));
        }
      } else {
        dirs.add(dirname(current));
      }
    }
  }

  return [...dirs];
}

function defaultPreviewWatchPaths() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return [
    join(currentDir, '../../presets/src'),
    join(currentDir, './preview.js'),
    join(currentDir, './static.js'),
    join(currentDir, './server.js')
  ];
}

export function createPreviewWatcher(outputDir, options = {}) {
  const watchPaths = collectWatchDirectories(options.watchPaths || defaultPreviewWatchPaths());
  const listeners = [];
  let timer = null;
  let rebuilding = false;

  const rebuild = () => {
    rebuilding = true;
    const site = writePreviewSite(outputDir, options);
    if (typeof options.onRebuild === 'function') {
      options.onRebuild(site);
    }
    rebuilding = false;
    return site;
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      rebuild();
    }, Number(options.debounceMs || 150));
  };

  rebuild();

  for (const target of watchPaths) {
    const listener = watch(target, { persistent: true }, () => {
      if (!rebuilding) schedule();
    });
    listeners.push(listener);
  }

  return {
    ok: true,
    watchPaths,
    close() {
      for (const listener of listeners) {
        listener.close();
      }
      if (timer) clearTimeout(timer);
    }
  };
}

export default createPreviewWatcher;
