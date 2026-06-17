const PUSH_KEY = "wc26_push_enabled";
const NOTIFIED_KEY = "wc26_push_notified";

export function isPushEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PUSH_KEY) === "true";
}

export function setPushEnabled(value: boolean): void {
  localStorage.setItem(PUSH_KEY, value ? "true" : "false");
  if (!value) localStorage.removeItem(NOTIFIED_KEY);
}

export function getNotifiedMatchIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function markMatchNotified(id: string): void {
  const set = getNotifiedMatchIds();
  set.add(id);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set].slice(-120)));
}

/** Whether a specific alert event (e.g. `matchId:kickoff`) has already fired. */
export function hasNotifiedEvent(key: string): boolean {
  return getNotifiedMatchIds().has(key);
}

export function markNotifiedEvent(key: string): void {
  markMatchNotified(key);
}

export async function requestPushPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") {
    setPushEnabled(true);
    return true;
  }
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  const ok = result === "granted";
  setPushEnabled(ok);
  return ok;
}

export function showMatchNotification(title: string, body: string, url: string): void {
  if (!isPushEnabled() || Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => {
        reg.active?.postMessage({ type: "SHOW_NOTIFICATION", title, body, url });
      })
      .catch(() => {
        new Notification(title, { body, icon: "/favicon.svg" });
      });
    return;
  }

  new Notification(title, { body, icon: "/favicon.svg" });
}
