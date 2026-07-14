import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Star } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { MyTeamsPicker } from "@/components/MyTeams";
import { JsonLd } from "@/components/JsonLd";
import { HomeQuickLinks } from "@/components/home/HomeQuickLinks";
import { PredictTheFinal } from "@/components/home/PredictTheFinal";
import { HomeSemifinalShowdowns } from "@/components/home/HomeSemifinalShowdowns";
import {
  getHomeFinaleData,
  HomeDashboardBracketSection,
  HomeDashboardScoresSection,
  HomeFinaleHeroSection,
  HomeFinalFourSection,
  HomeGoldenBootSection,
  HomeNewsSection,
  HomeSectionSkeleton,
  type HomeFinaleData,
} from "@/components/home/HomeSections";
import { buildWebPageJsonLd } from "@/lib/structured-data";
import { getStrings, localePath, type Locale } from "@/lib/i18n";

interface LocalizedHomePageProps {
  locale: Locale;
}

function FollowYourTeams() {
  return (
    <section className="home-dash-panel home-dash-panel--teams">
      <div className="home-dash-panel-stripe" aria-hidden />
      <div className="home-dash-panel-head home-dash-panel-head--compact">
        <div className="home-dash-panel-head-icon home-dash-panel-head-icon--teams">
          <Star size={16} className="fill-current" />
        </div>
        <div className="home-dash-panel-head-text min-w-0 flex-1">
          <h2 className="home-dash-panel-title">Follow your teams</h2>
        </div>
        <Link href="/my" className="home-dash-panel-link shrink-0">
          My WC <ArrowRight size={12} />
        </Link>
      </div>
      <div className="home-dash-panel-body home-dash-panel-body--compact">
        <MyTeamsPicker />
      </div>
    </section>
  );
}

function FinaleHomePage({ finale }: { finale: HomeFinaleData }) {
  const finalists =
    finale.state.finalists.length > 0 ? finale.state.finalists : finale.state.semifinalists;

  return (
    <div className="home-dashboard home-dashboard--finale space-y-5 sm:space-y-6">
      <JsonLd
        data={buildWebPageJsonLd({
          path: localePath("en"),
          title: `FIFA World Cup 2026 ${finale.state.stageLabel} - Road to the Final`,
          description:
            "Live coverage of the World Cup 2026 semi-finals and Final: countdown, the final four, the Golden Boot race and the path to the trophy.",
        })}
      />

      <HomeFinaleHeroSection data={finale} />

      {finale.state.stage === "semi" && (
        <HomeSemifinalShowdowns
          matches={finale.state.semiFinals}
          fixtures={finale.semiFinalFixtures}
        />
      )}

      <div className="home-dashboard-grid home-dashboard-grid--finale">
        <div className="flex flex-col gap-4 sm:gap-5">
          <Suspense fallback={<HomeSectionSkeleton height={360} className="home-dash-panel-skeleton" />}>
            <HomeFinalFourSection state={finale.state} />
          </Suspense>

          {finale.state.stage !== "champions" && finalists.length >= 2 && (
            <PredictTheFinal
              candidates={finalists}
              locked={finale.state.stage === "final"}
            />
          )}
        </div>

        <Suspense fallback={<HomeSectionSkeleton height={420} className="home-dash-panel-skeleton" />}>
          <div id="bracket" className="min-h-0">
            <HomeDashboardBracketSection />
          </div>
        </Suspense>
      </div>

      <Suspense fallback={<HomeSectionSkeleton height={120} />}>
        <HomeGoldenBootSection variant="finale" />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton height={200} />}>
        <HomeNewsSection limit={3} />
      </Suspense>

      <FollowYourTeams />

      <HomeQuickLinks />
    </div>
  );
}

export async function LocalizedHomePage({ locale }: LocalizedHomePageProps) {
  const t = getStrings(locale);

  if (locale === "en") {
    const finale = await getHomeFinaleData();
    if (finale.state.stage !== "pre") {
      return <FinaleHomePage finale={finale} />;
    }
  }

  const jsonTitle =
    locale === "es"
      ? "Mundial 2026 - Resultados en vivo"
      : locale === "fr"
        ? "Coupe du monde 2026 - Scores en direct"
        : "FIFA World Cup 2026 Live Scores Today";

  return (
    <div className="home-dashboard space-y-5 sm:space-y-6">
      <JsonLd
        data={buildWebPageJsonLd({
          path: localePath(locale),
          title: jsonTitle,
          description: t.homeSubtitle,
        })}
      />

      {locale !== "en" && (
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="host-stripe" />
          <div className="p-4 sm:p-5">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">{t.homeTitle}</h1>
            <p className="text-sm text-zinc-500 mt-1">{t.homeSubtitle}</p>
          </div>
        </div>
      )}

      <HomeHero />

      <div className="home-dashboard-grid" id="live">
        <Suspense fallback={<HomeSectionSkeleton height={420} className="home-dash-panel-skeleton" />}>
          <HomeDashboardScoresSection locale={locale} />
        </Suspense>

        <Suspense fallback={<HomeSectionSkeleton height={420} className="home-dash-panel-skeleton" />}>
          <div id="bracket" className="h-full min-h-0">
            <HomeDashboardBracketSection />
          </div>
        </Suspense>
      </div>

      <Suspense fallback={<HomeSectionSkeleton height={120} />}>
        <HomeGoldenBootSection />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton height={200} />}>
        <HomeNewsSection limit={3} />
      </Suspense>

      <FollowYourTeams />

      <HomeQuickLinks />
    </div>
  );
}
