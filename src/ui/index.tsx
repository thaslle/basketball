import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { useShootingStore } from '~/store/use-shooting-store'
import { useAudioManager } from '~/store/use-audio-manager'

import { Play } from './play'
import { Score } from './score'
import { Balls } from './balls'
import { Timer } from './timer'
import { Restart } from './restart'

import s from './ui.module.scss'

type UIProps = {
  startGame: () => void
  restartGame: () => void
}

export const UI = ({ startGame, restartGame }: UIProps) => {
  const { isGameOver, isPlaying, makes } = useShootingStore()

  const { setAudioToPlay, setAudioEnabled } = useAudioManager()
  const [playGame, setPlayGame] = useState(false)
  const [showScore, setShowScore] = useState(false)

  // Start game handler
  const handleStartGame = () => {
    setPlayGame(true)
    setAudioEnabled(true)
    setAudioToPlay('throw')
    startGame()
  }

  // Start game handler
  const handleRestartGame = () => {
    setPlayGame(false)
    restartGame()
  }

  useEffect(() => {
    let scoreTimeout: ReturnType<typeof setTimeout>
    if (playGame && !isPlaying && isGameOver) {
      scoreTimeout = setTimeout(() => {
        setShowScore(true)
        const result = makes < 4 ? 'fail' : 'success'
        setAudioToPlay(result)
      }, 1500)
    } else {
      setShowScore(false)
    }

    return () => clearTimeout(scoreTimeout)
  }, [playGame, isPlaying, isGameOver])

  return (
    <div className={s.ui}>
      {!playGame && !isPlaying && !isGameOver && (
        <Play startGame={handleStartGame} />
      )}
      {showScore && <Score restartGame={handleRestartGame} />}

      <div className={clsx(s.top, { [s.visible]: playGame })}>
        {(playGame || isPlaying || isGameOver) && (
          <>
            <Balls />
            <Timer />
            <Restart onClick={handleRestartGame}>Restart</Restart>
          </>
        )}
      </div>
    </div>
  )
}
