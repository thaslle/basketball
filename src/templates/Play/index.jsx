import { useRef, useState, useEffect } from 'react';
import { MathUtils } from 'three/src/math/MathUtils.js';

import styles from './styles.module.scss';

export const Play = ({ startGame }) => {
  const isClicking = useRef(false);
  const clickPosition = useRef();
  const currentPosition = useRef({ x: 0, y: 0 });
  const [slideY, setSlideY] = useState(0);

  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true;
      const mouse = e.touches ? e.touches[0] : e;
      clickPosition.current = { x: mouse.clientX, y: mouse.clientY };
      currentPosition.current = { ...clickPosition.current };
    };

    const onMouseUp = (e) => {
      isClicking.current = false;

      if (clickPosition.current) {
        const mouse = e.changedTouches ? e.changedTouches[0] : e;
        const finalPosition = {
          x: clickPosition.current.x - mouse.clientX,
          y: clickPosition.current.y - mouse.clientY,
        };

        if (Math.abs(finalPosition.y) > 0.02) startGame();
      }
    };

    const onMouseMove = (e) => {
      if (isClicking.current && clickPosition.current) {
        const mouse = e.touches ? e.touches[0] : e;
        currentPosition.current = { x: mouse.clientX, y: mouse.clientY };
        const posY = MathUtils.lerp(currentPosition.current.y - clickPosition.current.y, 0, 0.6);

        setSlideY(posY);
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('touchend', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [startGame]);

  return (
    <div className={styles.start}>
      <div className={styles.wrapper} style={{ transform: `translateY(${slideY}px)` }}>
        <div className={styles.ball}></div>
        <div className={styles.play}>Swipe up to play</div>
      </div>
    </div>
  );
};
