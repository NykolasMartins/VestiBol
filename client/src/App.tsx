/**
 * VestiBoL — App.tsx
 * Roteamento baseado no estado do jogo (sem URLs)
 * Design: Academia Olímpica — Azul Real + Dourado
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import Home from "./pages/Home";
import SubjectSelection from "./pages/SubjectSelection";
import Quiz from "./pages/Quiz";
import TeamView from "./pages/TeamView";
import Cup from "./pages/Cup";

// Router baseado no estado do jogo (não em URLs)
function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'home':
      return <Home />;
    case 'team-selection':
      return <SubjectSelection />;
    case 'quiz':
      return <Quiz />;
    case 'team-view':
      return <TeamView />;
    case 'cup':
      return <Cup />;
    case 'cup-result':
      return <Cup />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <GameProvider>
            <GameRouter />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
