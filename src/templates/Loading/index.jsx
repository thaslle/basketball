import { useProgress } from '@react-three/drei';
import styles from './styles.module.scss';
import { useEffect } from 'react';

export const Loading = ({ onProgress }) => {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [onProgress, progress]);

  return (
    progress < 100 && (
      <div className={styles.loader}>
        <div className={styles.wrapper}>
          <div className={styles.counter}>
            <div className={styles.value} style={{ clipPath: `inset(0 ${100 - progress}% -10px 0)` }}>
              Loading
            </div>
          </div>
        </div>
      </div>
    )
  );
};
