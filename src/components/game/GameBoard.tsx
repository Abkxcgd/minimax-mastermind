import { useEffect, useRef } from "react";

import { type Board, type Cell } from "@/lib/tic-tac-toe/logic";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: Board;
  winningLine: readonly number[] | null;
  disabled: boolean;
  onSelect: (index: number) => void;
}

function Mark({ value }: { value: Cell }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "animate-mark-in select-none font-display text-5xl font-black leading-none sm:text-6xl",
        value === "X" ? "text-neon" : "text-magenta",
      )}
      style={{ textShadow: "0 0 24px currentColor" }}
    >
      {value}
    </span>
  );
}

export function GameBoard({ board, winningLine, disabled, onSelect }: GameBoardProps) {
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    cellRefs.current = cellRefs.current.slice(0, 9);
  }, []);

  /** Arrow-key navigation across the 3x3 grid for keyboard players. */
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 3,
      ArrowUp: -3,
    };
    const delta = deltas[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = (index + delta + 9) % 9;
    cellRefs.current[next]?.focus();
  };

  return (
    <div
      role="grid"
      aria-label="Tic-Tac-Toe board"
      className="grid grid-cols-3 gap-3 rounded-3xl border border-glass-border bg-glass p-3 backdrop-blur-xl sm:gap-4 sm:p-4"
    >
      {board.map((cell, index) => {
        const isWinning = winningLine?.includes(index) ?? false;
        const isOccupied = cell !== null;
        return (
          <button
            key={index}
            ref={(node) => {
              cellRefs.current[index] = node;
            }}
            type="button"
            role="gridcell"
            aria-label={`Square ${index + 1}${isOccupied ? `, ${cell}` : ", empty"}`}
            disabled={disabled || isOccupied}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => onSelect(index)}
            className={cn(
              "group relative flex aspect-square items-center justify-center rounded-2xl border border-glass-border bg-surface/70 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              !isOccupied && !disabled && "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10",
              isOccupied && "cursor-not-allowed",
              isWinning && "animate-pulse-win border-transparent bg-primary/25",
            )}
          >
            <Mark value={cell} />
          </button>
        );
      })}
    </div>
  );
}
