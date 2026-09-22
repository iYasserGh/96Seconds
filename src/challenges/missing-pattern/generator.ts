import type {
  ChallengeGenerator,
  MissingPatternChallenge,
  PatternFamily,
} from "@/challenges/types"

const patternSymbols = ["●", "■", "▲", "◆"] as const

function buildPattern(family: PatternFamily, first: string, second: string) {
  switch (family) {
    case "abab":
      return { items: [first, second, first, second, "?"], answer: first }
    case "aabaab":
      return { items: [first, first, second, first, first, "?"], answer: second }
    case "rotation":
      return { items: ["↑", "→", "↓", "?"], answer: "←" }
    case "increasing-count":
      return { items: [first, first.repeat(2), first.repeat(3), "?"], answer: first.repeat(4) }
    case "alternating-fill":
      return { items: ["●", "○", "●", "○", "?"], answer: "●" }
  }
}

export const missingPatternGenerator: ChallengeGenerator<MissingPatternChallenge> = {
  type: "missing-pattern",
  generate(difficulty, rng) {
    const families: PatternFamily[] =
      difficulty < 0.3
        ? ["abab", "alternating-fill"]
        : difficulty < 0.7
          ? ["abab", "aabaab", "rotation", "alternating-fill"]
          : ["abab", "aabaab", "rotation", "increasing-count", "alternating-fill"]
    const family = rng.pick(families)
    const first = rng.pick(patternSymbols)
    const second = rng.pick(patternSymbols.filter((symbol) => symbol !== first))
    const { items, answer } = buildPattern(family, first, second)
    const distractorPool = [first, second, ...patternSymbols, "↑", "→", "↓", "←", first.repeat(2), first.repeat(3)]
    const choices = new Set([answer])
    for (const distractor of rng.shuffle(distractorPool)) {
      choices.add(distractor)
      if (choices.size === 4) break
    }

    return {
      id: rng.id(),
      type: "missing-pattern",
      title: "اختر الشكل الناقص",
      data: { family, items, choices: rng.shuffle([...choices]) },
      correctAnswer: answer,
    }
  },
  validate(challenge) {
    const { items, choices } = challenge.data
    return (
      items.at(-1) === "?" &&
      choices.length === 4 &&
      new Set(choices).size === 4 &&
      choices.filter((choice) => choice === challenge.correctAnswer).length === 1
    )
  },
}
