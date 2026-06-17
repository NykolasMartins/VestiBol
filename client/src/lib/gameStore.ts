/**
 * VestiBoL — Game Store
 * Gerencia o estado do jogo usando localStorage para persistência.
 * Sem backend necessário — tudo no cliente.
 */

export type Discipline = 
  | 'linguagens'
  | 'matematica'
  | 'ciencias-humanas'
  | 'ciencias-natureza';

export type Subject = 
  | 'Literatura'
  | 'Redação'
  | 'Inglês'
  | 'Matemática'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'História'
  | 'Geografia';

// Mapeamento de matéria → disciplina da API
export const SUBJECT_TO_DISCIPLINE: Record<Subject, Discipline> = {
  'Literatura': 'linguagens',
  'Redação': 'linguagens',
  'Inglês': 'linguagens',
  'Matemática': 'matematica',
  'Física': 'ciencias-natureza',
  'Química': 'ciencias-natureza',
  'Biologia': 'ciencias-natureza',
  'História': 'ciencias-humanas',
  'Geografia': 'ciencias-humanas',
};

export interface Representative {
  name: string;
  emoji: string;
  description: string;
  minCorrect: number; // mínimo de acertos para desbloquear
  rating: number;     // força do representante (1-100)
}

// Representantes por matéria (3 por matéria + vazio para 0 acertos)
export const REPRESENTATIVES: Record<Subject, [Representative, Representative, Representative]> = {
  'Literatura': [
    { name: 'Machado de Assis', emoji: '📖', description: 'Maior escritor brasileiro, mestre do realismo', minCorrect: 3, rating: 95 },
    { name: 'Clarice Lispector', emoji: '✍️', description: 'Escritora inovadora do modernismo brasileiro', minCorrect: 2, rating: 78 },
    { name: 'José de Alencar', emoji: '📜', description: 'Fundador do romantismo brasileiro', minCorrect: 1, rating: 60 },
  ],
  'Redação': [
    { name: 'Rui Barbosa', emoji: '🖊️', description: 'A Águia de Haia, mestre da eloquência', minCorrect: 3, rating: 93 },
    { name: 'Euclides da Cunha', emoji: '📝', description: 'Autor de Os Sertões, jornalista e escritor', minCorrect: 2, rating: 76 },
    { name: 'Lima Barreto', emoji: '📰', description: 'Escritor e jornalista crítico da Belle Époque', minCorrect: 1, rating: 58 },
  ],
  'Inglês': [
    { name: 'William Shakespeare', emoji: '🎭', description: 'O maior dramaturgo da língua inglesa', minCorrect: 3, rating: 97 },
    { name: 'Charles Dickens', emoji: '📚', description: 'Mestre do romance vitoriano inglês', minCorrect: 2, rating: 80 },
    { name: 'George Orwell', emoji: '🔍', description: 'Autor de 1984 e A Revolução dos Bichos', minCorrect: 1, rating: 62 },
  ],
  'Matemática': [
    { name: 'Pitágoras', emoji: '📐', description: 'Pai da geometria e dos números', minCorrect: 3, rating: 99 },
    { name: 'Arquimedes', emoji: '⚙️', description: 'Gênio da física e matemática antiga', minCorrect: 2, rating: 85 },
    { name: 'Euclides', emoji: '📏', description: 'Fundador da geometria euclidiana', minCorrect: 1, rating: 65 },
  ],
  'Física': [
    { name: 'Isaac Newton', emoji: '🍎', description: 'Descobridor da gravidade e das leis do movimento', minCorrect: 3, rating: 98 },
    { name: 'Albert Einstein', emoji: '⚡', description: 'Autor da Teoria da Relatividade', minCorrect: 2, rating: 90 },
    { name: 'Galileu Galilei', emoji: '🔭', description: 'Pai da física moderna e da astronomia', minCorrect: 1, rating: 70 },
  ],
  'Química': [
    { name: 'Marie Curie', emoji: '⚗️', description: 'Pioneira da radioatividade, dupla Nobel', minCorrect: 3, rating: 96 },
    { name: 'Dmitri Mendeleev', emoji: '🧪', description: 'Criador da Tabela Periódica dos Elementos', minCorrect: 2, rating: 82 },
    { name: 'Antoine Lavoisier', emoji: '🔬', description: 'Pai da química moderna', minCorrect: 1, rating: 63 },
  ],
  'Biologia': [
    { name: 'Charles Darwin', emoji: '🦋', description: 'Autor da Teoria da Evolução das Espécies', minCorrect: 3, rating: 97 },
    { name: 'Gregor Mendel', emoji: '🌱', description: 'Pai da genética moderna', minCorrect: 2, rating: 83 },
    { name: 'Louis Pasteur', emoji: '🦠', description: 'Pai da microbiologia e da pasteurização', minCorrect: 1, rating: 64 },
  ],
  'História': [
    { name: 'Simón Bolívar', emoji: '⚔️', description: 'O Libertador da América do Sul', minCorrect: 3, rating: 94 },
    { name: 'Tiradentes', emoji: '🗡️', description: 'Mártir da Inconfidência Mineira', minCorrect: 2, rating: 77 },
    { name: 'Napoleão Bonaparte', emoji: '👑', description: 'Imperador que redefiniu a Europa', minCorrect: 1, rating: 59 },
  ],
  'Geografia': [
    { name: 'Alexander von Humboldt', emoji: '🌍', description: 'Pai da geografia moderna e explorador', minCorrect: 3, rating: 92 },
    { name: 'Vasco da Gama', emoji: '⛵', description: 'Navegador que abriu a rota para as Índias', minCorrect: 2, rating: 75 },
    { name: 'Cristóvão Colombo', emoji: '🧭', description: 'Navegador que chegou à América', minCorrect: 1, rating: 57 },
  ],
};

export interface TeamSlot {
  subject: Subject;
  representative: Representative | null;
  correctAnswers: number;
  completed: boolean;
}

export interface CupMatch {
  round: 'Fase de Grupos' | 'Oitavas' | 'Quartas' | 'Semifinal' | 'Final';
  opponent: OpponentTeam;
  userScore: number;
  opponentScore: number;
  played: boolean;
  won: boolean | null;
}

export interface OpponentTeam {
  name: string;
  emoji: string;
  rating: number;
  players: { name: string; emoji: string }[];
}

export const OPPONENT_TEAMS: OpponentTeam[] = [
  {
    name: 'Os Iluministas',
    emoji: '💡',
    rating: 55,
    players: [
      { name: 'Voltaire', emoji: '📖' },
      { name: 'Rousseau', emoji: '🌿' },
      { name: 'Montesquieu', emoji: '⚖️' },
      { name: 'Locke', emoji: '📜' },
      { name: 'Diderot', emoji: '✍️' },
    ],
  },
  {
    name: 'Os Renascentistas',
    emoji: '🎨',
    rating: 65,
    players: [
      { name: 'Leonardo da Vinci', emoji: '🎨' },
      { name: 'Michelangelo', emoji: '🗿' },
      { name: 'Rafael Sanzio', emoji: '🖌️' },
      { name: 'Copérnico', emoji: '🌍' },
      { name: 'Erasmo de Roterdã', emoji: '📚' },
    ],
  },
  {
    name: 'Os Filósofos',
    emoji: '🏛️',
    rating: 72,
    players: [
      { name: 'Sócrates', emoji: '🏛️' },
      { name: 'Platão', emoji: '📐' },
      { name: 'Aristóteles', emoji: '🦉' },
      { name: 'Heráclito', emoji: '🔥' },
      { name: 'Pitágoras', emoji: '📏' },
    ],
  },
  {
    name: 'Os Revolucionários',
    emoji: '✊',
    rating: 80,
    players: [
      { name: 'Karl Marx', emoji: '✊' },
      { name: 'Friedrich Engels', emoji: '📢' },
      { name: 'Che Guevara', emoji: '⭐' },
      { name: 'Robespierre', emoji: '🗡️' },
      { name: 'Lênin', emoji: '🔴' },
    ],
  },
  {
    name: 'Os Gênios Modernos',
    emoji: '🚀',
    rating: 90,
    players: [
      { name: 'Einstein', emoji: '⚡' },
      { name: 'Tesla', emoji: '⚡' },
      { name: 'Curie', emoji: '⚗️' },
      { name: 'Turing', emoji: '💻' },
      { name: 'Hawking', emoji: '🌌' },
    ],
  },
];

export interface GameState {
  phase: 'home' | 'team-selection' | 'quiz' | 'team-view' | 'cup' | 'cup-result';
  teamSlots: TeamSlot[];
  currentQuizSubject: Subject | null;
  cupMatches: CupMatch[];
  cupStarted: boolean;
  totalCorrect: number;
  totalAnswered: number;
}

const STORAGE_KEY = 'vestibol_game_state';

export function getInitialState(): GameState {
  return {
    phase: 'home',
    teamSlots: [],
    currentQuizSubject: null,
    cupMatches: [],
    cupStarted: false,
    totalCorrect: 0,
    totalAnswered: 0,
  };
}

export function loadGameState(): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load game state', e);
  }
  return getInitialState();
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state', e);
  }
}

export function resetGameState(): GameState {
  const fresh = getInitialState();
  saveGameState(fresh);
  return fresh;
}

// Calcula o rating médio do time do jogador
export function calculateTeamRating(slots: TeamSlot[]): number {
  const filled = slots.filter(s => s.representative !== null);
  if (filled.length === 0) return 0;
  const total = filled.reduce((sum, s) => sum + (s.representative?.rating ?? 0), 0);
  return Math.round(total / filled.length);
}

// Simula um jogo da copa
export function simulateMatch(
  userRating: number,
  opponentRating: number,
  userAccuracy: number // 0-1
): { userScore: number; opponentScore: number } {
  // Base scores com fator de aleatoriedade
  const ratingFactor = userRating / (userRating + opponentRating);
  const accuracyBonus = userAccuracy * 0.3;
  const userStrength = ratingFactor + accuracyBonus;

  // Gera placar baseado na força relativa
  const maxGoals = 5;
  let userScore = 0;
  let opponentScore = 0;

  for (let i = 0; i < maxGoals * 2; i++) {
    const rand = Math.random();
    if (rand < userStrength * 0.6) {
      userScore++;
    } else if (rand < userStrength * 0.6 + (1 - userStrength) * 0.5) {
      opponentScore++;
    }
  }

  // Cap scores
  userScore = Math.min(userScore, 7);
  opponentScore = Math.min(opponentScore, 7);

  return { userScore, opponentScore };
}

// Gera os jogos da copa (5 jogos: grupos, oitavas, quartas, semi, final)
export function generateCupMatches(teamRating: number, accuracy: number): CupMatch[] {
  const rounds: CupMatch['round'][] = [
    'Fase de Grupos',
    'Oitavas',
    'Quartas',
    'Semifinal',
    'Final',
  ];

  // Seleciona 5 adversários com dificuldade crescente
  const opponents = [...OPPONENT_TEAMS].sort((a, b) => a.rating - b.rating);

  return rounds.map((round, i) => ({
    round,
    opponent: opponents[i],
    userScore: 0,
    opponentScore: 0,
    played: false,
    won: null,
  }));
}
