import { describe, expect, it } from "vitest"

import { formatChallengeCount } from "@/lib/formatChallengeCount"

describe("formatChallengeCount", () => {
  it.each([
    [0, "0 تحدي"],
    [1, "تحدي واحد"],
    [2, "تحديين"],
    [3, "3 تحديات"],
    [10, "10 تحديات"],
    [11, "11 تحدي"],
    [96, "96 تحدي"],
  ])("formats %i using the requested Arabic count form", (count, expected) => {
    expect(formatChallengeCount(count)).toBe(expected)
  })
})
