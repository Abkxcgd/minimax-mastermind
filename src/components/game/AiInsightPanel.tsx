import { useState } from "react";

import { type Board } from "@/lib/tic-tac-toe/logic";
import { type AiDecision } from "@/lib/tic-tac-toe/minimax";

interface AiInsightPanelProps {
  board: Board;
  decision: AiDecision | null;
}

const cellToLabel = (index: number) => `R${Math.floor(index / 3) + 1}C${(index % 3) + 1}`;

export function AiInsightPanel({ board, decision }: AiInsightPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-3xl border border-glass-border bg-glass p-5 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        AI Algorithm: Minimax
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Minimax evaluates possible future moves and chooses the move that gives the AI the best
        possible outcome while assuming the opponent also plays optimally.
      </p>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-glass-border bg-surface/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        How the AI Thinks
        <span aria-hidden className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="animate-fade-in mt-4 space-y-4 text-sm">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Current board state
            </p>
            <pre className="rounded-xl border border-glass-border bg-surface/70 p-3 font-mono text-xs leading-6 text-foreground">
              {[0, 3, 6]
                .map((row) =>
                  board
                    .slice(row, row + 3)
                    .map((cell) => cell ?? "·")
                    .join(" | "),
                )
                .join("\n")}
            </pre>
          </div>

          {decision ? (
            <dl className="space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Moves considered</dt>
                <dd className="font-semibold text-foreground">{decision.movesConsidered}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Board states searched</dt>
                <dd className="font-semibold text-foreground">{decision.nodesExplored}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Selected AI move</dt>
                <dd className="font-semibold text-magenta">
                  {decision.move >= 0 ? cellToLabel(decision.move) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Strategy</dt>
                <dd className="font-semibold text-foreground capitalize">{decision.strategy}</dd>
              </div>
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                {decision.reason}
              </p>
            </dl>
          ) : (
            <p className="rounded-xl border border-dashed border-glass-border p-4 text-center text-xs text-muted-foreground">
              No AI move yet — play a square and the search details will appear here.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
