import type { Player, Matchup, Round } from '../types';

/**
 * Mock data for development and demonstration
 * In production, this would come from the backend API
 */

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Vinicius Jr.',
    team: 'Real Madrid',
    position: 'FW',
    avgPoints: 8.5,
    totalPoints: 170,
    matchesPlayed: 20,
    recentForm: [12, 8, 6, 10, 9],
    value: 150,
  },
  {
    id: '2',
    name: 'Lamine Yamal',
    team: 'FC Barcelona',
    position: 'FW',
    avgPoints: 8.2,
    totalPoints: 164,
    matchesPlayed: 20,
    recentForm: [9, 11, 7, 8, 10],
    value: 120,
  },
  {
    id: '3',
    name: 'Jude Bellingham',
    team: 'Real Madrid',
    position: 'MF',
    avgPoints: 7.8,
    totalPoints: 156,
    matchesPlayed: 20,
    recentForm: [8, 7, 9, 6, 8],
    value: 130,
  },
  {
    id: '4',
    name: 'Pedri',
    team: 'FC Barcelona',
    position: 'MF',
    avgPoints: 7.5,
    totalPoints: 150,
    matchesPlayed: 20,
    recentForm: [7, 8, 6, 9, 7],
    value: 90,
  },
  {
    id: '5',
    name: 'Antoine Griezmann',
    team: 'Atletico Madrid',
    position: 'FW',
    avgPoints: 7.3,
    totalPoints: 146,
    matchesPlayed: 20,
    recentForm: [6, 8, 7, 9, 5],
    value: 45,
  },
  {
    id: '6',
    name: 'Alvaro Morata',
    team: 'AC Milan',
    position: 'FW',
    avgPoints: 6.8,
    totalPoints: 136,
    matchesPlayed: 20,
    recentForm: [5, 7, 8, 6, 7],
    value: 35,
  },
  {
    id: '7',
    name: 'Rodri',
    team: 'Manchester City',
    position: 'MF',
    avgPoints: 7.9,
    totalPoints: 158,
    matchesPlayed: 20,
    recentForm: [8, 9, 7, 8, 9],
    value: 95,
  },
  {
    id: '8',
    name: 'Dani Olmo',
    team: 'FC Barcelona',
    position: 'MF',
    avgPoints: 7.1,
    totalPoints: 142,
    matchesPlayed: 20,
    recentForm: [7, 6, 8, 7, 8],
    value: 55,
  },
  {
    id: '9',
    name: 'Nico Williams',
    team: 'Athletic Club',
    position: 'FW',
    avgPoints: 7.4,
    totalPoints: 148,
    matchesPlayed: 20,
    recentForm: [8, 7, 9, 6, 8],
    value: 70,
  },
  {
    id: '10',
    name: 'Mikel Oyarzabal',
    team: 'Real Sociedad',
    position: 'FW',
    avgPoints: 6.9,
    totalPoints: 138,
    matchesPlayed: 20,
    recentForm: [6, 7, 8, 5, 9],
    value: 40,
  },
  {
    id: '11',
    name: 'Ferran Torres',
    team: 'FC Barcelona',
    position: 'FW',
    avgPoints: 6.5,
    totalPoints: 130,
    matchesPlayed: 20,
    recentForm: [5, 6, 7, 8, 6],
    value: 30,
  },
  {
    id: '12',
    name: 'Ayoze Perez',
    team: 'Villarreal',
    position: 'FW',
    avgPoints: 6.7,
    totalPoints: 134,
    matchesPlayed: 20,
    recentForm: [7, 6, 8, 5, 7],
    value: 25,
  },
  {
    id: '13',
    name: 'Federico Valverde',
    team: 'Real Madrid',
    position: 'MF',
    avgPoints: 7.6,
    totalPoints: 152,
    matchesPlayed: 20,
    recentForm: [8, 7, 6, 9, 8],
    value: 85,
  },
  {
    id: '14',
    name: 'Gavi',
    team: 'FC Barcelona',
    position: 'MF',
    avgPoints: 7.0,
    totalPoints: 140,
    matchesPlayed: 20,
    recentForm: [6, 8, 7, 7, 8],
    value: 75,
  },
  {
    id: '15',
    name: 'Marc Cucurella',
    team: 'Chelsea',
    position: 'DF',
    avgPoints: 6.3,
    totalPoints: 126,
    matchesPlayed: 20,
    recentForm: [5, 6, 7, 6, 8],
    value: 35,
  },
  {
    id: '16',
    name: 'Dani Carvajal',
    team: 'Real Madrid',
    position: 'DF',
    avgPoints: 6.8,
    totalPoints: 136,
    matchesPlayed: 20,
    recentForm: [7, 6, 8, 5, 7],
    value: 40,
  },
  {
    id: '17',
    name: 'Unai Simon',
    team: 'Athletic Club',
    position: 'GK',
    avgPoints: 6.4,
    totalPoints: 128,
    matchesPlayed: 20,
    recentForm: [6, 7, 5, 8, 6],
    value: 30,
  },
  {
    id: '18',
    name: 'David Raya',
    team: 'Arsenal',
    position: 'GK',
    avgPoints: 6.6,
    totalPoints: 132,
    matchesPlayed: 20,
    recentForm: [7, 6, 8, 5, 7],
    value: 35,
  },
  {
    id: '19',
    name: 'Robin Le Normand',
    team: 'Atletico Madrid',
    position: 'DF',
    avgPoints: 6.1,
    totalPoints: 122,
    matchesPlayed: 20,
    recentForm: [5, 7, 6, 6, 7],
    value: 25,
  },
  {
    id: '20',
    name: 'Aymeric Laporte',
    team: 'Al-Nassr',
    position: 'DF',
    avgPoints: 5.9,
    totalPoints: 118,
    matchesPlayed: 20,
    recentForm: [6, 5, 7, 5, 6],
    value: 20,
  },
  {
    id: '21',
    name: 'Fabian Ruiz',
    team: 'PSG',
    position: 'MF',
    avgPoints: 7.2,
    totalPoints: 144,
    matchesPlayed: 20,
    recentForm: [7, 8, 6, 8, 7],
    value: 50,
  },
  {
    id: '22',
    name: 'Martin Zubimendi',
    team: 'Real Sociedad',
    position: 'MF',
    avgPoints: 6.8,
    totalPoints: 136,
    matchesPlayed: 20,
    recentForm: [6, 7, 7, 6, 8],
    value: 45,
  },
];

/**
 * Generate 11 matchups for a round
 */
function generateMatchups(): Matchup[] {
  const shuffled = [...mockPlayers].sort(() => Math.random() - 0.5);
  const matchups: Matchup[] = [];

  for (let i = 0; i < 11; i++) {
    matchups.push({
      id: i + 1,
      playerA: shuffled[i * 2],
      playerB: shuffled[i * 2 + 1],
      selection: null,
    });
  }

  return matchups;
}

/** Current active round */
export const currentRound: Round = {
  id: 'j20',
  name: 'Jornada 20',
  displayName: 'Jornada 20',
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  isActive: true,
  isCompleted: false,
};

/** Mock matchups for the current round */
export const mockMatchups: Matchup[] = generateMatchups();

/** Team colors for visual styling */
export const teamColors: Record<string, { primary: string; secondary: string }> = {
  'Real Madrid': { primary: '#FFFFFF', secondary: '#00529F' },
  'FC Barcelona': { primary: '#A50044', secondary: '#004D98' },
  'Atletico Madrid': { primary: '#CB3524', secondary: '#FFFFFF' },
  'Athletic Club': { primary: '#EE2523', secondary: '#FFFFFF' },
  'Real Sociedad': { primary: '#0067B1', secondary: '#FFFFFF' },
  'Villarreal': { primary: '#FFCD00', secondary: '#005DAA' },
  'Manchester City': { primary: '#6CABDD', secondary: '#1C2C5B' },
  'Chelsea': { primary: '#034694', secondary: '#FFFFFF' },
  'Arsenal': { primary: '#EF0107', secondary: '#FFFFFF' },
  'PSG': { primary: '#004170', secondary: '#DA291C' },
  'AC Milan': { primary: '#FB090B', secondary: '#000000' },
  'Al-Nassr': { primary: '#FECC09', secondary: '#0A3D62' },
};

/** Get initials from player name */
export function getPlayerInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Format points with sign */
export function formatPoints(points: number): string {
  return points >= 0 ? `+${points}` : `${points}`;
}

/** Calculate form trend */
export function getFormTrend(recentForm: number[]): 'up' | 'down' | 'stable' {
  if (recentForm.length < 2) return 'stable';
  const recent = recentForm.slice(-3);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const older = recentForm.slice(0, -3);
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avg;

  if (avg > olderAvg + 0.5) return 'up';
  if (avg < olderAvg - 0.5) return 'down';
  return 'stable';
}
