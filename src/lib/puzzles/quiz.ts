import { pickDailySet, getTodayKey, PUZZLES_PER_DAY } from "./daily";

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Brazil", "Italy", "Argentina"],
    correctIndex: 1,
    explanation: "Brazil have won 5 World Cups (1958, 1962, 1970, 1994, 2002).",
  },
  {
    question: "Who scored the 'Hand of God' goal?",
    options: ["Pelé", "Diego Maradona", "Lionel Messi", "Gabriel Batistuta"],
    correctIndex: 1,
    explanation: "Maradona scored it against England at Mexico 1986.",
  },
  {
    question: "How many teams compete in the 2026 World Cup?",
    options: ["32", "36", "48", "64"],
    correctIndex: 2,
    explanation: "2026 expands to 48 teams across 12 groups of 4.",
  },
  {
    question: "Which three countries host World Cup 2026?",
    options: ["USA, Mexico, Brazil", "USA, Mexico, Canada", "USA, Canada, Cuba", "Mexico, Canada, Costa Rica"],
    correctIndex: 1,
    explanation: "The tournament is jointly hosted by USA, Mexico, and Canada.",
  },
  {
    question: "Who won the Golden Boot at Russia 2018?",
    options: ["Cristiano Ronaldo", "Harry Kane", "Kylian Mbappé", "Antoine Griezmann"],
    correctIndex: 1,
    explanation: "Harry Kane scored 6 goals for England.",
  },
  {
    question: "Which nation won the 2022 World Cup in Qatar?",
    options: ["France", "Croatia", "Argentina", "Brazil"],
    correctIndex: 2,
    explanation: "Argentina beat France on penalties in the final.",
  },
  {
    question: "What is the only country to appear in every World Cup?",
    options: ["Germany", "Brazil", "Argentina", "Uruguay"],
    correctIndex: 1,
    explanation: "Brazil have qualified for all 22 tournaments.",
  },
  {
    question: "Who is the all-time World Cup top scorer?",
    options: ["Ronaldo Nazário", "Miroslav Klose", "Gerd Müller", "Just Fontaine"],
    correctIndex: 1,
    explanation: "Klose scored 16 goals across four tournaments.",
  },
  {
    question: "Which city hosts the 2026 final at MetLife Stadium?",
    options: ["Los Angeles", "New York / New Jersey", "Miami", "Dallas"],
    correctIndex: 1,
    explanation: "MetLife Stadium is in East Rutherford, New Jersey.",
  },
  {
    question: "What does FIFA stand for?",
    options: ["Football International Federation Association", "Fédération Internationale de Football Association", "Federal International Football Authority", "Football Institute of Federation Affairs"],
    correctIndex: 1,
    explanation: "FIFA is French for International Federation of Association Football.",
  },
  {
    question: "Which African nation reached the 2022 World Cup semifinals?",
    options: ["Senegal", "Ghana", "Morocco", "Nigeria"],
    correctIndex: 2,
    explanation: "Morocco became the first African team in a World Cup semifinal.",
  },
  {
    question: "Who managed England to their 1966 World Cup win?",
    options: ["Bobby Charlton", "Alf Ramsey", "Don Revie", "Bobby Robson"],
    correctIndex: 1,
    explanation: "Sir Alf Ramsey led England to their only World Cup title.",
  },
  {
    question: "The offside rule requires a player to have fewer than how many opponents between them and the goal line?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 1,
    explanation: "A player is offside if only one opponent (usually the keeper) is behind them.",
  },
  {
    question: "Which country won the first World Cup in 1930?",
    options: ["Brazil", "Italy", "Uruguay", "Argentina"],
    correctIndex: 2,
    explanation: "Uruguay hosted and won the inaugural tournament.",
  },
  {
    question: "How long is a standard football match (excluding stoppage time)?",
    options: ["80 minutes", "90 minutes", "100 minutes", "120 minutes"],
    correctIndex: 1,
    explanation: "Two halves of 45 minutes each.",
  },
  {
    question: "Which player has won the most Ballon d'Or awards?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Michel Platini", "Johan Cruyff"],
    correctIndex: 1,
    explanation: "Messi has won 8 Ballon d'Or trophies.",
  },
  {
    question: "What colour card sends a player off the pitch?",
    options: ["Yellow", "Blue", "Red", "Green"],
    correctIndex: 2,
    explanation: "A red card means immediate dismissal.",
  },
  {
    question: "Which European nation won Euro 2024?",
    options: ["England", "Spain", "Germany", "France"],
    correctIndex: 1,
    explanation: "Spain beat England 2-1 in the Berlin final.",
  },
  {
    question: "How many players are on the pitch per team during normal play?",
    options: ["9", "10", "11", "12"],
    correctIndex: 2,
    explanation: "Each team fields 11 players including the goalkeeper.",
  },
  {
    question: "Which stadium is known as the Azteca?",
    options: ["Estadio BBVA", "Estadio Akron", "Estadio Azteca", "BC Place"],
    correctIndex: 2,
    explanation: "Estadio Azteca in Mexico City hosted two World Cup finals.",
  },
  {
    question: "Who scored the fastest hat-trick in World Cup history (7 minutes)?",
    options: ["Pelé", "Geoff Hurst", "László Kiss", "Miroslav Klose"],
    correctIndex: 2,
    explanation: "Hungary's László Kiss scored three against El Salvador in 1982.",
  },
  {
    question: "VAR stands for…",
    options: ["Video Assistant Referee", "Virtual Action Review", "Verified Automatic Ruling", "Video Analysis Replay"],
    correctIndex: 0,
    explanation: "VAR helps referees review key decisions using video.",
  },
  {
    question: "Which country did Zinedine Zidane represent?",
    options: ["Algeria", "France", "Morocco", "Tunisia"],
    correctIndex: 1,
    explanation: "Zidane won the 1998 World Cup with France and scored twice in the final.",
  },
  {
    question: "The World Cup trophy awarded since 1974 is made of…",
    options: ["Silver", "18-carat gold", "Bronze", "Platinum"],
    correctIndex: 1,
    explanation: "The current trophy is 18-carat gold and weighs about 6.1 kg.",
  },
  {
    question: "Which CONCACAF nation has the most World Cup appearances?",
    options: ["Canada", "Costa Rica", "Mexico", "USA"],
    correctIndex: 2,
    explanation: "Mexico have appeared in 18 World Cups.",
  },
  {
    question: "A penalty kick is taken from how many yards/metres from goal?",
    options: ["8 yards (7.3m)", "10 yards (9.1m)", "12 yards (11m)", "15 yards (13.7m)",
    ],
    correctIndex: 2,
    explanation: "The penalty spot is 12 yards (11 metres) from the goal line.",
  },
  {
    question: "Who is known as 'El Pibe de Oro' (The Golden Boy)?",
    options: ["Lionel Messi", "Diego Maradona", "Pelé", "Ronaldinho"],
    correctIndex: 1,
    explanation: "Maradona earned the nickname during his legendary career.",
  },
  {
    question: "How many substitutions are typically allowed in a World Cup match (2022 rules)?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Teams may use up to 5 substitutes from a bench of up to 15.",
  },
  {
    question: "Which nation knocked Brazil out of the 2014 World Cup with a 7-1 semifinal win?",
    options: ["Argentina", "Netherlands", "Germany", "France"],
    correctIndex: 2,
    explanation: "Germany's 7-1 win in Belo Horizonte shocked the football world.",
  },
  {
    question: "The 2026 World Cup group stage has how many groups?",
    options: ["8", "10", "12", "16"],
    correctIndex: 2,
    explanation: "48 teams are split into 12 groups of 4.",
  },
];

export function getDailyQuizzes(date = new Date()) {
  const today = getTodayKey(date);
  const questions = pickDailySet(QUIZ_QUESTIONS, PUZZLES_PER_DAY, date, 2);
  return { questions, date: today };
}

export function checkQuizAnswer(selectedIndex: number, correctIndex: number): boolean {
  return selectedIndex === correctIndex;
}
