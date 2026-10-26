"use strict";

/** Fallback list, used only if the icon stylesheet cannot be read. */
const FALLBACK_ICONS = [
  "bi-star",
  "bi-house",
  "bi-globe",
  "bi-bookmark",
  "bi-briefcase",
  "bi-calendar",
  "bi-envelope",
  "bi-chat",
  "bi-people",
  "bi-code-slash",
  "bi-terminal",
  "bi-git",
  "bi-github",
  "bi-kanban",
  "bi-clipboard-check",
  "bi-journal-text",
  "bi-book",
  "bi-newspaper",
  "bi-graph-up",
  "bi-bar-chart",
  "bi-database",
  "bi-cloud",
  "bi-server",
  "bi-shield-lock",
  "bi-gear",
  "bi-tools",
  "bi-bug",
  "bi-search",
  "bi-play-btn",
  "bi-music-note-beamed",
  "bi-camera",
  "bi-image",
  "bi-cart",
  "bi-credit-card",
  "bi-cash-coin",
  "bi-heart-pulse",
  "bi-cup-hot",
  "bi-map",
  "bi-airplane",
  "bi-controller",
];
const DEFAULT_ICON = "bi-star";
const ICON_RESULT_LIMIT = 300;

/** Icon colours. "" means inherit the card's text colour. */
const ICON_COLOURS = [
  ["Default", ""],
  ["Red", "#dc3545"],
  ["Orange", "#fd7e14"],
  ["Yellow", "#ffc107"],
  ["Green", "#198754"],
  ["Teal", "#20c997"],
  ["Cyan", "#0dcaf0"],
  ["Blue", "#0d6efd"],
  ["Indigo", "#6610f2"],
  ["Purple", "#6f42c1"],
  ["Pink", "#d63384"],
  ["Grey", "#adb5bd"],
];

/**
 * Search vocabulary: what someone types -> fragments of the icon names that
 * mean it. Bootstrap Icons' own keyword metadata only lives in its docs site,
 * not the npm package this page loads, so the mapping is curated here. A
 * fragment that matches no icon simply yields nothing, so being generous with
 * these costs nothing.
 */
const ICON_ALIASES = {
  account: ["person-circle", "person-badge", "person"],
  add: ["plus", "plus-circle", "plus-square", "node-plus"],
  ai: ["robot", "cpu", "stars", "magic"],
  alert: ["exclamation-triangle", "exclamation-circle", "bell"],
  animal: ["bug", "egg", "twitter"],
  art: ["palette", "brush", "paint-bucket", "easel"],
  audio: ["music-note", "headphones", "speaker", "volume-up", "mic"],
  backup: ["cloud-arrow-up", "hdd", "archive", "save"],
  bug: ["bug", "exclamation-diamond"],
  build: ["tools", "wrench", "hammer", "gear-wide"],
  buy: ["cart", "bag", "credit-card", "shop"],
  calendar: ["calendar-event", "calendar3", "calendar-check", "calendar"],
  call: ["telephone", "phone", "headset", "camera-video"],
  car: ["car-front", "taxi-front", "fuel-pump", "ev-station"],
  chart: ["bar-chart", "pie-chart", "graph-up", "activity"],
  chat: ["chat-dots", "chat-left-text", "chat", "wechat"],
  close: ["x-lg", "x-circle", "x-square"],
  cloud: ["cloud", "cloud-arrow-up", "cloud-check"],
  code: ["code-slash", "code", "braces", "terminal", "filetype-js"],
  computer: ["pc-display", "laptop", "display", "cpu"],
  copy: ["copy", "clipboard", "files"],
  data: ["database", "table", "bar-chart", "hdd-stack"],
  date: ["calendar-event", "calendar3", "clock"],
  delete: ["trash", "x-circle", "eraser", "backspace"],
  delivery: ["truck", "box-seam", "geo-alt"],
  design: ["palette", "vector-pen", "rulers", "bounding-box"],
  dev: ["code-slash", "terminal", "git", "github", "bug", "braces"],
  document: ["file-earmark-text", "file-text", "journal-text", "card-text"],
  docs: ["journal-text", "file-earmark-text", "book", "clipboard"],
  download: ["download", "cloud-arrow-down", "box-arrow-down"],
  drink: ["cup-hot", "cup-straw", "cup"],
  edit: ["pencil", "pencil-square", "pen"],
  education: ["mortarboard", "book", "backpack", "journal"],
  email: ["envelope", "envelope-open", "mailbox", "inbox", "send"],
  energy: ["lightning-charge", "lightning", "battery-full", "plug"],
  error: ["exclamation-octagon", "x-octagon", "exclamation-triangle", "bug"],
  favourite: ["star", "heart", "bookmark", "hand-thumbs-up"],
  favorite: ["star", "heart", "bookmark", "hand-thumbs-up"],
  file: ["file-earmark", "files", "folder", "file-earmark-text"],
  filter: ["funnel", "sliders", "sort-down"],
  finance: ["cash-coin", "currency-dollar", "graph-up-arrow", "bank", "wallet2"],
  fitness: ["heart-pulse", "activity", "bicycle", "stopwatch"],
  food: ["egg-fried", "cup-hot", "basket", "shop"],
  game: ["controller", "dice-5", "puzzle", "trophy"],
  help: ["question-circle", "life-preserver", "info-circle"],
  health: ["heart-pulse", "bandaid", "capsule", "hospital", "thermometer-half"],
  home: ["house-door", "house"],
  idea: ["lightbulb", "stars", "magic"],
  id: ["person-vcard", "person-badge", "credit-card-2-front"],
  info: ["info-circle", "info-square"],
  job: ["briefcase", "person-workspace", "building"],
  language: ["translate", "globe", "chat-quote"],
  launch: ["rocket-takeoff", "rocket", "send"],
  link: ["link-45deg", "link", "box-arrow-up-right", "share"],
  list: ["list-task", "list-check", "list-ul", "card-checklist"],
  location: ["geo-alt", "pin-map", "map", "compass"],
  mail: ["envelope", "mailbox", "inbox", "send"],
  map: ["map", "geo-alt", "pin-map", "compass", "signpost"],
  medical: ["heart-pulse", "capsule", "hospital", "bandaid", "prescription2"],
  menu: ["list", "grid-3x3-gap", "three-dots"],
  message: ["chat-dots", "envelope", "chat-left-text", "send"],
  mobile: ["phone", "phone-vibrate", "tablet"],
  money: ["cash-coin", "cash", "currency-dollar", "wallet2", "piggy-bank"],
  more: ["three-dots", "three-dots-vertical", "plus-circle"],
  music: ["music-note-beamed", "music-note", "vinyl", "spotify"],
  nature: ["tree", "flower1", "sun", "droplet"],
  network: ["diagram-3", "router", "wifi", "ethernet", "hdd-network"],
  news: ["newspaper", "rss", "megaphone"],
  night: ["moon-stars", "moon", "cloud-moon"],
  note: ["sticky", "journal-text", "card-text", "pencil-square"],
  notification: ["bell", "bell-fill", "megaphone"],
  office: ["building", "briefcase", "printer", "person-workspace"],
  password: ["key", "lock", "shield-lock", "asterisk"],
  payment: ["credit-card", "cash-coin", "receipt", "wallet2"],
  pet: ["bug", "egg"],
  phone: ["telephone", "phone", "phone-vibrate"],
  photo: ["image", "images", "camera", "file-earmark-image"],
  picture: ["image", "images", "easel"],
  plant: ["tree", "flower1", "droplet"],
  power: ["power", "plug", "battery-full", "lightning-charge"],
  print: ["printer", "file-earmark-pdf"],
  privacy: ["incognito", "eye-slash", "shield-lock", "lock"],
  profile: ["person-circle", "person", "person-vcard"],
  project: ["kanban", "diagram-3", "clipboard-data", "briefcase"],
  refresh: ["arrow-clockwise", "arrow-repeat", "recycle"],
  remove: ["trash", "dash-circle", "x-circle", "node-minus"],
  schedule: ["calendar-week", "calendar-event", "clock", "alarm"],
  school: ["mortarboard", "book", "backpack"],
  search: ["search", "binoculars", "zoom-in"],
  security: ["shield-lock", "shield-check", "lock", "key", "fingerprint"],
  settings: ["gear", "gear-wide-connected", "sliders", "toggles", "wrench"],
  share: ["share", "box-arrow-up-right", "link-45deg", "send"],
  shop: ["shop", "cart", "bag", "basket"],
  shopping: ["cart", "bag", "basket", "shop"],
  social: ["people", "chat-dots", "twitter-x", "mastodon", "reddit"],
  sort: ["sort-down", "arrow-down-up", "filter"],
  sound: ["volume-up", "speaker", "music-note", "mic"],
  sport: ["trophy", "bicycle", "stopwatch", "dribbble"],
  stats: ["graph-up", "bar-chart", "pie-chart", "speedometer2", "activity"],
  storage: ["hdd", "database", "archive", "box-seam", "cloud"],
  sync: ["arrow-repeat", "cloud-arrow-up", "arrow-left-right"],
  target: ["bullseye", "crosshair", "flag"],
  task: ["check2-square", "list-task", "clipboard-check", "kanban"],
  team: ["people", "person-lines-fill", "diagram-3"],
  temperature: ["thermometer-half", "thermometer", "sun"],
  text: ["fonts", "type-bold", "card-text", "file-text"],
  time: ["clock", "stopwatch", "hourglass-split", "alarm", "clock-history"],
  todo: ["check2-square", "list-task", "clipboard-check"],
  tools: ["tools", "wrench", "hammer", "screwdriver"],
  transport: ["train-front", "bus-front", "car-front", "airplane", "bicycle"],
  travel: ["airplane", "geo-alt", "map", "suitcase-lg", "compass"],
  upload: ["upload", "cloud-arrow-up", "box-arrow-up"],
  url: ["link-45deg", "globe", "box-arrow-up-right"],
  user: ["person", "person-circle", "people", "person-badge"],
  video: ["camera-video", "camera-reels", "film", "play-btn", "youtube"],
  warning: ["exclamation-triangle", "exclamation-circle", "shield-exclamation"],
  weather: ["cloud-sun", "sun", "cloud-rain", "snow", "umbrella", "wind"],
  wifi: ["wifi", "router", "broadcast"],
  work: ["briefcase", "person-workspace", "building", "kanban"],
};

/**
 * How far an alias hit sits behind a plain name match. Typing a concept in
 * full is a strong signal — "mail" should reach bi-envelope before
 * bi-mailbox — but a half-typed one only ranks behind real name matches.
 */
const ALIAS_EXACT = 1;
const ALIAS_PARTIAL = 4;

const extensionStorage = (globalThis.browser ?? globalThis.chrome)?.storage;

/**
 * Global lists live in extension storage so every new tab shares them; the
 * localStorage branch only exists so the page also works opened directly.
 */
const store = {
  async get(key, fallback) {
    if (extensionStorage) {
      const result = await extensionStorage.local.get(key);
      return result[key] ?? fallback;
    }
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  },
  async set(key, value) {
    if (extensionStorage) {
      await extensionStorage.local.set({ [key]: value });
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const $ = (id) => document.getElementById(id);
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

let todos = [];
/** Bookmarks and category headings together, in display order. */
let bookmarkItems = [];

const isCategory = (item) => item.type === "category";

// --- Page title (per tab: sessionStorage is scoped to this tab) --------------

const titleInput = $("page-title");

function applyTitle() {
  document.title = titleInput.value.trim() || "New Tab";
}

titleInput.value = sessionStorage.getItem("pageTitle") ?? "";
applyTitle();
titleInput.addEventListener("input", () => {
  sessionStorage.setItem("pageTitle", titleInput.value);
  applyTitle();
});

// --- DuckDuckGo search ------------------------------------------------------

$("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("search-input").value.trim();
  if (!query) return;
  location.href = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
});

// --- To do ------------------------------------------------------------------

function todoCard(todo) {
  const description = todo.description
    ? `<p class="todo-description small text-secondary mb-0 mt-1">${esc(todo.description)}</p>`
    : "";
  return `
    <div class="card todo-card position-relative${todo.done ? " done" : ""}"
         data-id="${todo.id}" data-axis="y" draggable="${!todo.done}">
      <div class="card-body py-2 d-flex gap-2">
        <input class="form-check-input mt-1 flex-shrink-0" type="checkbox"
               data-action="toggle-todo" ${todo.done ? "checked" : ""}
               aria-label="Mark &quot;${esc(todo.title)}&quot; as done" />
        <div class="flex-grow-1 pe-4">
          <div class="todo-title">${esc(todo.title)}</div>
          ${description}
        </div>
        <button type="button" class="btn btn-sm btn-link card-edit p-1"
                data-action="edit-todo" aria-label="Edit &quot;${esc(todo.title)}&quot;">
          <i class="bi bi-pencil"></i>
        </button>
      </div>
    </div>`;
}

function renderTodos() {
  const active = todos.filter((todo) => !todo.done);
  const archived = todos
    .filter((todo) => todo.done)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  $("todo-list").innerHTML = active.map(todoCard).join("");
  $("todo-empty").hidden = active.length > 0;
  $("archive-list").innerHTML = archived.map(todoCard).join("");
  $("archive-count").textContent = String(archived.length);
  $("archive").hidden = archived.length === 0;
}

async function saveTodos() {
  await store.set("todos", todos);
  renderTodos();
}

const todoDialog = $("todo-dialog");
let editingTodoId = null;

function openTodoDialog(todo) {
  editingTodoId = todo?.id ?? null;
  $("todo-dialog-heading").textContent = todo ? "Edit to do" : "Add to do";
  $("todo-title").value = todo?.title ?? "";
  $("todo-description").value = todo?.description ?? "";
  $("todo-delete").hidden = !todo;
  todoDialog.showModal();
}

$("add-todo").addEventListener("click", () => openTodoDialog(null));

$("todo-form").addEventListener("submit", () => {
  const title = $("todo-title").value.trim();
  const description = $("todo-description").value.trim();
  const existing = todos.find((todo) => todo.id === editingTodoId);
  if (existing) {
    existing.title = title;
    existing.description = description;
  } else {
    todos.push({
      id: uid(),
      title,
      description,
      done: false,
      createdAt: Date.now(),
    });
  }
  saveTodos();
});

$("todo-delete").addEventListener("click", () => {
  todos = todos.filter((todo) => todo.id !== editingTodoId);
  todoDialog.close();
  saveTodos();
});

// --- Bookmarks and categories -----------------------------------------------

/** Only palette values reach the style attribute; anything else is dropped. */
function iconColourStyle(colour) {
  const known = ICON_COLOURS.some(([, value]) => value && value === colour);
  return known ? ` style="color: ${colour}"` : "";
}

function bookmarkCard(bookmark) {
  const description = bookmark.description
    ? `<span class="bookmark-description small text-secondary mt-1">${esc(bookmark.description)}</span>`
    : "";
  return `
    <div class="col-12 col-md-6 col-xl-4 bookmark-cell position-relative"
         data-id="${bookmark.id}" data-axis="x" draggable="true">
      <a class="card bookmark-card text-center p-3" href="${esc(bookmark.url)}" draggable="false">
        <i class="bi ${esc(bookmark.icon || DEFAULT_ICON)} d-block mb-2"${iconColourStyle(bookmark.iconColour)}></i>
        <span class="bookmark-title fw-semibold">${esc(bookmark.title)}</span>
        ${description}
      </a>
      <button type="button" class="btn btn-sm btn-link card-edit p-1"
              data-action="edit-bookmark" aria-label="Edit &quot;${esc(bookmark.title)}&quot;">
        <i class="bi bi-pencil"></i>
      </button>
    </div>`;
}

function categoryRow(category) {
  return `
    <div class="col-12 bookmark-cell category-row position-relative"
         data-id="${category.id}" data-axis="y" draggable="false">
      <div class="d-flex align-items-center gap-2 border-bottom pb-1">
        <span class="drag-handle" data-drag-handle draggable="true"
              title="Drag to move" aria-hidden="true">
          <i class="bi bi-grip-vertical"></i>
        </span>
        <h3 class="h6 text-uppercase text-secondary mb-0 flex-grow-1">${esc(category.name)}</h3>
        <button type="button" class="btn btn-sm btn-link row-edit p-0"
                data-action="edit-category"
                aria-label="Rename &quot;${esc(category.name)}&quot;">
          <i class="bi bi-pencil"></i>
        </button>
      </div>
    </div>`;
}

function renderBookmarks() {
  $("bookmark-grid").innerHTML = bookmarkItems
    .map((item) => (isCategory(item) ? categoryRow(item) : bookmarkCard(item)))
    .join("");
  $("bookmark-empty").hidden = bookmarkItems.length > 0;
}

async function saveBookmarks() {
  await store.set("bookmarks", bookmarkItems);
  renderBookmarks();
}

// --- Icon and colour pickers ------------------------------------------------

let selectedIcon = DEFAULT_ICON;
let selectedColour = "";
let iconNames = null;

/**
 * Every icon name Bootstrap Icons ships, read back out of its stylesheet, so
 * the list never has to be maintained here.
 */
function allIconNames() {
  if (iconNames) return iconNames;
  const found = new Set();
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // A cross-origin sheet fetched without CORS.
    }
    for (const rule of rules) {
      const match = rule.selectorText?.match(/^\.(bi-[a-z0-9-]+)::before$/);
      if (match) found.add(match[1]);
    }
  }
  iconNames =
    found.size > FALLBACK_ICONS.length ? [...found].sort() : [...FALLBACK_ICONS];
  return iconNames;
}

/**
 * Expands what was typed into weighted search terms: the words themselves,
 * plus whatever the alias table says they mean.
 */
function searchTerms(query) {
  const typed = query.split(/[\s-]+/).filter(Boolean);
  const terms = typed.map((term) => ({ term, weight: 0 }));

  for (const word of typed) {
    for (const [concept, fragments] of Object.entries(ICON_ALIASES)) {
      const exact = concept === word;
      if (!exact && !(word.length >= 3 && concept.startsWith(word))) continue;
      const base = exact ? ALIAS_EXACT : ALIAS_PARTIAL;
      // The table's own order is the author's preference order, so keep it.
      fragments.forEach((fragment, index) =>
        terms.push({ term: fragment, weight: base + index / 10 }),
      );
    }
  }
  return terms;
}

/** Lower is a better match; Infinity means no match at all. */
function iconScore(name, terms) {
  const bare = name.slice(3);
  const words = bare.split("-");
  let best = Infinity;

  for (const { term, weight } of terms) {
    let score;
    if (bare === term) score = 0;
    else if (words.includes(term)) score = 1;
    else if (bare.startsWith(term)) score = 2;
    else if (bare.includes(term)) score = 3;
    else continue;
    best = Math.min(best, score + weight);
  }
  // Variants are rarely what someone means when they searched the base word.
  return best === Infinity || !/-(fill|fill-.+)$/.test(bare) ? best : best + 0.5;
}

function matchingIcons(query) {
  if (!query) return allIconNames();
  const terms = searchTerms(query);
  return allIconNames()
    .map((name) => ({ name, score: iconScore(name, terms) }))
    .filter(({ score }) => score < Infinity)
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.name.length - b.name.length ||
        a.name.localeCompare(b.name),
    )
    .map(({ name }) => name);
}

function renderIconPicker() {
  const query = $("icon-search").value.trim().toLowerCase();
  const matches = matchingIcons(query);
  const shown = matches.slice(0, ICON_RESULT_LIMIT);
  if (!shown.includes(selectedIcon)) shown.unshift(selectedIcon);

  $("icon-picker").innerHTML = shown
    .map(
      (icon) => `<button type="button" data-icon="${icon}"
        aria-pressed="${icon === selectedIcon}" title="${icon.replace("bi-", "")}"
        aria-label="${icon.replace("bi-", "")}"><i class="bi ${icon}"></i></button>`,
    )
    .join("");

  const total = matches.length;
  $("icon-count").textContent =
    total > ICON_RESULT_LIMIT
      ? `Best ${ICON_RESULT_LIMIT} of ${total} matches`
      : `${total} icon${total === 1 ? "" : "s"}${query ? ", best first" : ""}`;
}

$("color-picker").innerHTML = ICON_COLOURS.map(
  ([name, value]) =>
    `<button type="button" data-colour="${value}" aria-pressed="false"
      title="${name}" aria-label="${name}"><i class="bi ${
        value ? "bi-square-fill" : "bi-square"
      }"${value ? ` style="color: ${value}"` : ""}></i></button>`,
).join("");

function highlightIcon() {
  for (const button of $("icon-picker").children) {
    button.setAttribute("aria-pressed", String(button.dataset.icon === selectedIcon));
  }
}

function highlightColour() {
  for (const button of $("color-picker").children) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.colour === selectedColour),
    );
  }
}

$("icon-search").addEventListener("input", renderIconPicker);
$("icon-search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault(); // Searching is not saving.
});

$("icon-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-icon]");
  if (!button) return;
  selectedIcon = button.dataset.icon;
  highlightIcon();
});

$("color-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-colour]");
  if (!button) return;
  selectedColour = button.dataset.colour;
  highlightColour();
});

// --- Bookmark dialog --------------------------------------------------------

const bookmarkDialog = $("bookmark-dialog");
let editingBookmarkId = null;

function openBookmarkDialog(bookmark) {
  editingBookmarkId = bookmark?.id ?? null;
  $("bookmark-dialog-heading").textContent = bookmark
    ? "Edit bookmark"
    : "Add bookmark";
  $("bookmark-title").value = bookmark?.title ?? "";
  $("bookmark-url").value = bookmark?.url ?? "";
  $("bookmark-description").value = bookmark?.description ?? "";
  selectedIcon = bookmark?.icon || DEFAULT_ICON;
  selectedColour = bookmark?.iconColour ?? "";
  $("icon-search").value = "";
  renderIconPicker();
  highlightColour();
  $("bookmark-delete").hidden = !bookmark;
  bookmarkDialog.showModal();
}

$("add-bookmark").addEventListener("click", () => openBookmarkDialog(null));

$("bookmark-form").addEventListener("submit", () => {
  const raw = $("bookmark-url").value.trim();
  const fields = {
    title: $("bookmark-title").value.trim(),
    url: /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`,
    description: $("bookmark-description").value.trim(),
    icon: selectedIcon,
    iconColour: selectedColour,
  };
  const existing = bookmarkItems.find((item) => item.id === editingBookmarkId);
  if (existing) {
    Object.assign(existing, fields);
  } else {
    bookmarkItems.push({ id: uid(), ...fields });
  }
  saveBookmarks();
});

$("bookmark-delete").addEventListener("click", () => {
  bookmarkItems = bookmarkItems.filter((item) => item.id !== editingBookmarkId);
  bookmarkDialog.close();
  saveBookmarks();
});

// --- Category dialog --------------------------------------------------------

const categoryDialog = $("category-dialog");
let editingCategoryId = null;

function openCategoryDialog(category) {
  editingCategoryId = category?.id ?? null;
  $("category-dialog-heading").textContent = category
    ? "Rename category"
    : "Add category";
  $("category-name").value = category?.name ?? "";
  $("category-delete").hidden = !category;
  categoryDialog.showModal();
}

$("add-category").addEventListener("click", () => openCategoryDialog(null));

$("category-form").addEventListener("submit", () => {
  const name = $("category-name").value.trim();
  const existing = bookmarkItems.find((item) => item.id === editingCategoryId);
  if (existing) {
    existing.name = name;
  } else {
    bookmarkItems.push({ id: uid(), type: "category", name });
  }
  saveBookmarks();
});

// Removing a heading keeps its bookmarks; they join the section above it.
$("category-delete").addEventListener("click", () => {
  bookmarkItems = bookmarkItems.filter((item) => item.id !== editingCategoryId);
  categoryDialog.close();
  saveBookmarks();
});

// --- Card actions -----------------------------------------------------------

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const id = trigger.closest("[data-id]")?.dataset.id;

  if (trigger.dataset.action === "toggle-todo") {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;
    todo.done = trigger.checked;
    todo.completedAt = todo.done ? Date.now() : null;
    saveTodos();
  }
  if (trigger.dataset.action === "edit-todo") {
    const todo = todos.find((item) => item.id === id);
    if (todo) openTodoDialog(todo);
  }
  if (trigger.dataset.action === "edit-bookmark") {
    event.preventDefault();
    const bookmark = bookmarkItems.find((item) => item.id === id);
    if (bookmark) openBookmarkDialog(bookmark);
  }
  if (trigger.dataset.action === "edit-category") {
    const category = bookmarkItems.find((item) => item.id === id);
    if (category) openCategoryDialog(category);
  }
});

// --- Drag to reorder --------------------------------------------------------

let drag = null;

/** Which half of the card the pointer is in; the card's own axis decides. */
function dropsAfter(event, target) {
  const rect = target.getBoundingClientRect();
  return target.dataset.axis === "x"
    ? event.clientX > rect.left + rect.width / 2
    : event.clientY > rect.top + rect.height / 2;
}

function clearMarkers(container) {
  for (const marked of container.querySelectorAll(".drop-before, .drop-after")) {
    marked.classList.remove("drop-before", "drop-after");
  }
}

/**
 * Reorders `getItems()` in place when a card is dropped on another card of the
 * same list. A card with draggable="false" can only be picked up by its drag
 * handle, if it has one; archived to dos have neither and so stay put, though
 * anything can still be dropped onto.
 */
function enableReorder({ container, kind, itemSelector, getItems, persist }) {
  container.addEventListener("dragstart", (event) => {
    const item = event.target.closest(itemSelector);
    if (!item) return;
    const handle = event.target.closest("[data-drag-handle]");
    if (!handle && item.draggable === false) return;

    drag = { kind, id: item.dataset.id };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.dataset.id);
    // Without this the drag image would be the handle alone, not the row.
    if (handle) event.dataTransfer.setDragImage(item, 0, 0);
    item.classList.add("dragging");
  });

  container.addEventListener("dragend", () => {
    drag = null;
    for (const item of container.querySelectorAll(".dragging")) {
      item.classList.remove("dragging");
    }
    clearMarkers(container);
  });

  const targetFor = (event) => {
    if (drag?.kind !== kind) return null;
    const target = event.target.closest(itemSelector);
    return target && target.dataset.id !== drag.id ? target : null;
  };

  container.addEventListener("dragover", (event) => {
    const target = targetFor(event);
    if (!target) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    clearMarkers(container);
    target.classList.add(dropsAfter(event, target) ? "drop-after" : "drop-before");
  });

  container.addEventListener("dragleave", (event) => {
    if (!container.contains(event.relatedTarget)) clearMarkers(container);
  });

  container.addEventListener("drop", (event) => {
    const target = targetFor(event);
    if (!target) return;
    event.preventDefault();

    const items = getItems();
    const from = items.findIndex((item) => item.id === drag.id);
    if (from < 0) return;
    const [moved] = items.splice(from, 1);
    let to = items.findIndex((item) => item.id === target.dataset.id);
    if (dropsAfter(event, target)) to += 1;
    items.splice(to, 0, moved);
    persist();
  });
}

enableReorder({
  container: $("todo-list"),
  kind: "todo",
  itemSelector: ".todo-card",
  getItems: () => todos,
  persist: saveTodos,
});

enableReorder({
  container: $("bookmark-grid"),
  kind: "bookmark",
  itemSelector: ".bookmark-cell",
  getItems: () => bookmarkItems,
  persist: saveBookmarks,
});

// --- Wiring -----------------------------------------------------------------

for (const button of document.querySelectorAll("[data-close]")) {
  button.addEventListener("click", () => button.closest("dialog").close());
}

// Enter inserts a newline in a textarea, so Cmd/Ctrl+Enter saves the dialog.
for (const textarea of document.querySelectorAll("dialog textarea")) {
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      textarea.form.requestSubmit();
    }
  });
}

// Keep other open new tabs in step with edits made here.
extensionStorage?.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.todos) {
    todos = changes.todos.newValue ?? [];
    renderTodos();
  }
  if (changes.bookmarks) {
    bookmarkItems = changes.bookmarks.newValue ?? [];
    renderBookmarks();
  }
});

(async function load() {
  [todos, bookmarkItems] = await Promise.all([
    store.get("todos", []),
    store.get("bookmarks", []),
  ]);
  renderTodos();
  renderBookmarks();
})();
