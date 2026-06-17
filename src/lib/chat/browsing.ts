// Client-side browsing tracker. Mirrors the backend BrowsingSession shape so the
// agent's /api/analytics + behavioral scoring receive the data they expect.

export type PageView = { path: string; title: string; visits: number; time_seconds: number };
export type BrowsingSession = {
  referrer: string;
  session_count: number;
  total_time_seconds: number;
  page_views: PageView[];
};

const KEY = 'bs_browsing';
const SESSION_FLAG = 'bs_session_started';

// ── Pure reducers (unit-tested) ──────────────────────────────────────────

export function emptySession(referrer = ''): BrowsingSession {
  return { referrer, session_count: 1, total_time_seconds: 0, page_views: [] };
}

/** Record a page visit: increment an existing page's visits or append a new one. */
export function recordView(s: BrowsingSession, path: string, title: string): BrowsingSession {
  const page_views = s.page_views.map((p) => ({ ...p }));
  const existing = page_views.find((p) => p.path === path);
  if (existing) {
    existing.visits += 1;
    existing.title = title;
  } else {
    page_views.push({ path, title, visits: 1, time_seconds: 0 });
  }
  return { ...s, page_views };
}

/** Add dwell time (seconds) to a page and the running total. */
export function addTime(s: BrowsingSession, path: string, seconds: number): BrowsingSession {
  if (seconds <= 0) return s;
  const page_views = s.page_views.map((p) =>
    p.path === path ? { ...p, time_seconds: p.time_seconds + seconds } : p,
  );
  return { ...s, total_time_seconds: s.total_time_seconds + seconds, page_views };
}

// ── Browser I/O (verified live) ──────────────────────────────────────────

const hasWindow = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function load(): BrowsingSession {
  if (!hasWindow()) return emptySession();
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptySession(document.referrer || '');
  try {
    return JSON.parse(raw) as BrowsingSession;
  } catch {
    return emptySession(document.referrer || '');
  }
}

function save(s: BrowsingSession): void {
  if (hasWindow()) localStorage.setItem(KEY, JSON.stringify(s));
}

let current: { path: string; enteredAt: number } | null = null;

/** Bump session_count once per browser tab session. Call before tracking. */
export function startSession(): void {
  if (!hasWindow()) return;
  if (sessionStorage.getItem(SESSION_FLAG)) return;
  sessionStorage.setItem(SESSION_FLAG, '1');
  const s = load();
  // First-ever visit already has session_count 1; only bump on later sessions.
  if (s.page_views.length > 0 || s.total_time_seconds > 0) {
    save({ ...s, session_count: s.session_count + 1 });
  }
}

/** Record navigation to a page, flushing dwell time onto the previous one. */
export function trackPage(path: string, title: string): void {
  if (!hasWindow()) return;
  if (current) {
    const secs = Math.round((Date.now() - current.enteredAt) / 1000);
    save(addTime(load(), current.path, secs));
  }
  save(recordView(load(), path, title));
  current = { path, enteredAt: Date.now() };
}

/** Snapshot of the session with the current page's dwell time flushed in. */
export function getBrowsing(): BrowsingSession {
  let s = load();
  if (current) {
    const secs = Math.round((Date.now() - current.enteredAt) / 1000);
    s = addTime(s, current.path, secs);
    save(s);
    current.enteredAt = Date.now();
  }
  return s;
}
