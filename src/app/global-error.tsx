"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#f8fafc",
          color: "#18181b",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#71717a" }}>
            An unexpected error occurred. Please reload the page.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#002868",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "#e4e4e7",
                color: "#18181b",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
