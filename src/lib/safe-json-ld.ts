/** Escape `<` so JSON-LD cannot break out of a script block (XSS). */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
