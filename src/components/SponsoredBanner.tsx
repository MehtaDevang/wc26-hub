interface SponsoredBannerProps {
  sponsor?: string;
  message?: string;
}

export function SponsoredBanner({
  sponsor = "Partner with WC26 Hub",
  message = "Reach millions of World Cup fans across North America",
}: SponsoredBannerProps) {
  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <div className="host-stripe" />
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">Sponsored</p>
          <p className="text-zinc-900 font-semibold text-sm">{sponsor}</p>
          <p className="text-zinc-500 text-xs mt-0.5">{message}</p>
        </div>
        <a
          href="mailto:ads@wc26hub.com"
          className="shrink-0 rounded-lg bg-blue-600 text-white px-4 py-2 text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          Advertise
        </a>
      </div>
    </div>
  );
}
