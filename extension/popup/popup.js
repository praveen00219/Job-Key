// JobKey popup: notifications (with unread badge sync) + watchlist with
// match % to the current profile (PRD flow CE3). Mock data until the
// backend exists.

const UNREAD_KEY = "jobkey_unread_count";

const NOTIFICATIONS = [
  { id: 1, title: "Bid accepted", body: "Alex Chen — Engineering Manager at TechCorp", time: "2h ago", unread: true },
  { id: 2, title: "Candidate advanced to Interview", body: "Priya Anand — Senior Product Designer", time: "5h ago", unread: true },
  { id: 3, title: "New vacancy matches your alert", body: "Lead Software Engineer at TechCorp (Match: 88%)", time: "1d ago", unread: true },
  { id: 4, title: "Payout processed", body: "£5,000 sent to Barclays ****4532", time: "3d ago", unread: false },
];

const WATCHLIST = [
  { title: "Senior Software Engineer", meta: "Spotify · London · £70-90k", match: 88 },
  { title: "Engineering Manager", meta: "Electronic Arts · London · £70-90k", match: 74 },
  { title: "Customer Success Lead", meta: "Snap Inc · London · £70-90k", match: 61 },
  { title: "Lead Software Engineer", meta: "Fitbit · London · £70-90k", match: 42 },
];

function matchClass(pct) {
  if (pct >= 80) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

function renderNotifications(items) {
  const list = document.getElementById("notificationList");
  list.innerHTML = "";
  for (const n of items) {
    const li = document.createElement("li");
    li.className = `notification ${n.unread ? "unread" : "read"}`;
    li.innerHTML = `
      <span class="dot"></span>
      <span class="text">
        <span class="title">${n.title}</span><br />
        <span>${n.body}</span><br />
        <span class="time">${n.time}</span>
      </span>`;
    list.appendChild(li);
  }
}

function renderWatchlist() {
  const list = document.getElementById("watchlist");
  list.innerHTML = "";
  for (const v of WATCHLIST) {
    const li = document.createElement("li");
    li.className = "vacancy";
    li.innerHTML = `
      <span class="info">
        <span class="title">${v.title}</span><br />
        <span class="meta">${v.meta}</span>
      </span>
      <span class="match ${matchClass(v.match)}">${v.match}%</span>`;
    list.appendChild(li);
  }
}

document.getElementById("markAllRead").addEventListener("click", async () => {
  NOTIFICATIONS.forEach((n) => (n.unread = false));
  renderNotifications(NOTIFICATIONS);
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ [UNREAD_KEY]: 0 });
  }
});

renderNotifications(NOTIFICATIONS);
renderWatchlist();
