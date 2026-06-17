export const CONSENT_STORAGE_KEY = "wc26_cookie_consent";

export type ConsentChoice = "granted" | "denied";

/**
 * Regions where we default to denied and require an explicit opt-in before
 * personalised advertising / non-essential storage (EEA + UK + Switzerland).
 */
export const CONSENT_RESTRICTED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

/**
 * Inline script that initialises Google Consent Mode v2 before any ad/analytics
 * tag loads. Restricted regions default to denied; everywhere else defaults to
 * granted. A previously stored choice is applied immediately.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent','default',${JSON.stringify(GRANTED)});
gtag('consent','default',${JSON.stringify({ ...DENIED, region: CONSENT_RESTRICTED_REGIONS, wait_for_update: 500 })});
try{
  var c = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if(c==='granted'){gtag('consent','update',${JSON.stringify(GRANTED)});}
  else if(c==='denied'){gtag('consent','update',${JSON.stringify(DENIED)});}
}catch(e){}
`.trim();

export function updateConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", choice === "granted" ? GRANTED : DENIED);
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage unavailable (private mode); consent applies for this session only.
  }
}
