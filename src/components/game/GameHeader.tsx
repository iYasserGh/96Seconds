import { Check, Flame } from "lucide-react"

interface GameHeaderProps {
  seconds: number
  correct: number
  streak: number
}

export function GameHeader({ seconds, correct, streak }: GameHeaderProps) {
  const urgent = seconds <= 10
  const critical = seconds <= 5

  return (
    <header className="game-header" aria-label="حالة الجولة">
      <div className="stat-chip">
        <Flame aria-hidden="true" size={19} />
        <span>السلسلة</span>
        <strong>{streak}</strong>
      </div>
      <div
        className={`timer-tile ${urgent ? "timer-tile--urgent" : ""} ${critical ? "timer-tile--critical" : ""}`}
        aria-label={`${seconds} ثانية متبقية`}
      >
        {seconds}
      </div>
      <div className="stat-chip">
        <Check aria-hidden="true" size={19} />
        <span>صحيحة</span>
        <strong>{correct}</strong>
      </div>
    </header>
  )
}
