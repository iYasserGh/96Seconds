import type { ChallengeGenerator, MathOperator, QuickMathChallenge } from "@/challenges/types"

function calculate(left: number, operator: MathOperator, right: number) {
  if (operator === "+") return left + right
  if (operator === "−") return left - right
  return left * right
}

function createChoices(answer: number, rng: Parameters<ChallengeGenerator<QuickMathChallenge>["generate"]>[1]) {
  const values = new Set([answer])
  const offsets = rng.shuffle([-10, -5, -3, -2, -1, 1, 2, 3, 5, 10])
  for (const offset of offsets) {
    values.add(answer + offset)
    if (values.size === 4) break
  }
  return rng.shuffle([...values])
}

export const quickMathGenerator: ChallengeGenerator<QuickMathChallenge> = {
  type: "quick-math",
  generate(difficulty, rng) {
    const operators: MathOperator[] = difficulty < 0.35 ? ["+", "−"] : ["+", "−", "×"]
    const operator = rng.pick(operators)
    const maximum = operator === "×" ? Math.round(6 + difficulty * 6) : Math.round(10 + difficulty * 35)
    let left = rng.integer(2, maximum)
    let right = rng.integer(1, maximum)

    if (operator === "−" && right > left) [left, right] = [right, left]

    let expression = `${left} ${operator} ${right}`
    let correctAnswer = calculate(left, operator, right)

    if (difficulty > 0.75 && rng.next() > 0.45) {
      const tail = rng.integer(1, 8)
      expression = `${left} ${operator} ${right} + ${tail}`
      correctAnswer += tail
    }

    return {
      id: rng.id(),
      type: "quick-math",
      title: "حل العملية",
      data: { expression, choices: createChoices(correctAnswer, rng) },
      correctAnswer,
    }
  },
  validate(challenge) {
    const { choices } = challenge.data
    return (
      Number.isFinite(challenge.correctAnswer) &&
      challenge.correctAnswer >= 0 &&
      choices.length === 4 &&
      new Set(choices).size === choices.length &&
      choices.filter((choice) => choice === challenge.correctAnswer).length === 1
    )
  },
}
