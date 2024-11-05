import { create } from 'zustand';
import { SETTINGS } from '../config/config';

export const useShootingStore = create((set) => ({
  currentBall: 0,
  totalShots: 0,
  makes: 0,
  isShooting: {},
  isPlaying: false,
  lastShot: Date.now(),
  userShot: null,

  // Timer-related state
  remainingTime: SETTINGS.gameTime, // in seconds
  isTimeUp: false,
  isGameOver: false,

  // Balls state (array with `SETTINGS.totalBalls` objects, each having `active` property)
  balls: Array.from({ length: SETTINGS.totalBalls }, () => ({ active: false, make: false })),

  // Set ball active state by index
  setBallActive: (index, isActive) =>
    set((state) => ({
      balls: state.balls.map((ball, i) => (i === index ? { ...ball, active: isActive } : ball)),
    })),

  // Set ball active state by index
  setBallMake: (index, isMake) =>
    set((state) => ({
      balls: state.balls.map((ball, i) => (i === index ? { ...ball, make: isMake } : ball)),
    })),

  setCurrentBall: () =>
    set((state) => {
      const isLastBall = state.currentBall + 1 >= SETTINGS.totalBalls;
      const nextBall = isLastBall ? SETTINGS.totalBalls - 1 : state.currentBall + 1;

      state.balls[nextBall].active = true;

      return {
        currentBall: nextBall,
        isPlaying: !isLastBall,
      };
    }),

  incrementTotalShots: () => set((state) => ({ totalShots: state.totalShots + 1 })),
  setMakes: () => set((state) => ({ makes: state.makes + 1 })),
  setIsPlaying: (playing) => set(() => ({ isPlaying: playing })),
  setIsShooting: (ballId, status) =>
    set((state) => ({
      isShooting: { ...state.isShooting, [ballId]: status },
    })),

  setLastShot: (shot) => set(() => ({ lastShot: shot })),
  resetState: () =>
    set(() => ({
      currentBall: 0,
      totalShots: 0,
      makes: 0,
      isShooting: {},
      isPlaying: false,
      lastShot: Date.now(),
      userShot: null,
      remainingTime: SETTINGS.gameTime, // Reset the timer
      isTimeUp: false,
      isGameOver: false,
      balls: Array.from({ length: SETTINGS.totalBalls }, () => ({ active: false, make: false })), // Reset the balls array
    })),

  setUserShot: (shot) => set(() => ({ userShot: shot })),
  setTotalShots: () => set((state) => ({ totalShots: state.totalShots + 1 })),

  // Timer Actions
  setRemainingTime: (time) => set(() => ({ remainingTime: time })),
  setIsTimeUp: (timeUp) => set(() => ({ isTimeUp: timeUp })),
  setIsGameOver: (gameOver) => set(() => ({ isGameOver: gameOver })),
}));
