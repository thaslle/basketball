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
        {/* <div className={styles.arrow}>
          <svg width="234" height="286" viewBox="0 0 234 286" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_149_6" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M131.099 6.14213C123.289 -1.66835 110.625 -1.66835 102.815 6.14214L6.14217 102.815C-6.45713 115.414 2.46619 136.957 20.2843 136.957H61V266C61 277.046 69.9543 286 81 286H152C163.046 286 172 277.046 172 266V136.957H213.63C231.448 136.957 240.371 115.414 227.772 102.815L131.099 6.14213Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M131.099 6.14213C123.289 -1.66835 110.625 -1.66835 102.815 6.14214L6.14217 102.815C-6.45713 115.414 2.46619 136.957 20.2843 136.957H61V266C61 277.046 69.9543 286 81 286H152C163.046 286 172 277.046 172 266V136.957H213.63C231.448 136.957 240.371 115.414 227.772 102.815L131.099 6.14213Z"
              fill="url(#paint0_linear_149_6)"
            />
            <path
              d="M102.815 6.14214L107.765 11.0919L107.765 11.0919L102.815 6.14214ZM131.099 6.14213L136.049 1.19239L136.049 1.19239L131.099 6.14213ZM6.14217 102.815L1.19242 97.865L1.19242 97.865L6.14217 102.815ZM61 136.957H68V129.957H61V136.957ZM172 136.957V129.957H165V136.957H172ZM227.772 102.815L222.822 107.764L222.822 107.764L227.772 102.815ZM107.765 11.0919C112.841 6.01507 121.072 6.01507 126.149 11.0919L136.049 1.19239C125.505 -9.35177 108.409 -9.35176 97.865 1.19239L107.765 11.0919ZM11.0919 107.764L107.765 11.0919L97.865 1.19239L1.19242 97.865L11.0919 107.764ZM20.2843 129.957C8.70254 129.957 2.90236 115.954 11.0919 107.764L1.19242 97.865C-15.8166 114.874 -3.77016 143.957 20.2843 143.957V129.957ZM61 129.957H20.2843V143.957H61V129.957ZM68 266V136.957H54V266H68ZM81 279C73.8203 279 68 273.18 68 266H54C54 280.912 66.0883 293 81 293V279ZM152 279H81V293H152V279ZM165 266C165 273.18 159.18 279 152 279V293C166.912 293 179 280.912 179 266H165ZM165 136.957V266H179V136.957H165ZM213.63 129.957H172V143.957H213.63V129.957ZM222.822 107.764C231.011 115.954 225.211 129.957 213.63 129.957V143.957C237.684 143.957 249.73 114.874 232.721 97.865L222.822 107.764ZM126.149 11.0919L222.822 107.764L232.721 97.865L136.049 1.19239L126.149 11.0919Z"
              fill="#3D5561"
              mask="url(#path-1-inside-1_149_6)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_149_6"
                x1="116.957"
                y1="0.28418"
                x2="116.957"
                y2="286"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ffff00" />
                <stop offset="1" stopColor="#ff611f" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}
        <div className={styles.ball}></div>
        <div className={styles.play}>Swipe up to play</div>
      </div>
    </div>
  );
};
