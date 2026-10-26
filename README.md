# Newtabber

A Firefox new tab page: a per-tab title, DuckDuckGo search, a shared to-do list and a
bookmark grid. Static files only — no build step, no dependencies to install. Bootstrap
and Bootstrap Icons come from the CDN.

## Install (temporary, for development)

1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on…** and pick `manifest.json`.
3. Open a new tab. Firefox will ask whether to let the add-on control the new tab page.

A temporary add-on is removed when Firefox restarts. For a permanent install, use a
signed build — see below.

## Signed builds

The add-on is distributed unlisted: Mozilla signs each build, but it is not in the public
add-on directory. Install a signed `.xpi` from `about:addons` -> gear -> Install Add-on
From File.

Merging to `main` with a bumped `version` in `manifest.json` signs a new build and
attaches the `.xpi` to a GitHub release. To sign locally instead:

```
AMO_JWT_ISSUER=... AMO_JWT_SECRET=... ./dist.sh --sign
```

Credentials come from https://addons.mozilla.org/developers/addon/api/key/.

## Building a distributable zip

```
./dist.sh
```

Writes `dist/newtabber-<version>.zip`, taking the version from `manifest.json` and
including only the files the extension needs, with `manifest.json` at the archive root —
Firefox rejects an archive that nests everything under a folder. Add new source files to
the `FILES` list in `dist.sh`. Bump `version` in `manifest.json` to keep builds side by
side; otherwise a rebuild replaces the existing zip.

Load the zip the same way as the unpacked directory: **Load Temporary Add-on…** and pick
the file. `dist/` is gitignored.

## Files

| File          | What it does                                     |
| ------------- | ------------------------------------------------ |
| `manifest.json` | Overrides the new tab page, asks for `storage`. |
| `newtab.html`   | The page, plus the two edit dialogs.           |
| `newtab.js`     | All behaviour.                                 |
| `newtab.css`    | The bits Bootstrap does not cover.             |

## Categories

**+ Category** adds a full-width heading to the bookmark grid. Bookmarks that follow a
heading belong to it, so moving a bookmark between categories is just a drag. Headings
themselves do not drag — the pencil on hover renames one. Deleting a heading keeps its
bookmarks; they join the section above.

Under the hood a category is an entry in the same ordered list as the bookmarks, marked
`type: "category"`, which is what makes dragging across sections work without any nesting.

## Reordering

Drag a to do or a bookmark card onto another to move it there; a bar shows the edge it
will land against. New order is saved straight away. Archived to dos are not draggable —
they stay ordered by when they were completed.

## Icons

The picker offers every icon Bootstrap Icons ships (~2000). The list is read back out of
the icon stylesheet's `.bi-*::before` rules at runtime — which is why that `<link>` carries
`crossorigin="anonymous"` — so it never needs maintaining here. If those rules cannot be
read (a CDN without CORS, say) it falls back to the short list at the top of `newtab.js`.

Search is semantic rather than a substring match on names, because no amount of fuzzy
matching gets from "email" to `bi-envelope`. Two parts:

- `ICON_ALIASES` in `newtab.js` maps a concept to the name fragments that mean it —
  `money` to cash, currency, wallet, piggy-bank, and so on. Bootstrap Icons' own keyword
  metadata lives only in its docs site, not the npm package this page loads, so the table
  is curated. Add to it freely: a fragment matching no icon costs nothing.
- Results are ranked, not alphabetical. An exact name beats a word inside a name, which
  beats a prefix, which beats a substring; a fully typed concept ("mail") outranks a
  coincidental name match (`bi-mailbox` loses to `bi-envelope`); `-fill` variants sink
  below the plain icon; shorter names win ties, so `bi-gear` lands before
  `bi-gear-wide-connected`.

Each bookmark icon can also take one of twelve colours.

## Where things are stored

- **Page title** — `sessionStorage`, which Firefox scopes to a single tab, so every new
  tab keeps its own title. It survives a reload of that tab and disappears with it.
- **To dos and bookmarks** — `browser.storage.local`, shared by every new tab. Open tabs
  re-render when another tab edits a list.

Opening `newtab.html` outside the extension (e.g. over a local web server) also works; it
falls back to `localStorage` for the lists.

## Notes

Bootstrap's JavaScript is not used. Extension pages run under a
`script-src 'self'` CSP, which blocks remote scripts, so the dialogs are native
`<dialog>` elements instead of Bootstrap modals. Bootstrap's CSS is unaffected.
