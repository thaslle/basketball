import styles from './styles.module.scss';
import { SETTINGS } from '../../config/config';
import React, { useMemo } from 'react';

export const Score = ({ restartGame, makes, totalShots, remainingTime }) => {
  const chooseMessage = useMemo(() => {
    return new Date().getMinutes() % 2 === 0 ? 1 : 0;
  }, []);

  let message = [null, null];
  switch (true) {
    case remainingTime === 0:
      message = ['Time’s up!', 'Time’s up!'];
      break;

    case makes === 10:
      message = ['Hey, are you Curry?', 'You’re unstoppable!'];
      break;

    case makes < 10 && makes >= 8:
      message = ['Almost perfect!', 'Almost there!'];
      break;

    case makes < 8 && makes >= 6:
      message = ['Good aim!', 'That’s good!'];
      break;

    case makes < 6 && makes >= 4:
      message = ['Not bad', 'Keep going'];
      break;

    case makes < 4 && makes >= 1:
      message = ['Better luck next time', 'That was tough :('];
      break;

    case makes === 0:
      message = ['Oops, try again', 'Ouch!!!'];
      break;
  }

  const time = SETTINGS.gameTime - remainingTime;
  const parts = time.toFixed(1).split('.');

  return (
    <div className={styles.score}>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <h2>{message[chooseMessage]}</h2>

          <ul className={styles.results}>
            <li className={styles.balls}>
              <span></span>
              <p>
                {makes}
                <small>/{totalShots}</small>
              </p>
            </li>

            <li className={styles.time}>
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

        <button onClick={restartGame} className={styles.restart}>
          Play again
        </button>
      </div>
    </div>
  );
};
