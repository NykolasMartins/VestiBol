/**
 * VestiBoL — Game Context
 * Contexto global para compartilhar estado do jogo entre componentes
 */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  GameState,
  Subject,
  TeamSlot,
  Representative,
  REPRESENTATIVES,
  loadGameState,
  saveGameState,
  resetGameState,
  generateCupMatches,
  simulateMatch,
  calculateTeamRating,
} from '@/lib/gameStore';

interface GameContextType {
  state: GameState;
  teamRepresentatives: TeamSlot[];
  isTeamReady: boolean;
  teamRating: number;
  accuracy: number;
  nextMatch: GameState['cupMatches'][0] | null;
  cupWon: boolean;
  cupLostAt: GameState['cupMatches'][0] | null;
  isSubjectCompleted: (subject: Subject) => boolean;
  goToTeamSelection: () => void;
  goToTeamView: () => void;
  goToHome: () => void;
  startQuiz: (subject: Subject) => void;
  completeQuiz: (subject: Subject, correctAnswers: number) => void;
  startCup: () => void;
  playNextMatch: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadGameState());

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      const next = updater(prev);
      saveGameState(next);
      return next;
    });
  }, []);

  const goToTeamSelection = useCallback(() => {
    updateState(s => ({ ...s, phase: 'team-selection' }));
  }, [updateState]);

  const goToTeamView = useCallback(() => {
    updateState(s => ({ ...s, phase: 'team-view' }));
  }, [updateState]);

  const goToHome = useCallback(() => {
    updateState(s => ({ ...s, phase: 'home' }));
  }, [updateState]);

  const startQuiz = useCallback((subject: Subject) => {
    updateState(s => ({ ...s, phase: 'quiz', currentQuizSubject: subject }));
  }, [updateState]);

  const completeQuiz = useCallback((subject: Subject, correctAnswers: number) => {
    updateState(s => {
      const reps = REPRESENTATIVES[subject];
      let representative: Representative | null = null;
      if (correctAnswers >= 3) representative = reps[0];
      else if (correctAnswers === 2) representative = reps[1];
      else if (correctAnswers === 1) representative = reps[2];

      const existingIndex = s.teamSlots.findIndex(slot => slot.subject === subject);
      const newSlot: TeamSlot = { subject, representative, correctAnswers, completed: true };

      let newSlots: TeamSlot[];
      if (existingIndex >= 0) {
        newSlots = [...s.teamSlots];
        newSlots[existingIndex] = newSlot;
      } else {
        newSlots = [...s.teamSlots, newSlot];
      }

      return {
        ...s,
        phase: 'team-view',
        currentQuizSubject: null,
        teamSlots: newSlots,
        totalCorrect: s.totalCorrect + correctAnswers,
        totalAnswered: s.totalAnswered + 3,
      };
    });
  }, [updateState]);

  const startCup = useCallback(() => {
    updateState(s => {
      const rating = calculateTeamRating(s.teamSlots);
      const accuracy = s.totalAnswered > 0 ? s.totalCorrect / s.totalAnswered : 0;
      const matches = generateCupMatches(rating, accuracy);
      return { ...s, phase: 'cup', cupMatches: matches, cupStarted: true };
    });
  }, [updateState]);

  const playNextMatch = useCallback(() => {
    updateState(s => {
      const nextMatchIndex = s.cupMatches.findIndex(m => !m.played);
      if (nextMatchIndex === -1) return s;

      const match = s.cupMatches[nextMatchIndex];
      const teamRating = calculateTeamRating(s.teamSlots);
      const accuracy = s.totalAnswered > 0 ? s.totalCorrect / s.totalAnswered : 0;
      const { userScore, opponentScore } = simulateMatch(teamRating, match.opponent.rating, accuracy);
      const won = userScore > opponentScore ? true : userScore === opponentScore ? null : false;

      const newMatches = [...s.cupMatches];
      newMatches[nextMatchIndex] = { ...match, userScore, opponentScore, played: true, won };

      const allPlayed = newMatches.every(m => m.played);
      const lostMatch = won === false;

      return {
        ...s,
        cupMatches: newMatches,
        phase: (allPlayed || lostMatch) ? 'cup-result' : 'cup',
      };
    });
  }, [updateState]);

  const resetGame = useCallback(() => {
    const fresh = resetGameState();
    setState(fresh);
  }, []);

  const isSubjectCompleted = useCallback((subject: Subject) => {
    return state.teamSlots.some(s => s.subject === subject && s.completed);
  }, [state.teamSlots]);

  const teamRepresentatives = state.teamSlots.filter(s => s.representative !== null);
  const isTeamReady = teamRepresentatives.length >= 5;
  const teamRating = calculateTeamRating(state.teamSlots);
  const accuracy = state.totalAnswered > 0
    ? Math.round((state.totalCorrect / state.totalAnswered) * 100)
    : 0;
  const nextMatch = state.cupMatches.find(m => !m.played) ?? null;
  const cupWon = state.cupMatches.length > 0 && state.cupMatches.every(m => m.played && m.won !== false);
  const cupLostAt = state.cupMatches.find(m => m.played && m.won === false) ?? null;

  return (
    <GameContext.Provider value={{
      state,
      teamRepresentatives,
      isTeamReady,
      teamRating,
      accuracy,
      nextMatch,
      cupWon,
      cupLostAt,
      isSubjectCompleted,
      goToTeamSelection,
      goToTeamView,
      goToHome,
      startQuiz,
      completeQuiz,
      startCup,
      playNextMatch,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
