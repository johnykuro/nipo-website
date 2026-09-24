import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import sharp from 'sharp';
import { createGalleryEditor } from './gallery-editor.mjs';
import { imageIdentity, readLibrary } from './gallery-library.mjs';

test('description editor persists exact copy, protects newer work, and limits edits to copy', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nipo-gallery-test-'));
  const file = join(dir, 'gallery.json');
  const initial = { version: 1, images: [{ id: 'photo-1', file: 'photo.jpg', filename: 'photo.jpg', sha256: 'abc', description: '', alt: '', position: '50% 50%' }] };
  await writeFile(file, JSON.stringify(initial));
  await sharp({ create: { width: 12, height: 8, channels: 3, background: '#123456' } }).jpeg().toFile(join(dir, 'photo.jpg'));
  const server = createGalleryEditor({ manifest: file, assetRoot: dir });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const put = (body, headers = {}) => fetch(origin + '/api/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Gallery-Editor': '1', ...headers }, body: JSON.stringify(body) });
  try {
    const { revision } = await (await fetch(origin + '/api/gallery')).json();
    const update = { revision, changes: [{ id: 'photo-1', description: 'Chef’s special: pão & 日本料理 <script>alert(1)</script>', alt: 'Owner-supplied visual description', file: '../../unrelated.txt' }] };
    const saved = await put(update); assert.equal(saved.status, 200);
    const content = JSON.parse(await readFile(file, 'utf8'));
    assert.equal(content.images[0].description, update.changes[0].description);
    assert.equal(content.images[0].alt, update.changes[0].alt);
    assert.equal(content.images[0].file, 'photo.jpg');
    assert.equal((await put(update)).status, 409, 'stale update must not overwrite a newer save');
    const current = await (await fetch(origin + '/api/gallery')).json();
    assert.equal((await put({ revision: current.revision, changes: [{ id: 'unknown', description: '', alt: '' }] })).status, 400);
    assert.equal((await put({ revision: current.revision, changes: [{ id: 'photo-1', description: 'x'.repeat(1001), alt: '' }] })).status, 400);
    assert.equal((await put({ revision: current.revision, changes: [{ id: 'photo-1', description: '', alt: null }] })).status, 400);
    assert.equal((await put(update, { Origin: 'https://untrusted.example' })).status, 403);
    assert.equal((await put(update, { 'X-Gallery-Editor': '' })).status, 403);
    assert.equal((await put(null)).status, 400);
    const preview = await fetch(origin + '/image/photo-1'); assert.equal(preview.status, 200); assert.equal(preview.headers.get('content-type'), 'image/webp');
    assert.equal((await fetch(origin + '/image/missing')).status, 404);
    assert.equal((await fetch(origin + '/package.json')).status, 404);
    const simultaneous = await Promise.all(['First description', 'Second description'].map(description => put({ revision: current.revision, changes: [{ id: 'photo-1', description, alt: '' }] })));
    assert.deepEqual(simultaneous.map(response => response.status).sort(), [200, 409]);
    const latest = await readLibrary(file);
    assert.equal((await put({ revision: latest.revision, changes: [{ id: 'photo-1', description: '', alt: '' }] })).status, 200);
    assert.equal((await readLibrary(file)).library.images[0].description, '', 'clearing a caption is supported');
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('duplicate detection ignores filenames and metadata but preserves different photographs', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nipo-gallery-hash-'));
  const original = join(dir, 'original.png'), renamed = join(dir, 'renamed.png'), other = join(dir, 'other.png');
  const pixels = { create: { width: 10, height: 10, channels: 3, background: '#123456' } };
  await sharp(pixels).png().toFile(original);
  await sharp(pixels).withMetadata({ density: 300 }).png().toFile(renamed);
  await sharp({ create: { ...pixels.create, background: '#abcdef' } }).png().toFile(other);
  const a = await imageIdentity(original), b = await imageIdentity(renamed), c = await imageIdentity(other);
  assert.notEqual(a.sha256, b.sha256);
  assert.equal(a.pixelHash, b.pixelHash);
  assert.notEqual(a.pixelHash, c.pixelHash);
});

test('gallery manifest has unique identities and every original still matches its hash', async () => {
  const { library } = await readLibrary(new URL('../src/data/gallery.json', import.meta.url));
  assert.equal(new Set(library.images.map(image => image.id)).size, library.images.length);
  assert.equal(new Set(library.images.map(image => image.pixelHash)).size, library.images.length);
  for (const image of library.images) {
    const actual = await imageIdentity(new URL('../' + image.file, import.meta.url));
    assert.equal(actual.sha256, image.sha256, image.filename);
    assert.equal(actual.pixelHash, image.pixelHash, image.filename);
  }
});
