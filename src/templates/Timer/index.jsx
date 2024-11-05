import styles from './styles.module.scss';

export const Timer = ({ time }) => {
  const formattedTime = time > 9.9 ? time.toFixed(0) : time.toFixed(1);

  return <div className={styles.timer}>{formattedTime}</div>;
};
