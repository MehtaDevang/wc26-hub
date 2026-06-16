import { TEAMS } from "../data";
import { getTeamFlag } from "../teams";

/**
 * "Which World Cup team are you?" — a playful trait quiz.
 *
 * Each answer nudges the player's score across five personality axes. Every
 * eligible team has a profile vector on the same axes, and we pick the team
 * whose direction best matches the player (cosine similarity, so heavyweight
 * teams don't win every time). Same answers always produce the same team.
 */

export type Axis = "flair" | "attack" | "passion" | "pedigree" | "star";

export const AXES: Axis[] = ["flair", "attack", "passion", "pedigree", "star"];

/** Human labels for each end of an axis, used to describe the player's style. */
export const AXIS_POLES: Record<Axis, { positive: string; negative: string }> = {
  flair: { positive: "Flair", negative: "Pragmatic" },
  attack: { positive: "Attacking", negative: "Defensive" },
  passion: { positive: "Passionate", negative: "Ice-cool" },
  pedigree: { positive: "Born winner", negative: "Underdog heart" },
  star: { positive: "Star-led", negative: "Team-first" },
};

type Vec = Record<Axis, number>;

export interface QuizOption {
  label: string;
  weights: Partial<Vec>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "vibe",
    prompt: "It's matchday. What's your vibe?",
    options: [
      { label: "All-out attack — entertain me!", weights: { attack: 2, flair: 1 } },
      { label: "Keep it tight and win 1-0", weights: { attack: -2, flair: -1 } },
      { label: "Control everything, pass them to death", weights: { flair: 1, star: -1, passion: -1 } },
      { label: "Whatever it takes — scrap, fight, win ugly", weights: { passion: 1.5, attack: -0.5, pedigree: -0.5 } },
    ],
  },
  {
    id: "friends",
    prompt: "Your friends would describe you as…",
    options: [
      { label: "The creative one, full of flair", weights: { flair: 2, star: 0.5 } },
      { label: "Reliable and super organized", weights: { flair: -1.5, passion: -1 } },
      { label: "Passionate and a little dramatic", weights: { passion: 2 } },
      { label: "The leader everyone follows", weights: { star: 1.5, pedigree: 0.5 } },
    ],
  },
  {
    id: "win",
    prompt: "Pick how you'd want to win the World Cup:",
    options: [
      { label: "Dazzling the world with beautiful football", weights: { flair: 2, attack: 1 } },
      { label: "Grinding out gritty 1-0s", weights: { flair: -1.5, attack: -1.5, passion: 0.5 } },
      { label: "Riding one superstar's magic", weights: { star: 2 } },
      { label: "A fearless underdog run nobody saw coming", weights: { pedigree: -2, passion: 1 } },
    ],
  },
  {
    id: "losing",
    prompt: "You're 1-0 down with 10 minutes left. You…",
    options: [
      { label: "Throw everyone forward", weights: { attack: 2, passion: 1 } },
      { label: "Stay calm and keep passing — the goal will come", weights: { passion: -1.5, flair: 1, star: -1 } },
      { label: "Get it to your best player and clear out", weights: { star: 2 } },
      { label: "Press like crazy and force a mistake", weights: { passion: 1.5, attack: 1 } },
    ],
  },
  {
    id: "team",
    prompt: "Your ideal team is built around…",
    options: [
      { label: "One world-class genius", weights: { star: 2, pedigree: 0.5 } },
      { label: "Eleven mates who'd run through a wall for each other", weights: { star: -2, passion: 1 } },
      { label: "A slick system everyone buys into", weights: { flair: 0.5, star: -1.5, passion: -1 } },
      { label: "Raw pace and power", weights: { attack: 1, passion: 1, flair: -0.5 } },
    ],
  },
  {
    id: "pressure",
    prompt: "How do you handle pressure?",
    options: [
      { label: "I thrive on it — bring the noise", weights: { passion: 2 } },
      { label: "Ice in my veins, totally composed", weights: { passion: -2 } },
      { label: "Express myself and have fun with it", weights: { flair: 1.5, passion: 0.5 } },
      { label: "Dig in and out-work everyone", weights: { passion: 1, pedigree: -0.5, attack: -0.5 } },
    ],
  },
  {
    id: "celebration",
    prompt: "Pick a goal celebration:",
    options: [
      { label: "A choreographed dance with the whole squad", weights: { flair: 1.5, star: -1, passion: 1 } },
      { label: "A roar to the crowd, fists clenched", weights: { passion: 1.5 } },
      { label: "Cool and calm — just point to the badge", weights: { passion: -1, pedigree: 1 } },
      { label: "Knee-slide into pure chaos", weights: { passion: 1, flair: 0.5 } },
    ],
  },
  {
    id: "favorite",
    prompt: "What's your relationship with being the favorite?",
    options: [
      { label: "Love it — we're here to win the whole thing", weights: { pedigree: 2, star: 0.5 } },
      { label: "I prefer being underestimated", weights: { pedigree: -2, passion: 0.5 } },
      { label: "Doesn't matter — we play our way", weights: { flair: 1 } },
      { label: "Quiet confidence; let the football talk", weights: { pedigree: 1, passion: -1 } },
    ],
  },
];

interface TeamProfile {
  vec: Vec;
  tagline: string;
  blurb: string;
}

/** ~24 marquee teams with hand-tuned personality vectors (-2..+2 per axis). */
const TEAM_PROFILES: Record<string, TeamProfile> = {
  BRA: {
    vec: { flair: 2, attack: 2, passion: 1, pedigree: 1.5, star: 1.5 },
    tagline: "Joga bonito. You play to entertain.",
    blurb: "Pure samba flair, fearless attacking, and a swagger that says football should be beautiful.",
  },
  ARG: {
    vec: { flair: 1.5, attack: 1, passion: 2, pedigree: 2, star: 2 },
    tagline: "Heart, genius, and a winner's edge.",
    blurb: "Passion that boils over, a touch of magic, and the belief of champions. You play with your soul.",
  },
  FRA: {
    vec: { flair: 1, attack: 1.5, passion: 0.5, pedigree: 2, star: 1.5 },
    tagline: "Effortless, ruthless, loaded with talent.",
    blurb: "Cool, devastating and deep in quality — you make winning look easy and expect nothing less.",
  },
  ENG: {
    vec: { flair: 0, attack: 0.5, passion: 1, pedigree: 1.5, star: 0.5 },
    tagline: "Structured, dogged, carrying big expectations.",
    blurb: "You back a plan, grind through the noise, and carry the weight of a nation that wants it badly.",
  },
  ESP: {
    vec: { flair: 1.5, attack: 1, passion: -0.5, pedigree: 1.5, star: -1.5 },
    tagline: "Patience, possession, death by a thousand passes.",
    blurb: "Calm, collective and technical — you trust the system and pass opponents into submission.",
  },
  GER: {
    vec: { flair: -0.5, attack: 0.5, passion: 0, pedigree: 1.5, star: -0.5 },
    tagline: "The machine. Efficient, relentless, organized.",
    blurb: "No fuss, no drama — just a ruthlessly well-drilled operation that finds a way to win.",
  },
  POR: {
    vec: { flair: 1.5, attack: 1, passion: 1, pedigree: 1, star: 2 },
    tagline: "Flair, drama, and a superstar to carry it.",
    blurb: "Stylish and emotional, built around moments of individual brilliance and big-stage charisma.",
  },
  NED: {
    vec: { flair: 1.5, attack: 1.5, passion: 0.5, pedigree: 1, star: 0 },
    tagline: "Total football. Bold ideas, front-foot football.",
    blurb: "Inventive and attacking with strong opinions on how the game should be played. You commit fully.",
  },
  BEL: {
    vec: { flair: 1, attack: 1, passion: 0, pedigree: 0.5, star: 1 },
    tagline: "A golden generation of talent.",
    blurb: "Gifted individuals and high ceilings — you've got the quality, now it's about the moment.",
  },
  URU: {
    vec: { flair: -0.5, attack: -0.5, passion: 2, pedigree: 0.5, star: 0.5 },
    tagline: "Garra charrúa. You fight for every inch.",
    blurb: "Stubborn, fierce and proud — you punch above your weight through sheer will and spirit.",
  },
  CRO: {
    vec: { flair: 1, attack: 0, passion: 1.5, pedigree: 0.5, star: 0.5 },
    tagline: "Midfield craft and a never-say-die heart.",
    blurb: "Technical, tireless and clutch — you out-think and out-run teams who fancied their chances.",
  },
  MAR: {
    vec: { flair: 0.5, attack: 0, passion: 1.5, pedigree: -0.5, star: -0.5 },
    tagline: "Organized, united, giant-slaying heart.",
    blurb: "Rock-solid and together, you turn defensive discipline and belief into history-making runs.",
  },
  JPN: {
    vec: { flair: 1, attack: 1, passion: 0, pedigree: -0.5, star: -1 },
    tagline: "Disciplined, technical, quietly fearless.",
    blurb: "Precise and selfless, you blend tidy football with the nerve to topple the big names.",
  },
  KOR: {
    vec: { flair: 0.5, attack: 0.5, passion: 2, pedigree: -0.5, star: 0.5 },
    tagline: "Relentless energy that never stops running.",
    blurb: "High-octane and fearless, you press, chase and fight until the very last whistle.",
  },
  USA: {
    vec: { flair: 0.5, attack: 1, passion: 1, pedigree: 0, star: 0 },
    tagline: "Young, athletic, and full of belief.",
    blurb: "Energetic and ambitious with nothing to lose — you back yourself to gatecrash the party.",
  },
  MEX: {
    vec: { flair: 1, attack: 0.5, passion: 1.5, pedigree: 0, star: 0 },
    tagline: "Color, passion, and a party in the stands.",
    blurb: "Expressive and emotional, you play with flair and a fanbase that turns every game into a fiesta.",
  },
  SEN: {
    vec: { flair: 0.5, attack: 1, passion: 1.5, pedigree: 0, star: 0.5 },
    tagline: "Power, pace, and fearless intensity.",
    blurb: "Athletic and aggressive, you overwhelm opponents with raw energy and refuse to be intimidated.",
  },
  COL: {
    vec: { flair: 2, attack: 1, passion: 1.5, pedigree: 0, star: 0.5 },
    tagline: "Joy, rhythm, and football with a smile.",
    blurb: "Flamboyant and full of feeling — you dance, you dazzle, and you make the game look like fun.",
  },
  SUI: {
    vec: { flair: -1, attack: -0.5, passion: -0.5, pedigree: 0, star: -1 },
    tagline: "Tidy, organized, and quietly effective.",
    blurb: "Composed and dependable, you do the simple things well and frustrate flashier opponents.",
  },
  NOR: {
    vec: { flair: 0.5, attack: 1.5, passion: 0.5, pedigree: -0.5, star: 2 },
    tagline: "Direct, powerful, built around a superstar.",
    blurb: "You hand the ball to your talisman, go straight for the throat, and chase the spotlight.",
  },
  AUS: {
    vec: { flair: -0.5, attack: 0, passion: 1.5, pedigree: -1, star: -0.5 },
    tagline: "Battlers who out-work everyone.",
    blurb: "Gritty and relentless, you make up for the odds with work rate, unity and pure stubbornness.",
  },
  GHA: {
    vec: { flair: 1, attack: 1, passion: 1.5, pedigree: -1, star: 0 },
    tagline: "Youthful, fearless, and full of running.",
    blurb: "Energetic and bold, you play with freedom and the swagger of a team with nothing to fear.",
  },
  EGY: {
    vec: { flair: 1, attack: 0.5, passion: 1, pedigree: -0.5, star: 1.5 },
    tagline: "One magician to light up the night.",
    blurb: "You lean on your star man's brilliance and a proud, passionate fanbase behind every attack.",
  },
  TUR: {
    vec: { flair: 1, attack: 1, passion: 2, pedigree: 0, star: 0.5 },
    tagline: "Fire, noise, and fearless emotion.",
    blurb: "Hot-blooded and front-foot, you play on raw passion and an atmosphere that rattles anyone.",
  },
};

export const ELIGIBLE_TEAM_CODES = Object.keys(TEAM_PROFILES);

export function isQuizTeam(code: string): boolean {
  return code.toUpperCase() in TEAM_PROFILES;
}

function zeroVec(): Vec {
  return { flair: 0, attack: 0, passion: 0, pedigree: 0, star: 0 };
}

function cosineSimilarity(a: Vec, b: Vec): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const axis of AXES) {
    dot += a[axis] * b[axis];
    magA += a[axis] * a[axis];
    magB += b[axis] * b[axis];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export interface TeamMatch {
  code: string;
  name: string;
  flag: string;
  tagline: string;
  blurb: string;
  score: number;
}

export interface QuizResult {
  /** Best-matching team. */
  top: TeamMatch;
  /** Next closest teams (2 runners-up). */
  runnersUp: TeamMatch[];
  /** Short labels describing the player's dominant traits. */
  traits: string[];
}

function buildMatch(code: string, score: number): TeamMatch {
  const profile = TEAM_PROFILES[code];
  const team = TEAMS[code];
  return {
    code,
    name: team?.name ?? code,
    flag: team?.flag ?? getTeamFlag(code),
    tagline: profile.tagline,
    blurb: profile.blurb,
    score,
  };
}

function describeTraits(vec: Vec): string[] {
  return AXES.map((axis) => ({ axis, value: vec[axis] }))
    .filter((entry) => Math.abs(entry.value) >= 1)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3)
    .map(({ axis, value }) =>
      value > 0 ? AXIS_POLES[axis].positive : AXIS_POLES[axis].negative
    );
}

/**
 * Score a set of answers (option index per question). Returns the matched team
 * plus runners-up. Deterministic for a given set of answers.
 */
export function scoreQuiz(answers: number[]): QuizResult {
  const user = zeroVec();
  answers.forEach((optionIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex];
    const option = question?.options[optionIndex];
    if (!option) return;
    for (const axis of AXES) {
      user[axis] += option.weights[axis] ?? 0;
    }
  });

  const ranked = ELIGIBLE_TEAM_CODES.map((code) => ({
    code,
    score: cosineSimilarity(user, TEAM_PROFILES[code].vec),
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.code.localeCompare(b.code);
  });

  return {
    top: buildMatch(ranked[0].code, ranked[0].score),
    runnersUp: ranked.slice(1, 3).map((r) => buildMatch(r.code, r.score)),
    traits: describeTraits(user),
  };
}

export function getTeamMatchByCode(code: string): TeamMatch | null {
  const upper = code.toUpperCase();
  if (!isQuizTeam(upper)) return null;
  return buildMatch(upper, 1);
}
