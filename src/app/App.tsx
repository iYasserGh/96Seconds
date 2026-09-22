import { useCallback, useEffect, useReducer, useRef, useState } from "react"

import { CountdownScreen } from "@/components/game/CountdownScreen"
import { GameScreen } from "@/components/game/GameScreen"
import { LandingScreen } from "@/components/game/LandingScreen"
import { ResultScreen } from "@/components/game/ResultScreen"
import { FEEDBACK_DURATION_MS, GAME_DURATION_SECONDS } from "@/game/constants"
import { getDifficulty } from "@/game/difficulty"
import { generateNextChallenge } from "@/game/engine"
import { browserRandom } from "@/game/random"
import { createInitialGameState, gameReducer } from "@/game/reducer"
import { createEndTime, getDisplayedSeconds } from "@/game/timer"

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState())
  const [countdownKey, setCountdownKey] = useState(0)
  const transitionTimeout = useRef<number | null>(null)

  const clearTransition = useCallback(() => {
    if (transitionTimeout.current !== null) {
      window.clearTimeout(transitionTimeout.current)
      transitionTimeout.current = null
    }
  }, [])

  useEffect(() => clearTransition, [clearTransition])

  useEffect(() => {
    if (state.status !== "playing" || state.endsAt === null) return

    const updateTimer = () => {
      const seconds = getDisplayedSeconds(state.endsAt!, performance.now())
      dispatch({ type: "TICK", displayedSeconds: seconds })
      if (seconds === 0) {
        clearTransition()
        dispatch({ type: "FINISH" })
      }
    }

    updateTimer()
    const interval = window.setInterval(updateTimer, 100)
    return () => window.clearInterval(interval)
  }, [clearTransition, state.endsAt, state.status])

  const startCountdown = () => {
    clearTransition()
    setCountdownKey((value) => value + 1)
    dispatch({ type: "START_COUNTDOWN" })
  }

  const beginPlaying = () => {
    const startedAt = performance.now()
    const challenge = generateNextChallenge(0, [], browserRandom)
    dispatch({
      type: "BEGIN_PLAYING",
      challenge,
      startedAt,
      endsAt: createEndTime(startedAt, GAME_DURATION_SECONDS),
    })
  }

  const scheduleNextChallenge = (wasCorrect: boolean, delay: number) => {
    clearTransition()
    transitionTimeout.current = window.setTimeout(() => {
      if (state.endsAt === null || performance.now() >= state.endsAt) {
        dispatch({ type: "FINISH" })
        return
      }
      const challenge = generateNextChallenge(
        getDifficulty(state.correct + (wasCorrect ? 1 : 0)),
        state.previousChallengeTypes,
        browserRandom,
      )
      dispatch({ type: "NEXT_CHALLENGE", challenge })
    }, delay)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (state.isLocked) return
    dispatch({ type: "ANSWER", outcome: isCorrect ? "correct" : "wrong" })
    scheduleNextChallenge(
      isCorrect,
      isCorrect ? FEEDBACK_DURATION_MS.correct : FEEDBACK_DURATION_MS.wrong,
    )
  }

  const handleSkip = () => {
    if (state.isLocked) return
    dispatch({ type: "SKIP" })
    scheduleNextChallenge(false, FEEDBACK_DURATION_MS.skip)
  }

  return (
    <main className="app-shell min-h-dvh bg-background text-foreground">
      {state.status === "idle" && <LandingScreen onStart={startCountdown} />}
      {state.status === "countdown" && (
        <CountdownScreen key={countdownKey} onComplete={beginPlaying} />
      )}
      {state.status === "playing" && state.currentChallenge && (
        <GameScreen state={state} onAnswer={handleAnswer} onSkip={handleSkip} />
      )}
      {state.status === "finished" && (
        <ResultScreen state={state} onReplay={startCountdown} />
      )}
    </main>
  )
}
