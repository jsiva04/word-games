import { buildShareText as buildWordleShareText, getTodayIndex as getWordleTodayIndex, WordleState } from '@/lib/wordle';
import { buildConnShareText, ConnectionsState } from '@/lib/connections';
import { getConnPuzzleIndex } from '@/data/connections';
import { buildShareText as buildWaffleShareText, getDailyPuzzle, getTodayIndex as getWaffleTodayIndex, WaffleState } from '@/lib/waffle';
import { getTodayIndex as getSquarewordTodayIndex, SquarewordState } from '@/lib/squareword';

export function buildAllShareText(): string | null {
  const parts: string[] = [];

  // Wordle
  try {
    const raw = localStorage.getItem('wordleState');
    if (raw) {
      const state = JSON.parse(raw) as WordleState;
      if (state.dayIndex === getWordleTodayIndex() && state.gameOver) {
        parts.push(buildWordleShareText(state));
      }
    }
  } catch {}

  // Connections
  try {
    const raw = localStorage.getItem('connectionsState');
    if (raw) {
      const state = JSON.parse(raw) as ConnectionsState;
      if (state.puzzleIndex === getConnPuzzleIndex() && state.gameOver) {
        parts.push(buildConnShareText(state, state.puzzleIndex));
      }
    }
  } catch {}

  // Squareword
  try {
    const raw = localStorage.getItem('squarewordState');
    if (raw) {
      const state = JSON.parse(raw) as SquarewordState;
      if (state.dayIndex === getSquarewordTodayIndex() && state.gameOver) {
        parts.push(`Squareword #${getSquarewordTodayIndex()}\n6/6 words\n${state.guesses.length} guesses`);
      }
    }
  } catch {}

  // Waffle
  try {
    const raw = localStorage.getItem('waffleState');
    if (raw) {
      const state = JSON.parse(raw) as WaffleState;
      if (state.dayIndex === getWaffleTodayIndex() && state.gameOver) {
        const puzzle = getDailyPuzzle();
        parts.push(buildWaffleShareText(puzzle, state.swapsUsed, state.won));
      }
    }
  } catch {}

  return parts.length > 0 ? parts.join('\n\n') : null;
}
