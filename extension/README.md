# JobKey for LinkedIn — Chrome Extension

Manifest V3 extension implementing PRD flows CE1–CE4: save LinkedIn candidates to the JobKey CRM,
quick-submit them to watchlist vacancies, and get duplicate detection — without leaving LinkedIn.

Zero build step: plain HTML/CSS/JS, loadable as-is.

## Load it

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode**
3. **Load unpacked** → select this `extension/` folder

## What's inside

| Path | Purpose |
|---|---|
| `manifest.json` | MV3 manifest — popup action, content script on `linkedin.com/in/*`, storage permission |
| `background.js` | Service worker: unread-notification count on the toolbar badge (orange) |
| `popup/` | Toolbar popup: notifications (mark-all-read syncs the badge) + watchlist with match % (green ≥80 / yellow 50–79 / gray <50, per PRD) |
| `content/` | LinkedIn overlay: floating **Save to JobKey** button → save popover (name prefilled from the page, tags, folder, note) → saved state; **Submit to Vacancy** → quick-submit panel (watchlist-first vacancy select, commission bid + earnings preview, consent gate); **"Already in your CRM"** duplicate badge → existing record + previous submissions |
| `icons/` | Generated brand icons (`node scripts/make-icons.mjs` regenerates them, zero deps) |

## Mock status

Profile data is read from the live page; CRM/watchlist/notification data is mocked in the scripts.
When the backend (roadmap Phases 11+) exists, replace the mock constants with API calls and wire
login to real JobKey credentials.
