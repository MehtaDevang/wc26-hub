import { Bell, Download, Share, Smartphone, WifiOff, Zap } from "lucide-react";
import { WC26PageBanner } from "@/components/WC26Brand";
import { InstallButton } from "@/components/InstallButton";
import { FaqSection } from "@/components/FaqSection";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Get the App - Install World Cup 2026 Live Scores",
  description: `Install ${SITE_NAME} on your phone for one-tap World Cup 2026 live scores, offline fixtures and match alerts. Free, no app store needed - works on Android and iPhone.`,
  path: "/install",
  keywords: [
    "World Cup 2026 app",
    "install World Cup app",
    "World Cup live scores app",
    "add to home screen",
  ],
});

const BENEFITS = [
  { icon: Zap, title: "One-tap launch", body: "Open straight to live scores from your home screen - no browser, no typing." },
  { icon: Bell, title: "Match alerts", body: "Get notified for kick-off, goals and full-time for the teams you follow." },
  { icon: WifiOff, title: "Works offline", body: "Browse fixtures and core pages even on a flaky connection at the stadium." },
  { icon: Smartphone, title: "Full-screen & fast", body: "A clean, app-like experience with no address bar getting in the way." },
];

const ANDROID_STEPS = [
  "Open thegoalposts.in in Chrome.",
  "Tap the menu (⋮) in the top-right.",
  "Choose “Install app” / “Add to Home screen”.",
  "Confirm - the app icon appears on your home screen.",
];

const IOS_STEPS = [
  "Open thegoalposts.in in Safari.",
  "Tap the Share button (the square with an up arrow).",
  "Scroll down and tap “Add to Home Screen”.",
  "Tap “Add” - the app icon appears on your home screen.",
];

export default function InstallPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Get the App"
        subtitle="Install The Goal Posts for instant World Cup 2026 live scores - free, no app store"
      />

      <section className="card-surface rounded-2xl p-5 sm:p-7">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-192.png"
              alt={`${SITE_NAME} app icon`}
              width={64}
              height={64}
              className="rounded-2xl shadow-sm"
            />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">{SITE_NAME}</h2>
              <p className="text-sm text-zinc-500">
                Live scores, fixtures, standings & alerts - installs in seconds.
              </p>
            </div>
          </div>
          <InstallButton />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BENEFITS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-surface flex gap-3 rounded-2xl p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">{title}</p>
              <p className="mt-0.5 text-sm text-zinc-500 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StepCard
          icon={<Download size={18} className="text-blue-600" />}
          title="Install on Android"
          steps={ANDROID_STEPS}
        />
        <StepCard
          icon={<Share size={18} className="text-blue-600" />}
          title="Install on iPhone & iPad"
          steps={IOS_STEPS}
        />
      </div>

      <FaqSection heading="Installing the app - FAQ" items={INSTALL_FAQ} />
    </div>
  );
}

function StepCard({
  icon,
  title,
  steps,
}: {
  icon: React.ReactNode;
  title: string;
  steps: string[];
}) {
  return (
    <section className="card-surface rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
        {icon}
        {title}
      </h2>
      <ol className="mt-3 space-y-2">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-zinc-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const INSTALL_FAQ = [
  {
    question: "Is the app free?",
    answer:
      "Yes. The Goal Posts is completely free to install and use. It installs directly from your browser - no app store account or download required.",
  },
  {
    question: "Does it work on both Android and iPhone?",
    answer:
      "Yes. On Android (Chrome) you can install it in one tap. On iPhone and iPad, open the site in Safari, tap Share, then Add to Home Screen.",
  },
  {
    question: "Do I get match notifications?",
    answer:
      "Yes. Once installed and after you allow notifications, you can receive alerts for kick-off, goals and full-time for the teams you follow.",
  },
  {
    question: "How much storage does it use?",
    answer:
      "Almost none. The app is a lightweight shell that loads live content on demand, so it uses far less space than a typical downloaded app.",
  },
];
