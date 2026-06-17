/**
 * Detection for the Capacitor iOS/native shell.
 *
 * The shell appends `TheGoalPostsApp` to the user-agent (see capacitor.config.ts),
 * which lets us detect it on the server. At runtime we additionally check the
 * injected `window.Capacitor` global.
 *
 * Why this matters: Google AdSense is not permitted inside app webviews, so we
 * suppress ads (and redundant web-only prompts) when running in the app.
 */
export const NATIVE_UA_TOKEN = "TheGoalPostsApp";

export function isNativeUserAgent(userAgent: string | null | undefined): boolean {
  return !!userAgent && userAgent.includes(NATIVE_UA_TOKEN);
}

export function isNativeRuntime(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  if (cap?.isNativePlatform?.()) return true;
  return isNativeUserAgent(window.navigator?.userAgent);
}
