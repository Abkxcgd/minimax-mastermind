# Tic-Tac-Toe AI

**Internship Task:** Tic-Tac-Toe with Simple AI
**AI Technique:** Minimax Algorithm (with alpha-beta pruning)

## Overview

A browser-based Tic-Tac-Toe game where a human player (X) plays against a computer
opponent (O). The AI is powered by the Minimax algorithm, a classic adversarial
search technique from Artificial Intelligence. On Hard difficulty the AI plays
perfectly and cannot be beaten — the best possible result is a draw.

## Features

- Player vs AI gameplay with turn switching and move validation
- Three difficulty levels: Easy (mostly random), Medium (tactics + minimax), Hard (pure minimax, unbeatable)
- Correct win / loss / draw detection with the winning line highlighted
- Score tracking for player wins, AI wins and draws, persisted in `localStorage`
- New Game, Reset Score and difficulty switching
- "How the AI Thinks" collapsible panel: board state, moves considered, board states searched and the selected move
- Optional sound effects generated with the Web Audio API (no external assets)
- Responsive layout for mobile, tablet and desktop
- Keyboard accessible board (Tab + arrow keys + Enter), ARIA labels on every square

## Technologies Used

- React 19 + TypeScript
- TanStack Start / TanStack Router
- Tailwind CSS v4 (design tokens defined in `src/styles.css`)
- Web Audio API for sound
- `localStorage` for score and preference persistence

## How Minimax Works

Minimax explores the entire game tree of remaining moves. Two players alternate:

1. The **maximizing** player (the AI) picks the move with the highest score.
2. The **minimizing** player (the human) is assumed to pick the move with the lowest score.

Terminal boards are scored: `+10` for an AI win, `-10` for a human win, `0` for a draw.
The current search depth is subtracted from the score so the AI prefers to win as
quickly as possible and to delay a loss as long as possible.

**Alpha-beta pruning** skips branches that cannot change the final decision, which
makes the search much faster without changing the chosen move.

Because Tic-Tac-Toe is a small, fully observable, zero-sum game, minimax always
finds an optimal move — that is why Hard mode never loses.

## Project Structure

```text
src/
  lib/tic-tac-toe/
    logic.ts      # board type, winning lines, win/draw detection, move application
    minimax.ts    # minimax + alpha-beta, difficulty strategies, AI decision details
    sound.ts      # Web Audio blips
  hooks/
    useTicTacToe.ts   # all game state: board, turns, scores, persistence
  components/game/
    GameBoard.tsx     # 3x3 grid, animations, keyboard navigation
    GameInfoPanel.tsx # status, scores, difficulty and control buttons
    AiInsightPanel.tsx# "AI Algorithm: Minimax" + How the AI Thinks
  routes/index.tsx    # page layout
  styles.css          # design tokens (dark futuristic theme)
```

## How to Run Locally

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:8080`).

Production build:

```bash
npm run build
```

## How to Play

1. You are **X**, the AI is **O**. You always move first.
2. Click (or Tab to and press Enter on) any empty square.
3. The AI responds after a short "thinking" delay.
4. Three in a row wins; a full board with no line is a draw.
5. Use **New Game** for another round, **Reset Score** to clear the scoreboard, and the
   difficulty buttons to change how strong the AI plays.

## Internship Task Mapping

| Requirement | Where it is implemented |
| --- | --- |
| Computer plays against the user | `useTicTacToe.ts` AI turn effect |
| AI opponent using Minimax | `lib/tic-tac-toe/minimax.ts` |
| Board displayed clearly after every move | `components/game/GameBoard.tsx` |
| Win / loss / draw detection | `evaluateBoard()` in `lib/tic-tac-toe/logic.ts` |
| Simple-rule AI variants | Easy / Medium strategies in `chooseAiMove()` |

## Future Improvements

- Larger boards (4x4, N-in-a-row) with a depth-limited minimax and a heuristic evaluation
- Move history with undo / replay
- Two-player local mode and an online leaderboard
- Visualising the search tree node by node
