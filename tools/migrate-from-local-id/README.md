# Newtabber data rescue

A one-off add-on that recovers to dos and bookmarks saved before the extension ID
changed from `newtabber@local` to `newtabber@fowlerwill`.

Firefox keys `storage.local` by extension ID, so the signed add-on cannot see data the
old temporary add-on wrote. This helper declares the *old* ID, which is the only way to
read that data back.

## Use it

1. Open `about:debugging#/runtime/this-firefox` in the Firefox that held the data.
2. **Load Temporary Add-on…** and pick this folder's `manifest.json` (or the
   `newtabber-rescue.zip` attached to the release).
3. A "Newtabber data rescue" tab opens by itself and reports what it found. Click
   **Save backup file** to get `newtabber-backup.json`.
4. Remove the rescue add-on from `about:debugging` — it has no other purpose.
5. Open a new tab and click **Restore** at the bottom of the page, then pick that file.

If step 3 reports nothing found, the data is gone: Firefox cleared it when the temporary
add-on was removed, and there is no other copy.

## Why it is separate

It declares an ID that must never collide with the real add-on, and it is not something
to ship to users. It is kept here as a record of the migration rather than as part of
the extension.
