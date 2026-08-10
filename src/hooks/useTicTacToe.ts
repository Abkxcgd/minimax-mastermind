/** All game state management lives here so components stay presentational. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AI,
  HUMAN,
  type Board,
  type GameOutcome,
  applyMove,
  createEmptyBoard,
  evaluateBoard,
  isValidMove,
} from "@/lib/tic-tac-toe/logic";
import { type AiDecision, type Difficulty, chooseAiMove } from "@/lib/tic-tac-toe/minimax";
import { playSound } from "@/lib/tic-tac-toe/sound";

export interface Scoreboard {
  player: number;
  ai: number;
  draws: number;
}

const EMPTY_SCORE: Scoreboard = { player: 0, ai: 0, draws: 0 };
const SCORE_KEY = "ttt-ai-scores";
const DIFFICULTY_KEY = "ttt-ai-difficulty";
const SOUND_KEY = "ttt-ai-sound";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useTicTacToe() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [scores, setScores] = useState<Scoreboard>(EMPTY_SCORE);
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastDecision, setLastDecision] = useState<AiDecision | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const scoredRef = useRef(false);

  // Hydrate persisted preferences after mount (avoids SSR mismatch).
  useEffect(() => {
    setScores(readStored<Scoreboard>(SCORE_KEY, EMPTY_SCORE));
    setDifficulty(readStored<Difficulty>(DIFFICULTY_KEY, "hard"));
    setSoundEnabled(readStored<boolean>(SOUND_KEY, true));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  }, [scores, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(DIFFICULTY_KEY, JSON.stringify(difficulty));
  }, [difficulty, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(SOUND_KEY, JSON.stringify(soundEnabled));
  }, [soundEnabled, hydrated]);

  const outcome: GameOutcome = useMemo(() => evaluateBoard(board), [board]);

  const emit = useCallback(
    (name: Parameters<typeof playSound>[0]) => {
      if (soundEnabled) playSound(name);
    },
    [soundEnabled],
  );

  const playerMove = useCallback(
    (index: number) => {
      if (outcome.isOver || isAiTurn || !isValidMove(board, index)) return;
      emit("place");
      const next = applyMove(board, index, HUMAN);
      setBoard(next);
      if (!evaluateBoard(next).isOver) setIsAiTurn(true);
    },
    [board, emit, isAiTurn, outcome.isOver],
  );

  // AI turn: think briefly (for feel), then play the chosen move.
  useEffect(() => {
    if (!isAiTurn || outcome.isOver) return;
    const timer = window.setTimeout(() => {
      const decision = chooseAiMove(board, difficulty);
      setLastDecision(decision);
      if (decision.move >= 0 && isValidMove(board, decision.move)) {
        setBoard((current) => applyMove(current, decision.move, AI));
        emit("ai");
      }
      setIsAiTurn(false);
    }, 480);
    return () => window.clearTimeout(timer);
  }, [isAiTurn, board, difficulty, outcome.isOver, emit]);

  // Score the finished game exactly once.
  useEffect(() => {
    if (!outcome.isOver || scoredRef.current) return;
    scoredRef.current = true;
    if (outcome.winner === HUMAN) {
      setScores((s) => ({ ...s, player: s.player + 1 }));
      emit("win");
    } else if (outcome.winner === AI) {
      setScores((s) => ({ ...s, ai: s.ai + 1 }));
      emit("lose");
    } else {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
      emit("draw");
    }
  }, [outcome, emit]);

  const newGame = useCallback(() => {
    scoredRef.current = false;
    setBoard(createEmptyBoard());
    setIsAiTurn(false);
    setLastDecision(null);
  }, []);

  const resetScores = useCallback(() => setScores(EMPTY_SCORE), []);

  const changeDifficulty = useCallback(
    (next: Difficulty) => {
      setDifficulty(next);
      newGame();
    },
    [newGame],
  );

  const status: string = outcome.isOver
    ? outcome.winner === HUMAN
      ? "You win! 🎉"
      : outcome.winner === AI
        ? "AI wins this round"
        : "It's a draw"
    : isAiTurn
      ? "AI is thinking…"
      : "Your move";

  return {
    board,
    outcome,
    isAiTurn,
    status,
    scores,
    difficulty,
    soundEnabled,
    lastDecision,
    playerMove,
    newGame,
    resetScores,
    changeDifficulty,
    toggleSound: () => setSoundEnabled((v) => !v),
  };
}
