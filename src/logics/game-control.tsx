import { useEffect, useRef, useCallback } from 'react'
import { UI } from '~/ui'

import { useShootingStore } from '~/store/use-shooting-store'
import { useAudioManager } from '~/store/use-audio-manager'
import { settings } from '~/lib/config'

export const GameControl = () => {
  const {
    remainingTime,
    isPlaying,
    isTimeUp,
    isGameOver,
    setIsPlaying,
    setIsTimeUp,
    setIsGameOver,
    setBallActive,
    setRemainingTime,
    resetState,
  } = useShootingStore()

  const { setAudioToPlay } = useAudioManager()

  const timerRef = useRef(remainingTime) // Store the actual time in a ref to avoid frequent re-renders
  const lastTimeRef = useRef(Date.now()) // Track the last time `requestAnimationFrame` ran
  const animationFrameId = useRef<number>() // To store the ID of requestAnimationFrame

  // Start and restart game handlers
  const startGame = () => {
    resetTimer()
    resetState() // Reset game state
    setBallActive(0, true)
    setIsPlaying(true) // Start the game
  }

  const restartGame = () => {
    resetTimer()
    resetState() // Reset game state
  }

  // Tick function controls all time-related logic of the game
  const tick = useCallback(() => {
    const now = Date.now()
    const delta = (now - lastTimeRef.current) / 1000 // Get time difference in seconds (with decimals)
    // Decrease the timer value
    timerRef.current -= delta

    // Update lastTimeRef
    lastTimeRef.current = now
    if (timerRef.current <= 0) {
      // If time is up, stop the game
      setIsTimeUp(true)
      setIsGameOver(true)
      setIsPlaying(false)
      setRemainingTime(0)
      setAudioToPlay('buzzer')
      return // Exit the tick function early
    }

    // Request the next animation frame if the game is still playing
    if (isPlaying && !isTimeUp && !isGameOver) {
      animationFrameId.current = requestAnimationFrame(tick)
    }
  }, [
    isPlaying,
    isTimeUp,
    isGameOver,
    setRemainingTime,
    setIsTimeUp,
    setIsPlaying,
    setIsGameOver,
    setAudioToPlay,
  ])

  // Starts the timer when the game is playing
  useEffect(() => {
    if (isPlaying && !isTimeUp && !isGameOver) {
      lastTimeRef.current = Date.now() // Reset the lastTimeRef when starting
      animationFrameId.current = requestAnimationFrame(tick) // Start the timer loop
    }

    return () => {
      if (animationFrameId.current) {
        setRemainingTime(timerRef.current)
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isPlaying, isTimeUp, isGameOver, tick])

  // Reset Timer Function
  const resetTimer = useCallback(() => {
    // Reset the state in the store
    resetState()

    // Clear any pending animation frames
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    // Reset internal refs and values
    setRemainingTime(settings.gameTime) // Reset the remaining time in state
    timerRef.current = settings.gameTime // Reset to initial game time
    lastTimeRef.current = Date.now() // Reset the time tracker
  }, [resetState, setRemainingTime])

  return <UI startGame={startGame} restartGame={restartGame} />
}
