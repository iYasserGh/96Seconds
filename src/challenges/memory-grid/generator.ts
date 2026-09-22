import type { ChallengeGenerator, MemoryGridChallenge } from "@/challenges/types"

export const memoryGridGenerator: ChallengeGenerator<MemoryGridChallenge> = {
  type: "memory-grid",
  generate(difficulty, rng) {
    const columns = difficulty < 0.3 ? 3 : difficulty < 0.72 ? 4 : 5
    const total = columns * columns
    const highlightedCount =
      columns === 3 ? 2 : columns === 4 ? rng.integer(3, 4) : rng.integer(5, 6)
    const highlightedCells = rng.shuffle(Array.from({ length: total }, (_, index) => index)).slice(0, highlightedCount)
    const previewDuration = columns === 3 ? 1200 : columns === 4 ? 900 : 650

    return {
      id: rng.id(),
      type: "memory-grid",
      title: "احفظ المربعات",
      data: { columns, total, highlightedCells, previewDuration },
      correctAnswer: [...highlightedCells].sort((a, b) => a - b),
    }
  },
  validate(challenge) {
    const { columns, total, highlightedCells } = challenge.data
    return (
      columns >= 3 &&
      columns <= 5 &&
      total === columns * columns &&
      highlightedCells.length >= 2 &&
      new Set(highlightedCells).size === highlightedCells.length &&
      highlightedCells.every((cell) => cell >= 0 && cell < total) &&
      challenge.correctAnswer.join(",") === [...highlightedCells].sort((a, b) => a - b).join(",")
    )
  },
}
