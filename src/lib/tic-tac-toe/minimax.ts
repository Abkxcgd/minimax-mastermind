/**
 * Minimax AI for Tic-Tac-Toe (with alpha-beta pruning).
 *
 * Minimax explores the whole game tree. The AI ("maximizing" player) picks the
 * branch with the highest score, while assuming the human ("minimizing" player)
 * always answers with their best possible reply. Depth is subtracted from the
 * score so the AI prefers to win fast and to lose as slowly as possible.
 */

import {
  AI,
  HUMAN,
  type Board,
  type Player,
  applyMove,
  availableMoves,
  evaluateBoard,
  opponentOf,
} from "./logic";

export type Difficulty = "easy" | "medium" | "hard";

export interface AiDecision {
  /** Board index the AI will play. -1 when no move is available. */
  move: number;
  /** How many legal moves existed on this turn. */
  movesConsidered: number;
  /** How many board states minimax visited while searching. */
  nodesExplored: number;
  /** Human-readable reason, used by the "How the AI Thinks" panel. */
  reason: string;
  strategy: "minimax" | "random";
}

const WIN_SCORE = 10;

/** Preference order used only to break ties: center, corners, then edges. */
const POSITION_PRIORITY = [4, 0, 2, 6, 8, 1, 3, 5, 7];

interface SearchResult {
  score: number;
  nodes: number;
}

function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
): SearchResult {
  const outcome = evaluateBoard(board);

  // Terminal states: score the leaf and stop recursing.
  if (outcome.winner === AI) return { score: WIN_SCORE - depth, nodes: 1 };
  if (outcome.winner === HUMAN) return { score: depth - WIN_SCORE, nodes: 1 };
  if (outcome.isDraw) return { score: 0, nodes: 1 };

  const player: Player = isMaximizing ? AI : HUMAN;
  let nodes = 1;
  let best = isMaximizing ? -Infinity : Infinity;

  for (const move of availableMoves(board)) {
    const child = minimax(applyMove(board, move, player), depth + 1, !isMaximizing, alpha, beta);
    nodes += child.nodes;

    if (isMaximizing) {
      best = Math.max(best, child.score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, child.score);
      beta = Math.min(beta, best);
    }

    // Alpha-beta pruning: this branch can no longer influence the result.
    if (beta <= alpha) break;
  }

  return { score: best, nodes };
}

/** Runs a full minimax search and returns the optimal move for the AI. */
export function findBestMove(board: Board): AiDecision {
  const moves = availableMoves(board);
  if (moves.length === 0) {
    return {
      move: -1,
      movesConsidered: 0,
      nodesExplored: 0,
      reason: "No legal moves left.",
      strategy: "minimax",
    };
  }

  let bestMove = moves[0];
  let bestScore = -Infinity;
  let nodesExplored = 0;

  // Search tie-break order so equal-scoring moves favour center then corners.
  const ordered = [...moves].sort(
    (a, b) => POSITION_PRIORITY.indexOf(a) - POSITION_PRIORITY.indexOf(b),
  );

  for (const move of ordered) {
    const result = minimax(applyMove(board, move, AI), 0, false, -Infinity, Infinity);
    nodesExplored += result.nodes;
    if (result.score > bestScore) {
      bestScore = result.score;
      bestMove = move;
    }
  }

  const reason =
    bestScore > 0
      ? "Minimax found a forced win down this branch."
      : bestScore === 0
        ? "Every line leads to a draw with perfect play, so the AI takes the safest square."
        : "The AI is losing with perfect play, so it picks the move that survives longest.";

  return {
    move: bestMove,
    movesConsidered: moves.length,
    nodesExplored,
    reason,
    strategy: "minimax",
  };
}

function randomMove(board: Board): AiDecision {
  const moves = availableMoves(board);
  const move = moves[Math.floor(Math.random() * moves.length)];
  return {
    move,
    movesConsidered: moves.length,
    nodesExplored: 0,
    reason: "Easy mode: the AI played a random legal square instead of searching.",
    strategy: "random",
  };
}

/** Immediate tactical check: can `player` win right now? */
function findImmediateWin(board: Board, player: Player): number | null {
  for (const move of availableMoves(board)) {
    if (evaluateBoard(applyMove(board, move, player)).winner === player) return move;
  }
  return null;
}

/**
 * Difficulty wrapper:
 *  - easy   : mostly random, but still takes an obvious win (25% minimax)
 *  - medium : minimax 65% of the time, always wins/blocks tactically
 *  - hard   : pure minimax, unbeatable
 */
export function chooseAiMove(board: Board, difficulty: Difficulty): AiDecision {
  if (availableMoves(board).length === 0) return findBestMove(board);

  if (difficulty === "hard") return findBestMove(board);

  const winNow = findImmediateWin(board, AI);
  const blockNow = findImmediateWin(board, opponentOf(AI));

  if (difficulty === "medium") {
    if (winNow !== null) {
      return {
        move: winNow,
        movesConsidered: availableMoves(board).length,
        nodesExplored: availableMoves(board).length,
        reason: "Found an immediate winning line and took it.",
        strategy: "minimax",
      };
    }
    if (blockNow !== null) {
      return {
        move: blockNow,
        movesConsidered: availableMoves(board).length,
        nodesExplored: availableMoves(board).length,
        reason: "Blocked the player's immediate winning move.",
        strategy: "minimax",
      };
    }
    return Math.random() < 0.65 ? findBestMove(board) : randomMove(board);
  }

  // easy
  if (winNow !== null && Math.random() < 0.5) {
    return {
      move: winNow,
      movesConsidered: availableMoves(board).length,
      nodesExplored: availableMoves(board).length,
      reason: "Even on Easy the AI grabbed an obvious win.",
      strategy: "minimax",
    };
  }
  return Math.random() < 0.25 ? findBestMove(board) : randomMove(board);
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTY_HINTS: Record<Difficulty, string> = {
  easy: "Mostly random moves — good for warming up.",
  medium: "Mixes tactical play with minimax searches.",
  hard: "Pure minimax. Unbeatable — a draw is a win.",
};
