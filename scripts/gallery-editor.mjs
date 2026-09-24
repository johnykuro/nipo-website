import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { applyDescriptions, readLibrary, writeLibrary } from './gallery-library.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export function createGalleryEditor({ manifest = resolve(root, 'src/data/gallery.json'), assetRoot = root } = {}) {
  let writes = Promise.resolve();
  const previews = new Map();
  const server = createServer(async (request, response) => {
    const host = `127.0.0.1:${server.address().port}`;
    const send = (status, body, type = 'application/json') => {
      response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
      response.end(type === 'application/json' ? JSON.stringify(body) : body);
    };
    if (request.headers.host !== host || (request.headers.origin && request.headers.origin !== `http://${host}`)) return send(403, { error: 'Open the editor using its local address.' });
    try {
      const url = new URL(request.url, `http://${host}`);
      if (request.method === 'GET' && url.pathname === '/') {
        response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
        return send(200, await readFile(new URL('./gallery-editor/index.html', import.meta.url)), 'text/html; charset=utf-8');
      }
      if (request.method === 'GET' && ['/editor.js', '/editor.css'].includes(url.pathname)) {
        return send(200, await readFile(new URL('./gallery-editor' + url.pathname, import.meta.url)), url.pathname.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/css; charset=utf-8');
      }
      if (request.method === 'GET' && url.pathname === '/api/gallery') return send(200, await readLibrary(manifest));
      if (request.method === 'GET' && url.pathname.startsWith('/image/')) {
        const { library } = await readLibrary(manifest);
        const item = library.images.find(image => image.id === decodeURIComponent(url.pathname.slice(7)));
        if (!item) return send(404, { error: 'Photograph not found.' });
        const full = url.searchParams.get('full') === '1';
        const key = item.sha256 + (full ? '-full' : '-preview');
        if (!previews.has(key)) {
          const image = await sharp(resolve(assetRoot, item.file)).rotate().resize({ width: full ? 1800 : 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
          previews.set(key, image);
        }
        return send(200, previews.get(key), 'image/webp');
      }
      if (request.method === 'PUT' && url.pathname === '/api/gallery') {
        if (request.headers['x-gallery-editor'] !== '1' || request.headers['content-type'] !== 'application/json') return send(403, { error: 'Save from the gallery editor.' });
        let body = '';
        request.setEncoding('utf8');
        for await (const chunk of request) {
          body += chunk.toString();
          if (Buffer.byteLength(body) > 1024 * 1024) return send(413, { error: 'This update is too large.' });
        }
        let payload;
        try { payload = JSON.parse(body); } catch { return send(400, { error: 'Invalid update.' }); }
        if (!payload || typeof payload !== 'object') return send(400, { error: 'Invalid update.' });
        const save = async () => {
          const { library, revision } = await readLibrary(manifest);
          if (payload.revision !== revision) return send(409, { error: 'Descriptions changed in another window. Export your unsaved descriptions, then reload before saving.' });
          let updated;
          try { updated = applyDescriptions(library, payload.changes); }
          catch (error) { return send(400, { error: error.message }); }
          const nextRevision = await writeLibrary(manifest, updated);
          send(200, { library: updated, revision: nextRevision });
        };
        // Serialize updates so two browser tabs cannot silently overwrite each other.
        writes = writes.then(save, save);
        await writes;
        return;
      }
      send(404, { error: 'Not found.' });
    } catch (error) {
      console.error(error);
      if (!response.headersSent) send(500, { error: 'Could not read or save the gallery. Your unsaved descriptions are still in this window. Try again.' });
      else response.end();
    }
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.GALLERY_EDITOR_PORT || 4324);
  const server = createGalleryEditor();
  server.on('error', error => { console.error(`Could not start the gallery editor: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Gallery descriptions: http://127.0.0.1:${server.address().port}\nSaves update src/data/gallery.json. Rebuild and deploy the site to publish.`));
}
