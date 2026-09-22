import type { ChallengeGenerator, GreaterSideChallenge } from "@/challenges/types"

const glyphs = ["●", "■", "▲", "◆"] as const

export const greaterSideGenerator: ChallengeGenerator<GreaterSideChallenge> = {
  type: "greater-side",
  generate(difficulty, rng) {
    const base = rng.integer(3, Math.round(7 + difficulty * 7))
    const maximumGap = difficulty < 0.3 ? 4 : difficulty < 0.7 ? 2 : 1
    const gap = rng.integer(1, maximumGap)
    const leftWins = rng.next() > 0.5
    const leftCount = leftWins ? base + gap : base
    const rightCount = leftWins ? base : base + gap

    return {
      id: rng.id(),
      type: "greater-side",
      title: "أي جهة تحتوي على عناصر أكثر؟",
      data: { leftCount, rightCount, glyph: rng.pick(glyphs) },
      correctAnswer: leftWins ? "left" : "right",
    }
  },
  validate(challenge) {
    const { leftCount, rightCount } = challenge.data
    return (
      leftCount !== rightCount &&
      leftCount > 0 &&
      rightCount > 0 &&
      challenge.correctAnswer === (leftCount > rightCount ? "left" : "right")
    )
  },
}
