import styles from './styles.module.scss';

export const Restart = ({ onClick, ...props }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {props.children}
    </button>
  );
};
