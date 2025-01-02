import React, { useMemo } from 'react'

import { useShootingStore } from '~/store/use-shooting-store'
import { settings } from '~/lib/config'
import s from './score.module.scss'

type ScoreProps = {
  restartGame: () => void
}

export const Score = ({ restartGame }: ScoreProps) => {
  const { remainingTime, makes, totalShots } = useShootingStore()

  // Instead of randomizing, I decided to set a fixed message per minute.
  const chooseMessage = useMemo(() => {
    return new Date().getMinutes() % 2 === 0 ? 1 : 0
  }, [])

  let message: string[]

  switch (true) {
    case remainingTime === 0:
      message = ['Time’s up!', 'Time’s up!']
      break

    case makes === 10:
      message = ['Hey, are you Curry?', 'Curry, is that you?']
      break

    case makes < 10 && makes >= 8:
      message = ['Almost perfect!', 'Almost there!']
      break

    case makes < 8 && makes >= 6:
      message = ['Good aim!', 'That’s good!']
      break

    case makes < 6 && makes >= 4:
      message = ['Not bad', 'Keep going']
      break

    case makes < 4 && makes >= 1:
      message = ['Better luck next time', 'That was tough :(']
      break

    case makes === 0:
    default:
      message = ['Oops, try again', 'Ouch!!!']
      break
  }

  const time = settings.gameTime - remainingTime
  const parts = time.toFixed(1).split('.')

  return (
    <div className={s.score}>
      <div className={s.wrapper}>
        <div className={s.box}>
          <h2>{message[chooseMessage]}</h2>

          <ul className={s.results}>
            <li className={s.balls}>
              <span></span>
              <p>
                {makes}
                <small>/{totalShots}</small>
              </p>
            </li>

            <li className={s.time}>
              <span></span>
              <p>
                {parts.map((part, index) => (
                  <React.Fragment key={index}>
                    {index === 0 && part}
                    {index === 1 && <small>.{part}s</small>}
                  </React.Fragment>
                ))}
              </p>
            </li>
          </ul>
        </div>

        <button onClick={restartGame} className={s.restart}>
          Play again
        </button>
      </div>
    </div>
  )
}
