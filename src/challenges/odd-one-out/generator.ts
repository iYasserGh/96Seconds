import type { ChallengeGenerator, OddOneOutChallenge, OddVariation } from "@/challenges/types"

const glyphPairs: Record<OddVariation, readonly [string, string][]> = {
  shape: [
    ["●", "■"],
    ["◆", "▲"],
    ["⬟", "●"],
  ],
  fill: [
    ["●", "○"],
    ["■", "□"],
    ["◆", "◇"],
  ],
  rotation: [
    ["▲", "▶"],
    ["◢", "◣"],
    ["⬒", "⬓"],
  ],
  size: [
    ["●", "•"],
    ["■", "▪"],
    ["◆", "♦"],
  ],
}

export const oddOneOutGenerator: ChallengeGenerator<OddOneOutChallenge> = {
  type: "odd-one-out",
  generate(difficulty, rng) {
    const columns = difficulty < 0.25 ? 2 : difficulty < 0.72 ? 3 : 4
    const rows = difficulty < 0.15 ? 2 : difficulty < 0.65 ? 3 : 4
    const allowedVariations: OddVariation[] =
      difficulty < 0.4 ? ["shape", "fill"] : ["shape", "fill", "rotation", "size"]
    const variation = rng.pick(allowedVariations)
    const [baseGlyph, oddGlyph] = rng.pick(glyphPairs[variation])
    const total = columns * rows
    const oddIndex = rng.integer(0, total - 1)

    return {
      id: rng.id(),
      type: "odd-one-out",
      title: "اختر العنصر المختلف",
      data: { columns, total, oddIndex, baseGlyph, oddGlyph, variation },
      correctAnswer: oddIndex,
    }
  },
  validate(challenge) {
    const { columns, total, oddIndex, baseGlyph, oddGlyph } = challenge.data
    return (
      columns >= 2 &&
      columns <= 4 &&
      total >= 4 &&
      total <= 16 &&
      oddIndex >= 0 &&
      oddIndex < total &&
      baseGlyph !== oddGlyph &&
      challenge.correctAnswer === oddIndex
    )
  },
}
