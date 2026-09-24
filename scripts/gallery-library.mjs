import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, rename } from 'node:fs/promises';
import sharp from 'sharp';

export const digest = value => createHash('sha256').update(value).digest('hex');
export async function imageIdentity(file) {
  const bytes = await readFile(file);
  const { data, info } = await sharp(bytes).rotate().toColourspace('srgb').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { sha256: digest(bytes), pixelHash: digest(Buffer.concat([Buffer.from(`${info.width}:${info.height}:`), data])) };
}
export async function readLibrary(file) {
  const raw = await readFile(file, 'utf8');
  return { library: JSON.parse(raw), revision: digest(raw) };
}
export async function writeLibrary(file, library) {
  const raw = JSON.stringify(library, null, 2) + '\n';
  const temp = file + '.' + randomUUID() + '.tmp';
  await writeFile(temp, raw, { flag: 'wx' });
  await rename(temp, file);
  return digest(raw);
}
export function applyDescriptions(library, changes) {
  if (!Array.isArray(changes) || changes.length > library.images.length) throw new Error('Invalid description list.');
  const ids = new Set();
  const byId = new Map(library.images.map(image => [image.id, image]));
  for (const change of changes) {
    if (!change || !byId.has(change.id) || ids.has(change.id)) throw new Error('Unknown or repeated image.');
    ids.add(change.id);
    for (const key of ['description', 'alt']) {
      if (typeof change[key] !== 'string' || change[key].length > 1000) throw new Error('Descriptions must be text, up to 1,000 characters.');
    }
  }
  return { ...library, images: library.images.map(image => {
    const change = changes.find(item => item.id === image.id);
    return change ? { ...image, description: change.description.trim(), alt: change.alt.trim() } : image;
  }) };
}
