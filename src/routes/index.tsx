import { createFileRoute } from "@tanstack/react-router";

import { AiInsightPanel } from "@/components/game/AiInsightPanel";
import { GameBoard } from "@/components/game/GameBoard";
import { GameInfoPanel } from "@/components/game/GameInfoPanel";
import { useTicTacToe } from "@/hooks/useTicTacToe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tic-Tac-Toe AI — Challenge the Minimax Algorithm" },
      {
        name: "description",
        content:
          "Play Tic-Tac-Toe against an unbeatable Minimax AI with Easy, Medium and Hard modes, live score tracking and a look inside how the AI thinks.",
      },
      { property: "og:title", content: "Tic-Tac-Toe AI — Challenge the Minimax Algorithm" },
      {
        property: "og:description",
        content:
          "An AI internship project: React + TypeScript Tic-Tac-Toe powered by the Minimax algorithm with alpha-beta pruning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const game = useTicTacToe();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:px-6 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-magenta/20 blur-[130px]" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-primary font-display text-2xl font-black text-primary-foreground shadow-glow">
            ✕○
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-black tracking-tight text-foreground sm:text-4xl">
              Tic-Tac-Toe AI
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              Challenge the Minimax Algorithm
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-6">
            <GameBoard
              board={game.board}
              winningLine={game.outcome.line}
              disabled={game.isAiTurn || game.outcome.isOver}
              onSelect={game.playerMove}
            />
            <p className="text-center text-xs text-muted-foreground">
              Tip: use Tab and the arrow keys to move around the board, Enter to place your X.
            </p>
          </div>

          <div className="space-y-6">
            <GameInfoPanel
              status={game.status}
              isAiTurn={game.isAiTurn}
              isOver={game.outcome.isOver}
              scores={game.scores}
              difficulty={game.difficulty}
              soundEnabled={game.soundEnabled}
              onDifficultyChange={game.changeDifficulty}
              onNewGame={game.newGame}
              onResetScores={game.resetScores}
              onToggleSound={game.toggleSound}
            />
            <AiInsightPanel board={game.board} decision={game.lastDecision} />
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Internship Task: Tic-Tac-Toe with Simple AI · AI Technique: Minimax Algorithm
        </footer>
      </div>
    </main>
  );
}
