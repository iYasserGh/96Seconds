import { useEffect, useState } from "react"

interface CountdownScreenProps {
  onComplete(): void
}

export function CountdownScreen({ onComplete }: CountdownScreenProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (count === 1) onComplete()
      else setCount((value) => value - 1)
    }, 850)
    return () => window.clearTimeout(timeout)
  }, [count, onComplete])

  return (
    <section className="grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <div key={count} className="countdown-number" aria-live="assertive" aria-atomic="true">
        {count}
      </div>
    </section>
  )
}
