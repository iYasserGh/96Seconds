import { describe, expect, it } from "vitest"

import { quickMathGenerator } from "@/challenges/quick-math/generator"
import { appendRecentType, chooseChallengeType } from "@/challenges/scheduler"
import { getDifficulty, scaleDifficulty } from "@/game/difficulty"
import { createSeededRandom } from "@/game/random"
import { createInitialGameState, gameReducer } from "@/game/reducer"
import { createEndTime, getDisplayedSeconds } from "@/game/timer"

describe("difficulty", () => {
  it("depends only on correct answers and caps at one", () => {
    expect(getDifficulty(0)).toBe(0)
    expect(getDifficulty(5)).toBeCloseTo(1 / 6)
    expect(getDifficulty(15)).toBe(0.5)
    expect(getDifficulty(30)).toBe(1)
    expect(getDifficulty(96)).toBe(1)
    expect(scaleDifficulty(0.5, 2, 10)).toBe(6)
  })
})

describe("challenge scheduler", () => {
  it("excludes the last two challenge types", () => {
    const rng = createSeededRandom(96)
    const recent = ["quick-math", "color-clash"] as const
    for (let index = 0; index < 250; index += 1) {
      const type = chooseChallengeType(recent, rng)
      expect(type).not.toBe("quick-math")
      expect(type).not.toBe("color-clash")
    }
  })

  it("keeps only two recent types", () => {
    const recent = appendRecentType(
      appendRecentType(["quick-math"], "color-clash"),
      "direction",
    )
    expect(recent).toEqual(["color-clash", "direction"])
  })
})

describe("timer", () => {
  it("uses an absolute end time without drifting", () => {
    const endAt = createEndTime(1_000, 96)
    expect(endAt).toBe(97_000)
    expect(getDisplayedSeconds(endAt, 1_000)).toBe(96)
    expect(getDisplayedSeconds(endAt, 1_001)).toBe(96)
    expect(getDisplayedSeconds(endAt, 96_001)).toBe(1)
    expect(getDisplayedSeconds(endAt, 120_000)).toBe(0)
  })
})

describe("game reducer", () => {
  const challenge = quickMathGenerator.generate(0, createSeededRandom(1))

  it("tracks correct answers and the longest streak", () => {
    let state = gameReducer(createInitialGameState(), { type: "START_COUNTDOWN" })
    state = gameReducer(state, {
      type: "BEGIN_PLAYING",
      challenge,
      startedAt: 0,
      endsAt: 96_000,
    })
    state = gameReducer(state, { type: "ANSWER", outcome: "correct" })

    expect(state.correct).toBe(1)
    expect(state.attempted).toBe(1)
    expect(state.currentStreak).toBe(1)
    expect(state.longestStreak).toBe(1)
    expect(state.isLocked).toBe(true)

    const duplicate = gameReducer(state, { type: "ANSWER", outcome: "correct" })
    expect(duplicate).toEqual(state)
  })

  it("resets the streak on wrong answers and skips", () => {
    let state = {
      ...createInitialGameState(),
      status: "playing" as const,
      currentChallenge: challenge,
      currentStreak: 4,
      longestStreak: 7,
    }
    state = gameReducer(state, { type: "ANSWER", outcome: "wrong" })
    expect(state.correct).toBe(0)
    expect(state.attempted).toBe(1)
    expect(state.currentStreak).toBe(0)
    expect(state.longestStreak).toBe(7)

    state = gameReducer({ ...state, isLocked: false }, { type: "SKIP" })
    expect(state.attempted).toBe(2)
    expect(state.currentStreak).toBe(0)
  })

  it("does not count an open challenge when time expires", () => {
    const playing = {
      ...createInitialGameState(),
      status: "playing" as const,
      currentChallenge: challenge,
      attempted: 3,
    }
    const finished = gameReducer(playing, { type: "FINISH" })
    expect(finished.status).toBe("finished")
    expect(finished.attempted).toBe(3)
    expect(finished.currentChallenge).toBeNull()
  })
})
