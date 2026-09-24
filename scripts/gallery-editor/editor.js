export {};
const $ = selector => document.querySelector(selector);
const save = $('#save'), exportButton = $('#export'), error = $('#error');
const rows = new Map(), drafts = new Map();
let library, revision, saving = false;
const pendingKey = 'nipo-gallery-description-drafts-v1';
const changed = image => {
  image = library.images.find(item => item.id === image.id);
  const draft = drafts.get(image.id);
  return draft.description !== image.description || draft.alt !== image.alt;
};
const updates = () => library.images.filter(changed).map(image => ({ id: image.id, ...drafts.get(image.id) }));
function remember() {
  try { localStorage.setItem(pendingKey, JSON.stringify(updates())); }
  catch { $('#status').textContent = 'Browser recovery unavailable. Save or export before closing.'; }
}
function refresh() {
  const query = $('#search').value.trim().toLowerCase(), filter = $('#filter').value;
  let visible = 0;
  for (const image of library.images) {
    const draft = drafts.get(image.id), edited = changed(image), row = rows.get(image.id);
    const complete = Boolean(draft.description.trim());
    const state = row.querySelector('.state');
    state.textContent = edited ? 'Unsaved' : complete ? 'Description saved' : 'Needs description';
    state.classList.toggle('edited', edited);
    row.hidden = !(`${image.filename} ${draft.description} ${draft.alt}`.toLowerCase().includes(query) && (filter === 'all' || (filter === 'pending' && !complete) || (filter === 'complete' && complete) || (filter === 'edited' && edited)));
    if (!row.hidden) visible++;
  }
  const count = library.images.filter(image => image.description.trim()).length;
  const unsaved = updates().length;
  $('#progress').textContent = `${count} of ${library.images.length} descriptions saved · ${visible} shown${unsaved ? ` · ${unsaved} unsaved` : ''}`;
  save.disabled = saving || !unsaved;
  save.textContent = saving ? 'Saving…' : 'Save descriptions';
  $('#empty').hidden = visible > 0;
}
async function load() {
  try {
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Could not load photographs. Check the editor is running, then reload.');
    ({ library, revision } = await response.json());
    let recovered = [];
    try { const stored = JSON.parse(localStorage.getItem(pendingKey) || '[]'); if (Array.isArray(stored)) recovered = stored; } catch {}
    for (const [index, image] of library.images.entries()) {
      const recovery = recovered.find(item => item.id === image.id && typeof item.description === 'string' && typeof item.alt === 'string');
      drafts.set(image.id, recovery ? { description: recovery.description, alt: recovery.alt } : { description: image.description, alt: image.alt });
      const row = $('#photo-template').content.firstElementChild.cloneNode(true);
      row.dataset.id = image.id;
      row.querySelector('h2').textContent = `Photograph ${String(index + 1).padStart(2, '0')}`;
      row.querySelector('.filename').textContent = image.filename;
      const link = row.querySelector('.preview'), img = row.querySelector('img');
      link.href = `/image/${encodeURIComponent(image.id)}?full=1`;
      link.setAttribute('aria-label', `View full photograph ${index + 1}, ${image.filename}`);
      img.src = `/image/${encodeURIComponent(image.id)}`;
      img.alt = image.alt || image.description || `NIPO photograph ${index + 1}`;
      if (index < 2) img.loading = 'eager';
      for (const key of ['description', 'alt']) {
        const field = row.querySelector('.' + key);
        field.id = key + '-' + image.id;
        row.querySelector('.' + key + '-label').htmlFor = field.id;
        field.value = drafts.get(image.id)[key];
        field.addEventListener('input', () => {
          drafts.get(image.id)[key] = field.value;
          $('#status').textContent = 'Changes waiting to be saved.';
          remember();
          // Do not hide the field mid-sentence when a filter is active.
          save.disabled = saving || !updates().length;
          row.querySelector('.state').textContent = changed(image) ? 'Unsaved' : library.images.find(item => item.id === image.id).description ? 'Description saved' : 'Needs description';
          row.querySelector('.state').classList.toggle('edited', changed(image));
          $('#progress').textContent = `${library.images.filter(item => item.description.trim()).length} of ${library.images.length} descriptions saved · ${updates().length} unsaved`;
        });
      }
      rows.set(image.id, row); $('#photographs').append(row);
    }
    exportButton.disabled = false;
    refresh();
    if (updates().length) $('#status').textContent = 'Recovered unsaved descriptions. Review and save when ready.';
  } catch (cause) { error.textContent = cause.message; error.hidden = false; $('#progress').textContent = 'Photographs could not load.'; }
}
save.addEventListener('click', async () => {
  saving = true; error.hidden = true;
  const changes = updates(); refresh();
  try {
    const response = await fetch('/api/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Gallery-Editor': '1' }, body: JSON.stringify({ revision, changes }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not save. Please try again.');
    library = data.library; revision = data.revision;
    for (const change of changes) {
      const draft = drafts.get(change.id), saved = library.images.find(image => image.id === change.id);
      // Preserve anything typed while the request was in flight.
      for (const key of ['description', 'alt']) if (draft[key] === change[key]) {
        draft[key] = saved[key]; rows.get(change.id).querySelector('.' + key).value = saved[key];
      }
    }
    remember();
    $('#status').textContent = `Saved ${changes.length} ${changes.length === 1 ? 'photograph' : 'photographs'} to the website project.`;
  } catch (cause) { error.textContent = cause.message; error.hidden = false; $('#status').textContent = 'Not saved. Your changes are still here.'; }
  finally { saving = false; refresh(); }
});
exportButton.addEventListener('click', () => {
  const descriptions = library.images.map(image => ({ id: image.id, filename: image.filename, ...drafts.get(image.id) }));
  const url = URL.createObjectURL(new Blob([JSON.stringify({ descriptions }, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'nipo-gallery-descriptions.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#status').textContent = 'Exported descriptions, including unsaved changes.';
});
$('#search').addEventListener('input', refresh);
$('#filter').addEventListener('change', refresh);
window.addEventListener('beforeunload', event => { if (library && updates().length) event.preventDefault(); });
document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 's') { event.preventDefault(); if (!save.disabled) save.click(); } });
await load();
