import type { ChallengeGenerator, ColorChoice, ColorClashChallenge } from "@/challenges/types"

export const colorChoices: readonly ColorChoice[] = [
  { name: "أحمر", value: "#d92d3f" },
  { name: "أخضر", value: "#008a45" },
  { name: "أزرق", value: "#1769e0" },
  { name: "بنفسجي", value: "#7c3fc7" },
  { name: "برتقالي", value: "#d85d00" },
]

export const colorClashGenerator: ChallengeGenerator<ColorClashChallenge> = {
  type: "color-clash",
  generate(difficulty, rng) {
    const word = rng.pick(colorChoices)
    const renderedColor = rng.pick(colorChoices.filter((color) => color.name !== word.name))
    const choiceCount = difficulty < 0.3 ? 3 : difficulty < 0.7 ? 4 : 5
    const wordColor = colorChoices.find((color) => color.name === word.name)!
    const distractors = rng
      .shuffle(
        colorChoices.filter(
          (color) => color.name !== renderedColor.name && color.name !== word.name,
        ),
      )
      .slice(0, choiceCount - 2)
    const choices = rng.shuffle([renderedColor, wordColor, ...distractors])

    return {
      id: rng.id(),
      type: "color-clash",
      title: "اختر لون الكلمة، وليس معناها",
      data: { word: word.name, renderedColor, choices },
      correctAnswer: renderedColor.name,
    }
  },
  validate(challenge) {
    const names = challenge.data.choices.map((choice) => choice.name)
    return (
      challenge.data.word !== challenge.data.renderedColor.name &&
      names.length >= 3 &&
      names.length <= 5 &&
      new Set(names).size === names.length &&
      names.includes(challenge.data.word) &&
      names.includes(challenge.data.renderedColor.name) &&
      names.filter((name) => name === challenge.correctAnswer).length === 1
    )
  },
}
