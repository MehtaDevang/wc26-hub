export async function fetchJson<T>(
  url: string,
  options?: { timeoutMs?: number; init?: RequestInit }
): Promise<T> {
  const { timeoutMs = 15_000, init } = options ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out — check your connection");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
