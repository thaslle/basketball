import styles from './styles.module.scss';

export const Balls = ({ makes }) => {
  return (
    <ul className={styles.balls}>
      {[...Array(makes)].map((_, i) => (
        <li key={i}>
          <span>
            <span></span>
          </span>
        </li>
      ))}
    </ul>
  );
};
