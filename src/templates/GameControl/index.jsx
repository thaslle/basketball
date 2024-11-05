import { useShootingStore } from '../../store/ShootingStore';
import { useAudioManager } from '../../store/AudioManager';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SETTINGS } from '../../config/config';

import { Play } from '../Play';
import { Restart } from '../Restart';
import { Balls } from '../Balls';
import { Score } from '../Score';

import styles from './styles.module.scss';
import { Timer } from '../Timer';

export const GameControl = () => {
  const {
    remainingTime,
    setRemainingTime,
    isTimeUp,
    isGameOver,
    setIsTimeUp,
    setIsGameOver,
    setBallActive,
    isPlaying,
    setIsPlaying,
    resetState,
    makes,
    totalShots,
  } = useShootingStore();

  const { setAudioToPlay, setAudioEnabled } = useAudioManager();

  const timerRef = useRef(remainingTime); // Store the actual time in a ref to avoid frequent re-renders
  const lastTimeRef = useRef(Date.now()); // Track the last time `requestAnimationFrame` ran
  const animationFrameId = useRef(null); // To store the ID of requestAnimationFrame

  const [playGame, setPlayGame] = useState(false);
  const [showScore, setShowScore] = useState(false);

  // Start game handler
  const startGame = () => {
    setPlayGame(true);
    resetTimer();
    resetState(); // Reset game state and timer
    setBallActive(0, true);
    setIsPlaying(true); // Start the game

    //Play audio
    setAudioEnabled(true);
    setAudioToPlay('throw');
    //setBackgroundPlay(true);
  };

  // Start game handler
  const restartGame = () => {
    setPlayGame(false);
    resetTimer();
    resetState(); // Reset game state and timer
    //setBackgroundPlay(false);
  };

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTimeRef.current) / 1000; // Get time difference in seconds (with decimals)

    // Decrease the timer value
    timerRef.current -= delta;

    // Update lastTimeRef
    lastTimeRef.current = now;

    if (timerRef.current <= 0) {
      // If time is up, stop the game
      setIsTimeUp(true);
      setIsGameOver(true);
      setIsPlaying(false);
      setRemainingTime(0);

      setAudioToPlay('buzzer');
      return; // Exit the tick function early
    }

    // Update the state every 0.1 seconds for rendering purposes
    if (Math.floor(timerRef.current * 10) % 1 === 0) {
      setRemainingTime(timerRef.current);
    }

    // Request the next animation frame if the game is still playing
    if (isPlaying && !isTimeUp && !isGameOver) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  }, [isPlaying, isTimeUp, isGameOver, setRemainingTime, setIsTimeUp, setIsPlaying, setIsGameOver, setAudioToPlay]);

  // Starts the timer when the game is playing
  useEffect(() => {
    if (isPlaying && !isTimeUp && !isGameOver) {
      lastTimeRef.current = Date.now(); // Reset the lastTimeRef when starting
      animationFrameId.current = requestAnimationFrame(tick); // Start the timer loop
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Clean up the animation frame on unmount or state change
      }
    };
  }, [isPlaying, isTimeUp, isGameOver, tick]);

  // Reset Timer Function
  const resetTimer = useCallback(() => {
    // Reset the state in the store
    resetState(); // Assuming this resets all the states including isPlaying, remainingTime, etc.

    // Clear any pending animation frames
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Reset internal refs and values
    timerRef.current = SETTINGS.gameTime; // Reset to initial game time
    lastTimeRef.current = Date.now(); // Reset the time tracker
    setRemainingTime(SETTINGS.gameTime); // Reset the remaining time in state
  }, [resetState, setRemainingTime]);

  useEffect(() => {
    let scoreTimeout;
    if (playGame && !isPlaying && isGameOver) {
      scoreTimeout = setTimeout(() => {
        setShowScore(true);
        const result = makes < 4 ? 'fail' : 'success';
        setAudioToPlay(result);
        //setBackgroundPlay(false);
      }, 1500);
    } else {
      setShowScore(false);
    }

    return () => clearTimeout(scoreTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playGame, isPlaying, isGameOver]);

  // Ensure remainingTime is valid (e.g., not undefined)
  const displayedTime = typeof remainingTime === 'number' ? remainingTime : 0;

  return (
    <div className={styles.ui}>
      {!playGame && !isPlaying && !isGameOver && <Play startGame={startGame} />}
      {showScore && (
        <Score restartGame={restartGame} makes={makes} totalShots={totalShots} remainingTime={displayedTime} />
      )}

      <div className={`${styles.top} ${playGame && styles.visible}`}>
        <Balls makes={makes} />
        <Timer time={displayedTime} />
        <Restart onClick={restartGame}>Restart</Restart>
      </div>
    </div>
  );
};
