/**
 * Core Tic-Tac-Toe rules: board representation, win/draw detection.
 * Kept free of React so it can be unit-tested or reused anywhere.
 */

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[]; // length 9, index 0..8 read left-to-right, top-to-bottom

export const HUMAN: Player = "X";
export const AI: Player = "O";

/** All 8 lines that win the game (3 rows, 3 columns, 2 diagonals). */
export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export interface GameOutcome {
  winner: Player | null;
  line: readonly number[] | null;
  isDraw: boolean;
  isOver: boolean;
}

export const createEmptyBoard = (): Board => Array<Cell>(9).fill(null);

export const availableMoves = (board: Board): number[] =>
  board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);

/** Returns the winner and the winning line, or draw/ongoing status. */
export function evaluateBoard(board: Board): GameOutcome {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { winner: value, line, isDraw: false, isOver: true };
    }
  }

  const isDraw = board.every((cell) => cell !== null);
  return { winner: null, line: null, isDraw, isOver: isDraw };
}

/** Immutably applies a move; returns the same board if the move is invalid. */
export function applyMove(board: Board, index: number, player: Player): Board {
  if (index < 0 || index > 8 || board[index] !== null) return board;
  const next = [...board];
  next[index] = player;
  return next;
}

export const isValidMove = (board: Board, index: number): boolean =>
  index >= 0 && index < 9 && board[index] === null;

export const opponentOf = (player: Player): Player => (player === "X" ? "O" : "X");
