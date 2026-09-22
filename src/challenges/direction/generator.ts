import type { ChallengeGenerator, Direction, DirectionChallenge } from "@/challenges/types"

const directions: readonly Direction[] = ["up", "down", "left", "right"]
const opposites: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}

export const directionGenerator: ChallengeGenerator<DirectionChallenge> = {
  type: "direction",
  generate(difficulty, rng) {
    const instruction = difficulty < 0.3 ? "same" : rng.next() < 0.5 ? "same" : "opposite"
    const shownDirection = rng.pick(directions)
    const correctAnswer = instruction === "same" ? shownDirection : opposites[shownDirection]

    return {
      id: rng.id(),
      type: "direction",
      title: instruction === "same" ? "اختر اتجاه السهم نفسه" : "اختر الاتجاه المعاكس للسهم",
      data: { instruction, shownDirection, choices: rng.shuffle(directions) },
      correctAnswer,
    }
  },
  validate(challenge) {
    const expected =
      challenge.data.instruction === "same"
        ? challenge.data.shownDirection
        : opposites[challenge.data.shownDirection]
    return (
      challenge.data.choices.length === 4 &&
      new Set(challenge.data.choices).size === 4 &&
      challenge.correctAnswer === expected
    )
  },
}
