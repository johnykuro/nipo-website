# Gallery descriptions

Run `pnpm gallery:edit` from the website folder, then open <http://127.0.0.1:4324>.

1. Find a photograph by its preview or original filename. Click the preview for a larger image.
2. Enter the correct description. The site uses these exact words as its caption and image accessibility text. The optional accessibility field can describe the scene in more detail.
3. Click **Save descriptions** (or press Ctrl+S). Use **Needs description** to work through the remaining photographs.

Saving writes to `src/data/gallery.json`. The Astro development site picks up changes; the public website needs the usual build and deployment. The editor itself is a separate local server and is never included in the public website.

Blank descriptions produce no visible caption. Until a description is provided, the image has a neutral numbered accessibility label. This is a temporary fallback, not a substitute for completing the descriptions. Previous generated captions are not treated as owner-approved wording.

**Export descriptions** downloads a JSON file, including any unsaved text, which can be passed to Codex. Alternatively, after saving, tell Codex the descriptions are ready; they are already in the project. Unsaved drafts are retained in this browser for recovery after reloading. If two windows edit the same library, stale saves are rejected instead of silently overwriting newer work. Export the unsaved window before reloading to reconcile its changes.

## Import more photographs

```powershell
pnpm gallery:import "C:\path\to\photographs"
```

The importer compares decoded pixels to detect identical photographs even when filenames or metadata differ, reuses files already in the project, and copies only missing originals. Different shots, crops, or re-edits are retained as separate photographs. Existing descriptions and order are preserved; new images are appended with empty descriptions. Import before opening the editor, or reload it after an import.

The September 2026 gallery folder supplied 67 images: 10 were already present and 57 were added. Three previous shoot photographs absent from that folder remain, for **70 unique gallery images**.
