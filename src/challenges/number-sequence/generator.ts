import type {
  ChallengeGenerator,
  NumberSequenceChallenge,
  SequenceFamily,
} from "@/challenges/types"

function uniqueChoices(answer: number, spread: number, random: Parameters<ChallengeGenerator<NumberSequenceChallenge>["generate"]>[1]) {
  const values = new Set([answer])
  const offsets = random.shuffle([-spread * 2, -spread, -2, -1, 1, 2, spread, spread * 2])
  for (const offset of offsets) {
    values.add(answer + offset)
    if (values.size === 4) break
  }
  return random.shuffle([...values])
}

export const numberSequenceGenerator: ChallengeGenerator<NumberSequenceChallenge> = {
  type: "number-sequence",
  generate(difficulty, rng) {
    const families: SequenceFamily[] =
      difficulty < 0.35 ? ["step"] : difficulty < 0.7 ? ["step", "multiply"] : ["step", "multiply", "alternating"]
    const family = rng.pick(families)
    const sequence: number[] = []
    let correctAnswer = 0
    let spread = 2

    if (family === "step") {
      const start = rng.integer(1, Math.round(8 + difficulty * 15))
      const step = rng.integer(2, Math.round(3 + difficulty * 7)) * (rng.next() > 0.25 ? 1 : -1)
      for (let index = 0; index < 4; index += 1) sequence.push(start + index * step)
      correctAnswer = start + 4 * step
      spread = Math.abs(step)
    } else if (family === "multiply") {
      const start = rng.integer(1, 4)
      const factor = rng.integer(2, difficulty > 0.7 ? 3 : 2)
      for (let index = 0; index < 4; index += 1) sequence.push(start * factor ** index)
      correctAnswer = start * factor ** 4
      spread = factor
    } else {
      const start = rng.integer(1, 10)
      const firstStep = rng.integer(2, 5)
      let secondStep = rng.integer(1, 4)
      if (secondStep === firstStep) secondStep += 1
      sequence.push(start)
      for (let index = 0; index < 4; index += 1) {
        sequence.push(sequence.at(-1)! + (index % 2 === 0 ? firstStep : secondStep))
      }
      correctAnswer = sequence.pop()!
      spread = Math.max(firstStep, secondStep)
    }

    return {
      id: rng.id(),
      type: "number-sequence",
      title: "ما الرقم التالي؟",
      data: { sequence, choices: uniqueChoices(correctAnswer, spread, rng), family },
      correctAnswer,
    }
  },
  validate(challenge) {
    const { sequence, choices } = challenge.data
    return (
      sequence.length === 4 &&
      sequence.every(Number.isFinite) &&
      choices.length === 4 &&
      new Set(choices).size === 4 &&
      choices.filter((choice) => choice === challenge.correctAnswer).length === 1
    )
  },
}
