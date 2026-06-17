import { Smartphone, Monitor } from "lucide-react";
import { WC26PageBanner } from "@/components/WC26Brand";
import { WallpaperGallery } from "@/components/WallpaperGallery";
import { AdBanner } from "@/components/AdBanner";
import { FaqSection } from "@/components/FaqSection";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { WALLPAPERS } from "@/lib/wallpapers";
import { getDbWallpapers } from "@/lib/db-wallpapers";

export const metadata = createPageMetadata({
  title: "World Cup Wallpapers - Iconic Moments HD for Phone & Laptop",
  description:
    "Download free HD World Cup wallpapers celebrating the most iconic moments of all time - the Hand of God, Messi 2022, the Maracanazo and more. Original poster art for phone and laptop, free to share.",
  path: "/wallpapers",
  keywords: [
    "World Cup wallpapers",
    "FIFA wallpapers HD",
    "iconic World Cup moments wallpaper",
    "football wallpaper phone",
    "World Cup wallpaper laptop",
  ],
});

export const revalidate = 300;

export default async function WallpapersPage() {
  const designs = WALLPAPERS.map(({ slug, headline, match, venue, caption, year }) => ({
    slug,
    headline,
    match,
    venue,
    caption,
    year,
  }));
  const library = await getDbWallpapers();

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Iconic Moments Wallpapers"
        subtitle="The most famous World Cup moments of all time - free HD wallpapers for phone & laptop"
      />

      <section className="card-surface rounded-2xl p-5 sm:p-6">
        <p className="text-sm text-zinc-600 leading-relaxed">
          Original poster-style wallpapers celebrating football&rsquo;s greatest World Cup moments -
          from Maradona&rsquo;s Hand of God to Messi&rsquo;s crowning in Qatar. Tap{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
            <Smartphone size={13} /> Phone
          </span>{" "}
          or{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
            <Monitor size={13} /> Laptop
          </span>{" "}
          to download in HD, or share with a friend. Free, no sign-up.
        </p>
        <p className="mt-2 text-[11px] text-zinc-400">
          <strong>Design wallpapers</strong> are original artwork by {SITE_NAME} - free to download
          and share.
        </p>
      </section>

      <WallpaperGallery designs={designs} library={library} />

      <AdBanner placement="inline" />

      <FaqSection heading="World Cup wallpapers - FAQ" items={WALLPAPER_FAQ} />
    </div>
  );
}

const WALLPAPER_FAQ = [
  {
    question: "Are the wallpapers free to download?",
    answer:
      "Yes. Every wallpaper is free to download in HD for both phone and laptop, with no sign-up required. They are original poster designs you can use as your device background and share with friends.",
  },
  {
    question: "What resolutions are available?",
    answer:
      "Each design is available in a tall phone resolution (1170×2532) and a wide laptop/desktop resolution (2560×1440), so it looks sharp on modern screens.",
  },
  {
    question: "Which World Cup moments are included?",
    answer:
      "Famous moments across World Cup history - Maradona's Hand of God (1986), Brazil 1970, the 1950 Maracanazo, Iniesta 2010, Germany 7-1 Brazil (2014), Messi and Mbappé in 2022, and more.",
  },
  {
    question: "Can I use these as my phone or desktop wallpaper?",
    answer:
      "Absolutely. Download the phone version and set it from your photo gallery, or download the laptop version and set it as your desktop background.",
  },
];
