// JobKey extension service worker (Manifest V3).
// Keeps the unread-notification count on the toolbar badge (PRD: extension
// notification badge with count). Mocked at 3 until the backend exists.

const UNREAD_KEY = "jobkey_unread_count";
const DEFAULT_UNREAD = 3;

async function refreshBadge() {
  const stored = await chrome.storage.local.get(UNREAD_KEY);
  const count = stored[UNREAD_KEY] ?? DEFAULT_UNREAD;
  await chrome.action.setBadgeBackgroundColor({ color: "#EF6C20" });
  await chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ [UNREAD_KEY]: DEFAULT_UNREAD });
  await refreshBadge();
});

chrome.runtime.onStartup.addListener(refreshBadge);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[UNREAD_KEY]) refreshBadge();
});
