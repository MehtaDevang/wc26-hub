export interface TeamColors {
  primary: string;
  secondary: string;
  accent: string;
}
export const TEAM_COLORS: Record<string, TeamColors> = {
  MEX: { primary: "#006847", secondary: "#CE1126", accent: "#FFFFFF" },
  RSA: { primary: "#007A4D", secondary: "#FFB81C", accent: "#E03C31" },
  KOR: { primary: "#C60C30", secondary: "#003478", accent: "#FFFFFF" },
  CZE: { primary: "#11457E", secondary: "#D7141A", accent: "#FFFFFF" },
  CAN: { primary: "#D80621", secondary: "#FFFFFF", accent: "#002868" },
  BIH: { primary: "#002395", secondary: "#FECB00", accent: "#FFFFFF" },
  QAT: { primary: "#8A1538", secondary: "#FFFFFF", accent: "#5C0A24" },
  SUI: { primary: "#D52B1E", secondary: "#FFFFFF", accent: "#1C1C1C" },
  BRA: { primary: "#009C3B", secondary: "#FFDF00", accent: "#002776" },
  MAR: { primary: "#C1272D", secondary: "#006233", accent: "#FFFFFF" },
  HAI: { primary: "#00209F", secondary: "#D21034", accent: "#FFFFFF" },
  SCO: { primary: "#005EB8", secondary: "#FFFFFF", accent: "#1C1C1C" },
  USA: { primary: "#002868", secondary: "#BF0A30", accent: "#FFFFFF" },
  PAR: { primary: "#D52B1E", secondary: "#0038A8", accent: "#FFFFFF" },
  AUS: { primary: "#FFCD00", secondary: "#00843D", accent: "#0052B4" },
  TUR: { primary: "#E30A17", secondary: "#FFFFFF", accent: "#1C1C1C" },
  GER: { primary: "#000000", secondary: "#DD0000", accent: "#FFCE00" },
  CUW: { primary: "#002B7F", secondary: "#F9E814", accent: "#FFFFFF" },
  CIV: { primary: "#F77F00", secondary: "#009E60", accent: "#FFFFFF" },
  ECU: { primary: "#FFD100", secondary: "#034EA2", accent: "#ED1C24" },
  NED: { primary: "#FF6600", secondary: "#21468B", accent: "#FFFFFF" },
  JPN: { primary: "#BC002D", secondary: "#FFFFFF", accent: "#1C1C1C" },
  TUN: { primary: "#E70013", secondary: "#FFFFFF", accent: "#1C1C1C" },
  SWE: { primary: "#006AA7", secondary: "#FECC00", accent: "#FFFFFF" },
  BEL: { primary: "#EF3340", secondary: "#FAE042", accent: "#1C1C1C" },
  EGY: { primary: "#CE1126", secondary: "#FFFFFF", accent: "#000000" },
  IRN: { primary: "#239F40", secondary: "#FFFFFF", accent: "#DA0000" },
  NZL: { primary: "#000000", secondary: "#FFFFFF", accent: "#5B9BD5" },
  ESP: { primary: "#AA151B", secondary: "#F1BF00", accent: "#1C1C1C" },
  CPV: { primary: "#003893", secondary: "#FFFFFF", accent: "#CF2027" },
  KSA: { primary: "#006C35", secondary: "#FFFFFF", accent: "#1C1C1C" },
  URU: { primary: "#55B7E8", secondary: "#FFFFFF", accent: "#1C1C1C" },
  FRA: { primary: "#002395", secondary: "#ED2939", accent: "#FFFFFF" },
  SEN: { primary: "#00853F", secondary: "#FDEF42", accent: "#E31B23" },
  IRQ: { primary: "#CE1126", secondary: "#FFFFFF", accent: "#007A3D" },
  NOR: { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF" },
  ARG: { primary: "#74ACDF", secondary: "#FFFFFF", accent: "#F6B40E" },
  ALG: { primary: "#FFFFFF", secondary: "#006233", accent: "#D21034" },
  AUT: { primary: "#ED2939", secondary: "#FFFFFF", accent: "#1C1C1C" },
  JOR: { primary: "#007A3D", secondary: "#FFFFFF", accent: "#CE1126" },
  POR: { primary: "#006600", secondary: "#FF0000", accent: "#FFD700" },
  COD: { primary: "#007FFF", secondary: "#F7D618", accent: "#CE1126" },
  UZB: { primary: "#1EB53A", secondary: "#FFFFFF", accent: "#0099B5" },
  COL: { primary: "#FCD116", secondary: "#003893", accent: "#CE1126" },
  ENG: { primary: "#FFFFFF", secondary: "#CE1124", accent: "#00247D" },
  CRO: { primary: "#FF0000", secondary: "#FFFFFF", accent: "#171796" },
  GHA: { primary: "#CE1126", secondary: "#FCD116", accent: "#006B3F" },
  PAN: { primary: "#DA121A", secondary: "#072357", accent: "#FFFFFF" },
};

const DEFAULT_COLORS: TeamColors = {
  primary: "#1e3a5f",
  secondary: "#64748b",
  accent: "#ffffff",
};

export function getTeamColors(code: string): TeamColors {
  return TEAM_COLORS[code.toUpperCase()] ?? DEFAULT_COLORS;
}

export function teamColorStyle(code: string): Record<string, string> {
  const colors = getTeamColors(code);
  return {
    "--team-primary": colors.primary,
    "--team-secondary": colors.secondary,
    "--team-accent": colors.accent,
  };
}
