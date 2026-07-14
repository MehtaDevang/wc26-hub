"use client";

import { useCallback, useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { buildTwitterShareUrl, buildWhatsAppShareUrl } from "@/lib/share";

interface ShareButtonsProps {
  /** SSR fallback only - click handlers use the current page URL in the browser. */
  url?: string;
  title: string;
  text: string;
  label?: string;
  className?: string;
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function resolvePageUrl(fallback?: string): string {
  if (typeof window !== "undefined") {
    const { origin, pathname, search } = window.location;
    if (fallback) {
      try {
        const parsed = new URL(fallback, origin);
        return parsed.href;
      } catch {
        return fallback;
      }
    }
    return `${origin}${pathname}${search}`;
  }
  return fallback ?? "";
}

async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      /* fall through */
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function ShareButtons({
  url,
  title,
  text,
  label = "Share",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = useCallback(() => {
    if (url) return resolvePageUrl(url);
    return resolvePageUrl();
  }, [url]);

  const copyLink = useCallback(async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [getShareUrl]);

  const handleShare = useCallback(async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    await copyLink();
  }, [copyLink, getShareUrl, title, text]);

  const openTwitter = useCallback(() => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    window.open(buildTwitterShareUrl(text, shareUrl), "_blank", "noopener,noreferrer");
  }, [getShareUrl, text]);

  const openWhatsApp = useCallback(() => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    window.open(buildWhatsAppShareUrl(text, shareUrl), "_blank", "noopener,noreferrer");
  }, [getShareUrl, text]);

  return (
    <div className={`share-buttons ${className}`.trim()}>
      <button
        type="button"
        onClick={handleShare}
        className="share-buttons-primary"
      >
        <Share2 size={15} />
        {label}
      </button>
      <div className="share-buttons-secondary">
        <button
          type="button"
          onClick={copyLink}
          className="share-buttons-icon"
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? <Check size={15} className="text-emerald-600" /> : <Link2 size={15} />}
        </button>
        <button
          type="button"
          onClick={openTwitter}
          className="share-buttons-icon"
          aria-label="Share on X"
          title="Share on X"
        >
          <XIcon />
        </button>
        <button
          type="button"
          onClick={openWhatsApp}
          className="share-buttons-icon"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon />
        </button>
      </div>
    </div>
  );
}
