import { browser } from '$app/environment';

const KEY = 'cookie-consent';
type Choice = 'accepted' | 'rejected' | null;

// `ready` stays false until we've read localStorage in the browser, so the banner
// never renders on the server or during hydration (avoids a flash + hydration mismatch).
export const consent = $state<{ choice: Choice; ready: boolean }>({ choice: null, ready: false });

export function initConsent() {
  if (!browser) return;
  consent.choice = (localStorage.getItem(KEY) as Choice) ?? null;
  consent.ready = true;
}

export function setConsent(choice: 'accepted' | 'rejected') {
  consent.choice = choice;
  consent.ready = true;
  if (browser) localStorage.setItem(KEY, choice);
}
