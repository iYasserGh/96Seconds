import { GAME_DURATION_SECONDS } from "@/game/constants"
import type { GameState } from "@/game/reducer"

export const STORAGE_KEY = "96-seconds:v1"

export type ThemePreference = "light" | "dark" | "system"

export interface LocalStats {
  bestCorrect: number
  bestAttempted: number
  bestStreak: number
  bestDuration: number
  gamesPlayed: number
  soundEnabled: boolean
  theme: ThemePreference
}

export const defaultLocalStats: LocalStats = {
  bestCorrect: 0,
  bestAttempted: 0,
  bestStreak: 0,
  bestDuration: GAME_DURATION_SECONDS,
  gamesPlayed: 0,
  soundEnabled: true,
  theme: "system",
}

function isTheme(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system"
}

export function loadLocalStats(): LocalStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultLocalStats
    const parsed = JSON.parse(stored) as Partial<LocalStats>
    return {
      bestCorrect: Number.isFinite(parsed.bestCorrect) ? Math.max(0, parsed.bestCorrect!) : 0,
      bestAttempted: Number.isFinite(parsed.bestAttempted) ? Math.max(0, parsed.bestAttempted!) : 0,
      bestStreak: Number.isFinite(parsed.bestStreak) ? Math.max(0, parsed.bestStreak!) : 0,
      bestDuration: Number.isFinite(parsed.bestDuration) ? parsed.bestDuration! : GAME_DURATION_SECONDS,
      gamesPlayed: Number.isFinite(parsed.gamesPlayed) ? Math.max(0, parsed.gamesPlayed!) : 0,
      soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : true,
      theme: isTheme(parsed.theme) ? parsed.theme : "system",
    }
  } catch {
    return defaultLocalStats
  }
}

export function saveLocalStats(stats: LocalStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // The game remains fully playable when storage is unavailable.
  }
}

export function recordCompletedGame(stats: LocalStats, state: GameState) {
  const isNewBest = state.correct > stats.bestCorrect
  const next: LocalStats = {
    ...stats,
    bestCorrect: Math.max(stats.bestCorrect, state.correct),
    bestAttempted: isNewBest ? state.attempted : stats.bestAttempted,
    bestStreak: Math.max(stats.bestStreak, state.longestStreak),
    gamesPlayed: stats.gamesPlayed + 1,
  }
  return { stats: next, isNewBest }
}
