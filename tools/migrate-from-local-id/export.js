"use strict";

const api = globalThis.browser ?? globalThis.chrome;

(async function exportData() {
  const summary = document.getElementById("summary");
  const stored = await api.storage.local.get(["todos", "bookmarks"]);
  const todos = Array.isArray(stored.todos) ? stored.todos : [];
  const bookmarks = Array.isArray(stored.bookmarks) ? stored.bookmarks : [];

  if (todos.length === 0 && bookmarks.length === 0) {
    summary.textContent =
      "No data found under the old extension ID. Either this profile never held " +
      "it, or Firefox cleared it when the temporary add-on was removed.";
    return;
  }

  const categories = bookmarks.filter((item) => item.type === "category").length;
  summary.textContent =
    `Found ${todos.length} to do${todos.length === 1 ? "" : "s"} and ` +
    `${bookmarks.length - categories} bookmark${bookmarks.length - categories === 1 ? "" : "s"}` +
    `${categories ? ` across ${categories} categor${categories === 1 ? "y" : "ies"}` : ""}. ` +
    "Save the file, then open a new tab and choose Restore.";

  const payload = { todos, bookmarks, exportedAt: new Date().toISOString() };
  const json = JSON.stringify(payload, null, 2);

  const raw = document.getElementById("raw");
  raw.value = json;
  document.getElementById("raw-wrap").hidden = false;

  const button = document.getElementById("download");
  button.hidden = false;
  button.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "newtabber-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  });
})();
