import { create } from 'zustand'
import { settings } from '~/lib/config'

type Ball = {
  active: boolean
  make: boolean
}

export type UserShot = {
  ball: number
  x: number
  y: number
  t: number
  time: number
}

type ShootingStore = {
  currentBall: number
  totalShots: number
  makes: number
  isShooting: Record<number, boolean>
  isPlaying: boolean
  lastShot: number
  userShot: UserShot | null
  remainingTime: number
  isTimeUp: boolean
  isGameOver: boolean
  balls: Ball[]

  setBallActive: (index: number, isActive: boolean) => void
  setBallMake: (index: number, isMake: boolean) => void
  setCurrentBall: () => void
  incrementTotalShots: () => void
  setMakes: () => void
  setIsPlaying: (playing: boolean) => void
  setIsShooting: (ballId: number, status: boolean) => void
  setLastShot: (shot: number) => void
  resetState: () => void
  setUserShot: (shot: UserShot) => void
  setTotalShots: () => void
  setRemainingTime: (time: number) => void
  setIsTimeUp: (timeUp: boolean) => void
  setIsGameOver: (gameOver: boolean) => void
}

export const useShootingStore = create<ShootingStore>((set) => ({
  currentBall: 0,
  totalShots: 0,
  makes: 0,
  isShooting: {},
  isPlaying: false,
  lastShot: Date.now(),
  userShot: null,

  // Timer-related state
  remainingTime: settings.gameTime, // in seconds
  isTimeUp: false,
  isGameOver: false,

  // Balls state (array with `settings.totalBalls` objects, each having `active` property)
  balls: Array.from({ length: settings.totalBalls }, () => ({
    active: false,
    make: false,
  })),

  // Set ball active state by index
  setBallActive: (index, isActive) =>
    set((state) => ({
      balls: state.balls.map((ball, i) =>
        i === index ? { ...ball, active: isActive } : ball,
      ),
    })),

  // Set ball make state by index
  setBallMake: (index, isMake) =>
    set((state) => ({
      balls: state.balls.map((ball, i) =>
        i === index ? { ...ball, make: isMake } : ball,
      ),
    })),

  // It's more like a setNextBall
  setCurrentBall: () =>
    set((state) => {
      const isLastBall = state.currentBall + 1 >= settings.totalBalls
      const nextBall = isLastBall
        ? settings.totalBalls - 1
        : state.currentBall + 1

      state.balls[nextBall].active = true

      return {
        currentBall: nextBall,
        isPlaying: !isLastBall,
      }
    }),

  incrementTotalShots: () =>
    set((state) => ({ totalShots: state.totalShots + 1 })),
  setMakes: () => set((state) => ({ makes: state.makes + 1 })),
  setIsPlaying: (playing) => set(() => ({ isPlaying: playing })),
  setIsShooting: (ballId, status) =>
    set((state) => ({
      isShooting: { ...state.isShooting, [ballId]: status },
    })),

  setLastShot: (time) => set(() => ({ lastShot: time })),
  resetState: () =>
    set(() => ({
      currentBall: 0,
      totalShots: 0,
      makes: 0,
      isShooting: {},
      isPlaying: false,
      lastShot: Date.now(),
      userShot: null,
      remainingTime: settings.gameTime, // Reset the timer
      isTimeUp: false,
      isGameOver: false,
      balls: Array.from({ length: settings.totalBalls }, () => ({
        active: false,
        make: false,
      })), // Reset the balls array
    })),

  setUserShot: (shot) => set(() => ({ userShot: shot })),
  setTotalShots: () => set((state) => ({ totalShots: state.totalShots + 1 })),

  // Timer Actions
  setRemainingTime: (time) => set(() => ({ remainingTime: Math.max(0, time) })), // Doesn't allow negative
  setIsTimeUp: (timeUp) => set(() => ({ isTimeUp: timeUp })),
  setIsGameOver: (gameOver) => set(() => ({ isGameOver: gameOver })),
}))
