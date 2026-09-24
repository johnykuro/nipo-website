// Run against a disposable copy so verification never edits owner descriptions.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { once } from 'node:events';
import assert from 'node:assert/strict';
import { createGalleryEditor } from './gallery-editor.mjs';
import { readLibrary } from './gallery-library.mjs';

const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error('Set AGENT_BROWSER_BIN to the agent-browser executable.');
const run = promisify(execFile);
async function command(...args) {
  let output;
  try { output = (await run(binary, ['--session', 'nipo-description-qa', '--json', ...args], { timeout: 30000 })).stdout; }
  catch (error) { if (!error.stdout || !JSON.parse(error.stdout).success) throw error; output = error.stdout; }
  const result = JSON.parse(output);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
const evaluate = async code => (await command('eval', code)).result;
await mkdir('tmp/qa', { recursive: true });
const dir = await mkdtemp(resolve('tmp/qa/editor-'));
const manifest = join(dir, 'gallery.json');
const { library } = await readLibrary('src/data/gallery.json');
const fixture = { ...library, images: library.images.map(image => ({ ...image, description: '', alt: '' })) };
await writeFile(manifest, JSON.stringify(fixture));
const server = createGalleryEditor({ manifest });
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  await command('set', 'viewport', '1440', '1000');
  await command('open', origin);
  await command('wait', '.photo-row');
  assert.equal(await evaluate('document.querySelectorAll(".photo-row").length'), library.images.length);
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false);
  await command('screenshot', 'tmp/qa/gallery-editor-desktop.png');
  const field = '.photo-row:first-child .description';
  const copy = 'Owner’s description: sushi & pão, exactly as supplied.';
  await command('fill', field, copy);
  assert.equal(await evaluate('document.querySelector("#save").disabled'), false);
  await command('click', '#save');
  await command('wait', '--text', 'Saved 1 photograph');
  assert.equal((await readLibrary(manifest)).library.images[0].description, copy);
  await command('open', origin);
  await command('wait', '.photo-row');
  assert.equal(await evaluate('document.querySelector(".description").value'), copy);
  await command('select', '#filter', 'complete');
  assert.equal(await evaluate('document.querySelectorAll(".photo-row:not([hidden])").length'), 1);
  await command('select', '#filter', 'pending');
  assert.equal(await evaluate('document.querySelectorAll(".photo-row:not([hidden])").length'), library.images.length - 1);
  await command('select', '#filter', 'all');
  await command('fill', '#search', 'not-a-real-filename');
  assert.equal(await evaluate('document.querySelector("#empty").hidden'), false);
  await command('fill', '#search', '');
  await command('set', 'viewport', '390', '844');
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false);
  assert.equal(await evaluate('document.querySelector(".photo-row img").naturalWidth > 0'), true);
  await command('screenshot', 'tmp/qa/gallery-editor-mobile.png');
  // A stale save leaves the text in place and offers an export/reload path.
  await command('fill', field, 'Unsaved work remains available');
  const updated = await readLibrary(manifest);
  updated.library.images[1].description = 'Saved in another window';
  await writeFile(manifest, JSON.stringify(updated.library));
  await command('scrollintoview', '#save');
  await command('click', '#save');
  await command('wait', '--text', 'Descriptions changed in another window');
  assert.equal(await evaluate('document.querySelector(".description").value'), 'Unsaved work remains available');
  assert.equal(await evaluate('document.querySelector("#save").disabled'), false);
  await evaluate('localStorage.clear(); true');
  console.log('PASS editor: photo previews, exact-copy save/reload, completion filters, search, stale-save recovery, desktop and mobile layout.');
} finally {
  await command('close');
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
}
