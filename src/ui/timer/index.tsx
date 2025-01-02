import { useEffect, useRef, useCallback, useState } from 'react'
import { useShootingStore } from '~/store/use-shooting-store'

import s from './timer.module.scss'

export const Timer = () => {
  const { remainingTime, isPlaying, isTimeUp, isGameOver } = useShootingStore()

  // I recreated the timer logics in here for prevent all my UI to re-render
  // since it was causing performance issues
  const [displayedTime, setDisplayedTime] = useState(0)

  const timerRef = useRef(remainingTime) // Store the actual time in a ref to avoid frequent re-renders
  const lastTimeRef = useRef(Date.now()) // Track the last time `requestAnimationFrame` ran
  const animationFrameId = useRef<number>() // To store the ID of requestAnimationFrame
  const lastUpdateTimeRef = useRef(Date.now()) // Track the last update time for state

  const tick = useCallback(() => {
    const now = Date.now()
    const delta = (now - lastTimeRef.current) / 1000 // Get time difference in seconds (with decimals)
    timerRef.current -= delta // Decrease the timer value
    lastTimeRef.current = now // Update the last time for the next frame

    if (timerRef.current <= 0) {
      return // If time is up exit the tick function early
    }

    // Check if 100ms have passed since the last update
    // Updating the state so frequently was causing performance issues,
    // so I moved this logic over here to avoid unnecessary re-renders
    // and will now only re-render this small component.
    if (now - lastUpdateTimeRef.current >= 100) {
      setDisplayedTime(timerRef.current) // Update the remaining time state
      lastUpdateTimeRef.current = now // Update the last update time
    }

    // Request the next animation frame if the game is still playing
    if (isPlaying && !isTimeUp && !isGameOver) {
      animationFrameId.current = requestAnimationFrame(tick)
    }
  }, [isPlaying, isTimeUp, isGameOver, remainingTime])

  // Starts the timer when the game is playing
  useEffect(() => {
    if (isPlaying && !isTimeUp && !isGameOver) {
      lastTimeRef.current = Date.now() // Reset the lastTimeRef when starting
      animationFrameId.current = requestAnimationFrame(tick) // Start the timer loop
      setDisplayedTime(timerRef.current)
    }

    return () => {
      if (animationFrameId.current) {
        setDisplayedTime(timerRef.current)
        cancelAnimationFrame(animationFrameId.current) // Clean up the animation frame
      }
    }
  }, [isPlaying, isTimeUp, isGameOver, tick])

  const clampedTime = Math.max(0, displayedTime)
  const formattedTime =
    clampedTime > 9.9 ? clampedTime.toFixed(0) : clampedTime.toFixed(1)

  return <div className={s.timer}>{formattedTime}</div>
}
