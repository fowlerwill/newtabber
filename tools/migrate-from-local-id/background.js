"use strict";

// Nothing else in this add-on has a UI, so open the export page as soon as it
// loads. Firefox assigns the page a per-profile URL that cannot be guessed.
browser.runtime.onInstalled.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL("export.html") });
});
