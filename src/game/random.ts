export interface RandomSource {
  next(): number
  integer(minimum: number, maximum: number): number
  pick<T>(items: readonly T[]): T
  shuffle<T>(items: readonly T[]): T[]
  id(): string
}

function integerFromSource(source: () => number, minimum: number, maximum: number) {
  return Math.floor(source() * (maximum - minimum + 1)) + minimum
}

export function createRandomSource(source: () => number): RandomSource {
  return {
    next: source,
    integer(minimum, maximum) {
      if (maximum < minimum) {
        throw new RangeError("maximum must be greater than or equal to minimum")
      }
      return integerFromSource(source, minimum, maximum)
    },
    pick(items) {
      if (items.length === 0) throw new RangeError("cannot pick from an empty list")
      return items[integerFromSource(source, 0, items.length - 1)]
    },
    shuffle(items) {
      const result = [...items]
      for (let index = result.length - 1; index > 0; index -= 1) {
        const target = integerFromSource(source, 0, index)
        ;[result[index], result[target]] = [result[target], result[index]]
      }
      return result
    },
    id() {
      const parts = Array.from({ length: 4 }, () =>
        integerFromSource(source, 0, 0xffffffff).toString(16).padStart(8, "0"),
      )
      return parts.join("-")
    },
  }
}

export const browserRandom = createRandomSource(() => {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 0x1_0000_0000
})

export function createSeededRandom(seed: number) {
  let state = seed >>> 0
  return createRandomSource(() => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000
  })
}
