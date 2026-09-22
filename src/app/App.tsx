import { useCallback, useEffect, useReducer, useRef, useState } from "react"

import { CountdownScreen } from "@/components/game/CountdownScreen"
import { GameScreen } from "@/components/game/GameScreen"
import { LandingScreen } from "@/components/game/LandingScreen"
import { ResultScreen } from "@/components/game/ResultScreen"
import { useGameAudio } from "@/features/audio/useGameAudio"
import {
  loadLocalStats,
  recordCompletedGame,
  saveLocalStats,
  type LocalStats,
} from "@/features/storage/localStats"
import { useTheme } from "@/features/theme/useTheme"
import { FEEDBACK_DURATION_MS, GAME_DURATION_SECONDS } from "@/game/constants"
import { getDifficulty } from "@/game/difficulty"
import { generateNextChallenge } from "@/game/engine"
import { browserRandom } from "@/game/random"
import { createInitialGameState, gameReducer } from "@/game/reducer"
import { createEndTime, getDisplayedSeconds } from "@/game/timer"

export function App() {
  const [stats, setStats] = useState<LocalStats>(() => loadLocalStats())
  const [state, dispatch] = useReducer(gameReducer, stats.soundEnabled, createInitialGameState)
  const [countdownKey, setCountdownKey] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)
  const transitionTimeout = useRef<number | null>(null)
  const savedRun = useRef(false)
  const playedFinalCountdown = useRef(false)
  const resolvedTheme = useTheme(stats.theme)
  const { play: playSound, prepare: prepareAudio } = useGameAudio(state.soundEnabled)

  const updateStats = useCallback((updater: (current: LocalStats) => LocalStats) => {
    setStats((current) => {
      const next = updater(current)
      saveLocalStats(next)
      return next
    })
  }, [])

  const clearTransition = useCallback(() => {
    if (transitionTimeout.current !== null) {
      window.clearTimeout(transitionTimeout.current)
      transitionTimeout.current = null
    }
  }, [])

  useEffect(() => clearTransition, [clearTransition])

  useEffect(() => {
    if (state.status !== "finished" || savedRun.current) return
    savedRun.current = true
    const result = recordCompletedGame(stats, state)
    setIsNewBest(result.isNewBest)
    saveLocalStats(result.stats)
    setStats(result.stats)
  }, [state, stats])

  useEffect(() => {
    if (state.status === "playing" && state.displayedSeconds === 5 && !playedFinalCountdown.current) {
      playedFinalCountdown.current = true
      playSound("countdown")
    }
  }, [playSound, state.displayedSeconds, state.status])

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
    prepareAudio()
    playSound("countdown")
    savedRun.current = false
    playedFinalCountdown.current = false
    setIsNewBest(false)
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
    const nextStreak = isCorrect ? state.currentStreak + 1 : 0
    if (isCorrect && [5, 10, 15, 20].includes(nextStreak)) playSound("streak")
    else playSound(isCorrect ? "correct" : "wrong")
    dispatch({ type: "ANSWER", outcome: isCorrect ? "correct" : "wrong" })
    scheduleNextChallenge(
      isCorrect,
      isCorrect ? FEEDBACK_DURATION_MS.correct : FEEDBACK_DURATION_MS.wrong,
    )
  }

  const handleSkip = () => {
    if (state.isLocked) return
    playSound("skip")
    dispatch({ type: "SKIP" })
    scheduleNextChallenge(false, FEEDBACK_DURATION_MS.skip)
  }

  const toggleSound = () => {
    const enabled = !state.soundEnabled
    dispatch({ type: "SET_SOUND", enabled })
    updateStats((current) => ({ ...current, soundEnabled: enabled }))
  }

  const toggleTheme = () => {
    const theme = resolvedTheme === "dark" ? "light" : "dark"
    updateStats((current) => ({ ...current, theme }))
  }

  return (
    <main className="app-shell min-h-dvh bg-background text-foreground">
      {state.status === "idle" && (
        <LandingScreen
          onStart={startCountdown}
          soundEnabled={state.soundEnabled}
          onToggleSound={toggleSound}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
        />
      )}
      {state.status === "countdown" && (
        <CountdownScreen key={countdownKey} onComplete={beginPlaying} />
      )}
      {state.status === "playing" && state.currentChallenge && (
        <GameScreen state={state} onAnswer={handleAnswer} onSkip={handleSkip} />
      )}
      {state.status === "finished" && (
        <ResultScreen
          state={state}
          stats={stats}
          isNewBest={isNewBest}
          onReplay={startCountdown}
        />
      )}
    </main>
  )
}
