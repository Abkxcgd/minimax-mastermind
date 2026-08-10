import { type Scoreboard } from "@/hooks/useTicTacToe";
import { DIFFICULTY_HINTS, DIFFICULTY_LABELS, type Difficulty } from "@/lib/tic-tac-toe/minimax";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  status: string;
  isAiTurn: boolean;
  isOver: boolean;
  scores: Scoreboard;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onResetScores: () => void;
  onToggleSound: () => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-surface/60 p-3 text-center">
      <p className={cn("font-display text-2xl font-black", accent)}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

export function GameInfoPanel({
  status,
  isAiTurn,
  isOver,
  scores,
  difficulty,
  soundEnabled,
  onDifficultyChange,
  onNewGame,
  onResetScores,
  onToggleSound,
}: InfoPanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-glass-border bg-glass p-5 backdrop-blur-xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Status</p>
          <p className="truncate font-display text-lg font-bold text-foreground">{status}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            isOver
              ? "bg-muted text-muted-foreground"
              : isAiTurn
                ? "bg-magenta/15 text-magenta"
                : "bg-neon/15 text-neon",
          )}
        >
          {isOver ? "Round over" : isAiTurn ? "AI — O" : "You — X"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-neon/25 bg-neon/10 p-3">
          <p className="text-xs text-muted-foreground">Player</p>
          <p className="font-display text-xl font-black text-neon">X</p>
        </div>
        <div className="rounded-2xl border border-magenta/25 bg-magenta/10 p-3">
          <p className="text-xs text-muted-foreground">AI</p>
          <p className="font-display text-xl font-black text-magenta">O</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="You" value={scores.player} accent="text-neon" />
        <Stat label="AI" value={scores.ai} accent="text-magenta" />
        <Stat label="Draws" value={scores.draws} accent="text-foreground" />
      </div>

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          Difficulty
        </p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Change difficulty">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={difficulty === level}
              onClick={() => onDifficultyChange(level)}
              className={cn(
                "rounded-xl border px-2 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                difficulty === level
                  ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-glass-border bg-surface/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {DIFFICULTY_LABELS[level]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{DIFFICULTY_HINTS[difficulty]}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onNewGame}
          className="flex-1 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          New Game
        </button>
        <button
          type="button"
          onClick={onResetScores}
          className="flex-1 rounded-xl border border-glass-border bg-surface/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset Score
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          className="rounded-xl border border-glass-border bg-surface/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </div>
    </section>
  );
}
