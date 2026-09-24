import { readdir, mkdir, copyFile } from 'node:fs/promises';
import { basename, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageIdentity, readLibrary, writeLibrary } from './gallery-library.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const folder = process.argv[2];
if (!folder) throw new Error('Usage: pnpm gallery:import "path/to/photos"');
const manifest = resolve(root, 'src/data/gallery.json');
const { library } = await readLibrary(manifest);
const destination = resolve(root, 'src/assets/photos/gallery');
await mkdir(destination, { recursive: true });
const known = new Map(library.images.map(image => [image.pixelHash, image]));
// Reuse originals already in the project, including photographs used by the hero.
const assets = new Map();
for (const directory of ['shoot-2026-09', 'hero-2026-09', 'gallery']) {
  const dir = resolve(root, 'src/assets/photos', directory);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) continue;
    const path = resolve(dir, entry.name);
    const identity = await imageIdentity(path);
    if (!assets.has(identity.pixelHash)) assets.set(identity.pixelHash, { path, ...identity });
  }
}
let added = 0, skipped = 0;
for (const entry of (await readdir(resolve(folder), { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
  if (!entry.isFile() || !/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) continue;
  const source = resolve(folder, entry.name);
  const identity = await imageIdentity(source);
  if (known.has(identity.pixelHash)) { skipped++; continue; }
  const existing = assets.get(identity.pixelHash);
  const target = existing?.path || resolve(destination, identity.sha256.slice(0,12) + '-' + basename(source));
  if (!existing) await copyFile(source, target, 1);
  const image = {
    id: 'gallery-' + identity.sha256.slice(0,16),
    file: relative(root, target).replaceAll('\\', '/'),
    filename: entry.name,
    sha256: existing?.sha256 || identity.sha256,
    pixelHash: identity.pixelHash,
    description: '', alt: '', position: '50% 50%', mobilePosition: '50% 50%',
  };
  library.images.push(image); known.set(identity.pixelHash, image); added++;
}
if (added) await writeLibrary(manifest, library);
console.log(`${added} added; ${skipped} duplicates skipped; ${library.images.length} unique gallery images.`);
