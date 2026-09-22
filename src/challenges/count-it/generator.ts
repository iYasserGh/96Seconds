import type { ChallengeGenerator, CountItChallenge, ShapeToken } from "@/challenges/types"

export const shapeTokens: readonly ShapeToken[] = [
  { name: "دائرة", glyph: "●" },
  { name: "مربع", glyph: "■" },
  { name: "مثلث", glyph: "▲" },
  { name: "معيّن", glyph: "◆" },
]

export const countItGenerator: ChallengeGenerator<CountItChallenge> = {
  type: "count-it",
  generate(difficulty, rng) {
    const columns = difficulty < 0.4 ? 4 : 5
    const total = columns * (difficulty < 0.55 ? 3 : 4)
    const target = rng.pick(shapeTokens)
    const targetCount = rng.integer(3, Math.min(total - 3, Math.round(5 + difficulty * 5)))
    const distractors = shapeTokens.filter((shape) => shape.name !== target.name)
    const gridItems = rng.shuffle([
      ...Array.from({ length: targetCount }, () => target),
      ...Array.from({ length: total - targetCount }, () => rng.pick(distractors)),
    ])
    const choiceValues = new Set([targetCount])
    for (const offset of rng.shuffle([-2, -1, 1, 2, 3])) {
      if (targetCount + offset > 0) choiceValues.add(targetCount + offset)
      if (choiceValues.size === 4) break
    }

    return {
      id: rng.id(),
      type: "count-it",
      title: `كم عدد ${target.name === "دائرة" ? "الدوائر" : target.name === "مربع" ? "المربعات" : target.name === "مثلث" ? "المثلثات" : "المعيّنات"}؟`,
      data: { target, gridItems, choices: rng.shuffle([...choiceValues]), columns },
      correctAnswer: targetCount,
    }
  },
  validate(challenge) {
    const actualCount = challenge.data.gridItems.filter(
      (shape) => shape.name === challenge.data.target.name,
    ).length
    return (
      actualCount === challenge.correctAnswer &&
      challenge.data.choices.length === 4 &&
      new Set(challenge.data.choices).size === 4 &&
      challenge.data.choices.filter((choice) => choice === challenge.correctAnswer).length === 1
    )
  },
}
