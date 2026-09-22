import { describe, expect, it } from "vitest"

import { challengeRegistry } from "@/challenges/registry"
import { challengeTypes } from "@/challenges/types"
import { createSeededRandom } from "@/game/random"

describe("procedural challenge generators", () => {
  for (const [typeIndex, type] of challengeTypes.entries()) {
    it(`generates 10,000 valid ${type} challenges`, () => {
      const rng = createSeededRandom(96 + typeIndex)
      const definition = challengeRegistry[type]

      for (let index = 0; index < 10_000; index += 1) {
        const difficulty = (index % 101) / 100
        const challenge = definition.generate(difficulty, rng)
        expect(challenge.type).toBe(type)
        expect(definition.validate(challenge)).toBe(true)
      }
    })
  }
})
