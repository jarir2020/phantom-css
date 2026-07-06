import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { writePreviewSite } from './static.js';

function sendResponse(res, statusCode, contentType, body) {
  res.writeHead(statusCode, {
    'content-type': contentType,
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

export function openBrowser(url, options = {}) {
  const command = options.command || (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
  const args = options.args || (process.platform === 'win32' ? [url] : [url]);
  return spawn(command, args, {
    detached: true,
    stdio: 'ignore',
    shell: process.platform === 'win32'
  });
}

export async function startPreviewServer(outputDir, options = {}) {
  const site = writePreviewSite(outputDir, options);
  const host = options.host || '127.0.0.1';
  const port = options.port === undefined ? 4173 : Number(options.port);

  const server = createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];

    if (urlPath === '/' || urlPath === '/index.html') {
      sendResponse(res, 200, 'text/html; charset=utf-8', readFileSync(site.htmlPath, 'utf8'));
      return;
    }

    if (urlPath === '/preview.json') {
      sendResponse(res, 200, 'application/json; charset=utf-8', readFileSync(site.manifestPath, 'utf8'));
      return;
    }

    sendResponse(res, 404, 'text/plain; charset=utf-8', 'Not Found');
  });

  await new Promise((resolve) => server.listen(port, host, resolve));

  if (options.open) {
    openBrowser(`http://${host}:${server.address().port}/`, options.open === true ? {} : options.open);
  }

  return {
    ok: true,
    server,
    host,
    port: server.address().port,
    url: `http://${host}:${server.address().port}/`,
    outputDir: site.outputDir,
    htmlPath: site.htmlPath,
    manifestPath: site.manifestPath,
    opened: Boolean(options.open)
  };
}

export default startPreviewServer;
