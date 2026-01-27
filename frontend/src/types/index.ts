/**
 * Core types for Quini Fantasy application
 */

/** Player position in football */
export type Position = 'GK' | 'DF' | 'MF' | 'FW';

/** Player information */
export interface Player {
  id: number | string;
  name: string;
  team: string;
  teamLogo?: string;
  position: Position;
  photo?: string;
  /** Average fantasy points this season */
  avgPoints: number;
  /** Total fantasy points this season */
  totalPoints?: number;
  /** Number of matches played */
  matchesPlayed?: number;
  /** Recent form - last 5 matches points */
  recentForm?: number[];
  /** Player value in millions */
  value?: number;
}

/** A single matchup between two players */
export interface Matchup {
  id: number;
  playerA: Player;
  playerB: Player;
  /** User's selection: 'A', 'B', or null if not selected */
  selection: 'A' | 'B' | null;
}

/** User's complete prediction for a round */
export interface Prediction {
  id: string;
  roundId: string;
  matchups: Matchup[];
  /** Timestamp when prediction was submitted */
  submittedAt?: Date;
  /** Whether prediction is locked (after deadline) */
  isLocked: boolean;
}

/** Game round/jornada */
export interface Round {
  id: string;
  name: string;
  /** e.g., "Jornada 20" */
  displayName: string;
  /** Deadline for predictions */
  deadline: Date;
  /** Whether round is currently active for predictions */
  isActive: boolean;
  /** Whether round has been completed */
  isCompleted: boolean;
}

/** Result of a completed matchup */
export interface MatchupResult {
  matchupId: number;
  playerAPoints: number;
  playerBPoints: number;
  /** Who won: 'A', 'B', or 'tie' */
  winner: 'A' | 'B' | 'tie';
}

/** User's results for a completed round */
export interface RoundResult {
  roundId: string;
  userId: string;
  correctPredictions: number;
  totalPredictions: number;
  points: number;
  matchupResults: MatchupResult[];
}

/** Leaderboard entry */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  totalPoints: number;
  correctPredictions: number;
  totalPredictions: number;
  /** Win rate percentage */
  winRate: number;
}

/** Animation variants for framer-motion */
export type AnimationVariant = 'initial' | 'animate' | 'exit';

/** Selection state for a matchup */
export type SelectionState = 'unselected' | 'playerA' | 'playerB';
