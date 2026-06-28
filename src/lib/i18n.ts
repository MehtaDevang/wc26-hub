import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "./site";

export const LOCALES = ["en", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export const LOCALE_OG: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
};

export interface EmbedStrings {
  live: string;
  upcoming: string;
  fullTime: string;
  noMatchesToday: string;
  loadingScores: string;
}

export interface HomeCopy {
  localeLabel: string;
  fanTools: string;
  bracketPredictor: string;
  bracketPredictorDesc: string;
  qualificationScenarios: string;
  qualificationScenariosDesc: string;
  roadToR32: string;
  roadToR32Desc: string;
  whereToWatch: string;
  whereToWatchDesc: string;
  statLeaders: string;
  statLeadersDesc: string;
  officePool: string;
  officePoolDesc: string;
  rivalries: string;
  rivalriesDesc: string;
  embedWidget: string;
  embedWidgetDesc: string;
  cityGuides: string;
  cityGuidesDesc: string;
  dailyPuzzles: string;
  guessPlayer: string;
  guessPlayerDesc: string;
  nameScramble: string;
  nameScrambleDesc: string;
  dailyQuiz: string;
  dailyQuizDesc: string;
  viewAllPuzzles: string;
  worldCupHistory: string;
  historyTitle: string;
  historyDesc: string;
  browseHistory: string;
  exploreSubtitle: string;
  fixturesBtn: string;
  standingsBtn: string;
}

export interface LocaleStrings {
  liveScores: string;
  allFixtures: string;
  fixturesTitle: string;
  fixturesSubtitle: (count: number) => string;
  homeTitle: string;
  homeSubtitle: string;
  groupTables: string;
  groupTablesDesc: string;
  fullFixtures: string;
  fullFixturesDesc: string;
  knockoutBracket: string;
  knockoutBracketDesc: string;
  exploreTournament: string;
  noMatchesToday: string;
  live: string;
  upcoming: string;
  fullTime: string;
  loadingScores: string;
  autoUpdates: string;
}

const HOME_COPY: Record<Locale, HomeCopy> = {
  en: {
    localeLabel: "English",
    fanTools: "Fan Tools",
    bracketPredictor: "Bracket Predictor",
    bracketPredictorDesc: "Pick winners & share your bracket",
    qualificationScenarios: "Qualification Scenarios",
    qualificationScenariosDesc: "What does each team need to advance?",
    roadToR32: "Road to Round of 32",
    roadToR32Desc: "Live 32-team board & best third-placed tracker",
    whereToWatch: "Where to Watch",
    whereToWatchDesc: "TV channels for every match",
    statLeaders: "Stat Leaders",
    statLeadersDesc: "Golden Boot, assists & more",
    officePool: "Office Pool Kit",
    officePoolDesc: "Printable bracket & scoring rules",
    rivalries: "World Cup Rivalries",
    rivalriesDesc: "Argentina vs Brazil, Mexico vs USA, and 18 more historic matchups",
    embedWidget: "Embed Live Scores",
    embedWidgetDesc: "Free widget for blogs and fan sites",
    cityGuides: "Host City Travel Guides",
    cityGuidesDesc: "Airports, stadium transit, fan zones & tips for every host city",
    dailyPuzzles: "Daily Puzzles",
    guessPlayer: "Guess the Player",
    guessPlayerDesc: "Clue-based mystery footballer. 5 players daily.",
    nameScramble: "Name Scramble",
    nameScrambleDesc: "Unscramble 5 jumbled names to find footballers.",
    dailyQuiz: "Daily Quiz",
    dailyQuizDesc: "5 World Cup trivia questions every day.",
    viewAllPuzzles: "View all puzzles",
    worldCupHistory: "FIFA World Cup History",
    historyTitle: "22 editions · 8 champions · every final since 1930",
    historyDesc:
      "Explore every World Cup winner, final score, host nation, Golden Ball winners, all-time records, trophy history, prize money, and documented controversies.",
    browseHistory: "Browse FIFA World Cup history",
    exploreSubtitle: "Videos, lineups, stats, photos, and live tables for every match.",
    fixturesBtn: "Fixtures",
    standingsBtn: "Standings",
  },
  es: {
    localeLabel: "Español",
    fanTools: "Herramientas para fans",
    bracketPredictor: "Simulador de llave",
    bracketPredictorDesc: "Elige ganadores y comparte tu bracket",
    qualificationScenarios: "Escenarios de clasificación",
    qualificationScenariosDesc: "¿Qué necesita cada selección para avanzar?",
    roadToR32: "Camino a los 16avos",
    roadToR32Desc: "Tablero en vivo de 32 equipos y mejores terceros",
    whereToWatch: "Dónde ver",
    whereToWatchDesc: "Canales de TV para cada partido",
    statLeaders: "Líderes estadísticos",
    statLeadersDesc: "Bota de Oro, asistencias y más",
    officePool: "Quiniela de oficina",
    officePoolDesc: "Bracket imprimible y reglas de puntuación",
    rivalries: "Rivalidades del Mundial",
    rivalriesDesc: "Argentina vs Brasil, México vs EE.UU. y 18 duelos históricos más",
    embedWidget: "Widget de resultados",
    embedWidgetDesc: "Widget gratuito para blogs y sitios de fans",
    cityGuides: "Guías de ciudades sede",
    cityGuidesDesc: "Aeropuertos, transporte, fan zones y consejos de viaje",
    dailyPuzzles: "Puzzles diarios",
    guessPlayer: "Adivina el jugador",
    guessPlayerDesc: "Misterio con pistas. 5 jugadores al día.",
    nameScramble: "Nombre revuelto",
    nameScrambleDesc: "Ordena 5 nombres mezclados de futbolistas.",
    dailyQuiz: "Quiz diario",
    dailyQuizDesc: "5 preguntas de trivia del Mundial cada día.",
    viewAllPuzzles: "Ver todos los puzzles",
    worldCupHistory: "Historia de la Copa Mundial FIFA",
    historyTitle: "22 ediciones · 8 campeones · cada final desde 1930",
    historyDesc:
      "Explora cada campeón, final, sede, Balones de Oro, récords históricos, evolución del trofeo y controversias documentadas.",
    browseHistory: "Ver historia de la Copa Mundial FIFA",
    exploreSubtitle: "Videos, alineaciones, estadísticas y tablas en vivo de cada partido.",
    fixturesBtn: "Calendario",
    standingsBtn: "Grupos",
  },
  fr: {
    localeLabel: "Français",
    fanTools: "Outils fans",
    bracketPredictor: "Pronostics tableau",
    bracketPredictorDesc: "Choisissez les vainqueurs et partagez votre bracket",
    qualificationScenarios: "Scénarios de qualification",
    qualificationScenariosDesc: "De quoi chaque équipe a-t-elle besoin pour se qualifier ?",
    roadToR32: "Route vers les 16es",
    roadToR32Desc: "Tableau des 32 équipes et meilleurs troisièmes",
    whereToWatch: "Où regarder",
    whereToWatchDesc: "Chaînes TV pour chaque match",
    statLeaders: "Leaders statistiques",
    statLeadersDesc: "Soulier d'Or, passes décisives et plus",
    officePool: "Pool de bureau",
    officePoolDesc: "Bracket imprimable et règles de points",
    rivalries: "Rivalités de la Coupe du monde",
    rivalriesDesc: "Argentine vs Brésil, Mexique vs États-Unis et 18 autres duels historiques",
    embedWidget: "Widget scores en direct",
    embedWidgetDesc: "Widget gratuit pour blogs et sites de supporters",
    cityGuides: "Guides des villes hôtes",
    cityGuidesDesc: "Aéroports, transports, fan zones et conseils voyage",
    dailyPuzzles: "Puzzles quotidiens",
    guessPlayer: "Devine le joueur",
    guessPlayerDesc: "Mystère à énigmes. 5 joueurs par jour.",
    nameScramble: "Nom mélangé",
    nameScrambleDesc: "Retrouvez 5 noms de footballeurs mélangés.",
    dailyQuiz: "Quiz du jour",
    dailyQuizDesc: "5 questions de trivia Coupe du monde chaque jour.",
    viewAllPuzzles: "Voir tous les puzzles",
    worldCupHistory: "Histoire de la Coupe du monde FIFA",
    historyTitle: "22 éditions · 8 champions · chaque finale depuis 1930",
    historyDesc:
      "Explorez chaque vainqueur, finale, nation hôte, Ballons d'Or, records historiques, trophées et controverses documentées.",
    browseHistory: "Parcourir l'histoire de la Coupe du monde FIFA",
    exploreSubtitle: "Vidéos, compositions, stats et classements en direct pour chaque match.",
    fixturesBtn: "Calendrier",
    standingsBtn: "Classements",
  },
};

const STRINGS: Record<Locale, LocaleStrings> = {
  en: {
    liveScores: "Live Scores",
    allFixtures: "All fixtures",
    fixturesTitle: "Fixtures & Results",
    fixturesSubtitle: (n) =>
      `All World Cup 2026 matches · ${n} fixtures · kick-offs in your local time`,
    homeTitle: "FIFA World Cup 2026 Live Scores",
    homeSubtitle: "Live scores, fixtures, standings, and stats for every match.",
    groupTables: "Group Tables",
    groupTablesDesc: "Live standings for all 12 groups",
    fullFixtures: "Full Fixtures",
    fullFixturesDesc: "Every match, venue & kickoff time",
    knockoutBracket: "Knockout Bracket",
    knockoutBracketDesc: "R32 through the Final - live tournament path",
    exploreTournament: "Explore the Tournament",
    noMatchesToday: "No matches today",
    live: "Live",
    upcoming: "Upcoming",
    fullTime: "Full Time",
    loadingScores: "Loading scores...",
    autoUpdates: "Auto-updates",
  },
  es: {
    liveScores: "Resultados en vivo",
    allFixtures: "Todos los partidos",
    fixturesTitle: "Calendario y resultados",
    fixturesSubtitle: (n) =>
      `Todos los partidos del Mundial 2026 · ${n} encuentros · horarios en tu zona`,
    homeTitle: "Mundial 2026 - Resultados en vivo",
    homeSubtitle: "Marcadores, calendario, grupos y estadísticas de cada partido.",
    groupTables: "Tablas de grupos",
    groupTablesDesc: "Clasificación en vivo de los 12 grupos",
    fullFixtures: "Calendario completo",
    fullFixturesDesc: "Todos los partidos, sedes y horarios",
    knockoutBracket: "Llave eliminatoria",
    knockoutBracketDesc: "Desde dieciseisavos hasta la final",
    exploreTournament: "Explora el torneo",
    noMatchesToday: "Sin partidos hoy",
    live: "En vivo",
    upcoming: "Próximos",
    fullTime: "Finalizado",
    loadingScores: "Cargando resultados...",
    autoUpdates: "Actualización automática",
  },
  fr: {
    liveScores: "Scores en direct",
    allFixtures: "Tous les matchs",
    fixturesTitle: "Calendrier et résultats",
    fixturesSubtitle: (n) =>
      `Tous les matchs de la Coupe du monde 2026 · ${n} rencontres · heures locales`,
    homeTitle: "Coupe du monde 2026 - Scores en direct",
    homeSubtitle: "Scores, calendrier, classements et stats pour chaque match.",
    groupTables: "Classements des groupes",
    groupTablesDesc: "Classements en direct des 12 groupes",
    fullFixtures: "Calendrier complet",
    fullFixturesDesc: "Tous les matchs, stades et horaires",
    knockoutBracket: "Tableau à élimination",
    knockoutBracketDesc: "Des huitièmes de finale à la finale",
    exploreTournament: "Explorer le tournoi",
    noMatchesToday: "Aucun match aujourd'hui",
    live: "En direct",
    upcoming: "À venir",
    fullTime: "Terminé",
    loadingScores: "Chargement des scores...",
    autoUpdates: "Mise à jour auto",
  },
};

export function getStrings(locale: Locale): LocaleStrings {
  return STRINGS[locale] ?? STRINGS.en;
}

export function getHomeCopy(locale: Locale): HomeCopy {
  return HOME_COPY[locale] ?? HOME_COPY.en;
}

export function getEmbedStrings(locale: Locale): EmbedStrings {
  const s = getStrings(locale);
  return {
    live: s.live,
    upcoming: s.upcoming,
    fullTime: s.fullTime,
    noMatchesToday: s.noMatchesToday,
    loadingScores: s.loadingScores,
  };
}

export function localePath(locale: Locale, path = ""): string {
  if (locale === "en") return path || "/";
  const base = `/${locale}`;
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildHreflangAlternates(path: string): Metadata["alternates"] {
  const siteUrl = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {};

  for (const locale of LOCALES) {
    languages[locale] = `${siteUrl}${localePath(locale, normalized === "/" ? "" : normalized)}`;
  }
  languages["x-default"] = `${siteUrl}${normalized}`;

  return {
    canonical: `${siteUrl}${normalized}`,
    languages,
  };
}

export function createLocalizedMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
  const localizedPath = localePath(locale, path);

  return {
    title: pageTitle,
    description,
    alternates: buildHreflangAlternates(path),
    openGraph: {
      title: pageTitle,
      description,
      url: `${getSiteUrl()}${localizedPath}`,
      siteName: SITE_NAME,
      type: "website",
      locale: LOCALE_OG[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}
