import { afterEach, describe, expect, it, vi } from "vitest"

import {
  defaultLocalStats,
  loadLocalStats,
  recordCompletedGame,
  saveLocalStats,
  STORAGE_KEY,
} from "@/features/storage/localStats"
import { createInitialGameState } from "@/game/reducer"

function mockStorage(initialValue?: string) {
  const values = new Map<string, string>()
  if (initialValue !== undefined) values.set(STORAGE_KEY, initialValue)
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  })
  return values
}

afterEach(() => vi.unstubAllGlobals())

describe("local stats", () => {
  it("falls back safely when stored JSON is malformed", () => {
    mockStorage("not-json")
    expect(loadLocalStats()).toEqual(defaultLocalStats)
  })

  it("persists preferences without losing scores", () => {
    const values = mockStorage()
    const stats = { ...defaultLocalStats, bestCorrect: 12, soundEnabled: false, theme: "dark" as const }
    saveLocalStats(stats)
    expect(JSON.parse(values.get(STORAGE_KEY)!)).toEqual(stats)
    expect(loadLocalStats()).toEqual(stats)
  })

  it("updates the best result and games played once", () => {
    const state = {
      ...createInitialGameState(),
      status: "finished" as const,
      correct: 14,
      attempted: 18,
      longestStreak: 6,
    }
    const result = recordCompletedGame(defaultLocalStats, state)
    expect(result.isNewBest).toBe(true)
    expect(result.stats.bestCorrect).toBe(14)
    expect(result.stats.bestAttempted).toBe(18)
    expect(result.stats.bestStreak).toBe(6)
    expect(result.stats.gamesPlayed).toBe(1)
  })
})
