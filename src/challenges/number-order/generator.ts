import type { ChallengeGenerator, NumberOrderChallenge } from "@/challenges/types"

export const numberOrderGenerator: ChallengeGenerator<NumberOrderChallenge> = {
  type: "number-order",
  generate(difficulty, rng) {
    const count = difficulty < 0.3 ? 3 : difficulty < 0.68 ? rng.integer(4, 5) : 6
    const maximum = Math.round(20 + difficulty * 80)
    const values = new Set<number>()
    while (values.size < count) values.add(rng.integer(1, maximum))
    const shuffled = rng.shuffle([...values])

    return {
      id: rng.id(),
      type: "number-order",
      title: "اضغط الأرقام من الأصغر إلى الأكبر",
      data: { values: shuffled },
      correctAnswer: [...shuffled].sort((a, b) => a - b),
    }
  },
  validate(challenge) {
    const { values } = challenge.data
    return (
      values.length >= 3 &&
      values.length <= 6 &&
      new Set(values).size === values.length &&
      challenge.correctAnswer.join(",") === [...values].sort((a, b) => a - b).join(",")
    )
  },
}
