import { useRef, useEffect, useMemo, createRef, useState } from 'react';
import { useShootingStore } from '../store/ShootingStore';
import { SETTINGS } from '../config/config';
import { MeshStandardMaterial, Vector3 } from 'three';
import { useTexture } from '@react-three/drei';
import { Ball } from './Ball';
import { Rack } from './Rack';
import { useFrame } from '@react-three/fiber';

const getRackIndex = (i) => {
  const ballsPerRack = Math.floor(SETTINGS.totalBalls / SETTINGS.totalRacks);
  return Math.floor(i / ballsPerRack);
};

export const BallRack = ({ ringRef }) => {
  const { lastShot, isPlaying, setUserShot, balls, currentBall, userShot, isShooting, isGameOver, isTimeUp } =
    useShootingStore();

  const rackRefs = useRef([...Array(SETTINGS.totalRacks)].map(() => createRef()));
  const ballRefs = useRef(balls.map(() => createRef()));
  const [resetCamera, setResetCamera] = useState(false);

  const isClicking = useRef(false);
  const clickStart = useRef();
  const clickPosition = useRef();

  const ballTexture = useTexture('/images/ball.png');
  const ballMaterial = useMemo(() => {
    return new MeshStandardMaterial({
      map: ballTexture,
      color: '#ff8429',
      transparent: true,
      fog: false,
      roughness: 0.5,
      metalness: 0.1,
    });
  }, [ballTexture]);

  const racksPosition = useMemo(() => {
    const positions = [];
    const angleStep = Math.PI / (SETTINGS.totalRacks - 1);
    for (let i = 0; i < SETTINGS.totalRacks; i++) {
      const rackPosition = {
        x: SETTINGS.ringPosition.x + SETTINGS.rackDistance * Math.cos(i * angleStep),
        z: SETTINGS.ringPosition.z + SETTINGS.rackDistance * Math.sin(i * angleStep),
      };
      positions.push(rackPosition);
    }

    const reorderedPositions = [];
    const centerIndex = Math.floor(SETTINGS.totalRacks / 2);

    reorderedPositions.push(positions[centerIndex]);

    let step = 1;
    while (reorderedPositions.length < SETTINGS.totalRacks) {
      const rightIndex = centerIndex + step;
      const leftIndex = centerIndex - step;

      if (rightIndex < SETTINGS.totalRacks) {
        reorderedPositions.push(positions[rightIndex]);
      }
      if (leftIndex >= 0) {
        reorderedPositions.push(positions[leftIndex]);
      }
      step++;
    }

    return reorderedPositions;
  }, []);

  // Reset Camera when restart the game
  useEffect(() => {
    setResetCamera(!isPlaying && (isGameOver || isTimeUp));
  }, [isPlaying, isGameOver, isTimeUp]);

  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true;
      clickStart.current = Date.now();
      const mouse = e.touches ? e.touches[0] : e;
      clickPosition.current = { x: mouse.clientX, y: mouse.clientY };
    };

    const onMouseUp = (e) => {
      isClicking.current = false;

      if (clickStart.current && clickPosition.current) {
        const finalTime = (Date.now() - clickStart.current) / 1000;
        const mouse = e.changedTouches ? e.changedTouches[0] : e;
        const finalPosition = {
          x: clickPosition.current.x - mouse.clientX,
          y: clickPosition.current.y - mouse.clientY,
          t: finalTime,
          time: Date.now(),
        };
        const timeSinceLastShot = lastShot ? (Date.now() - lastShot) / 1000 : 0;

        if (Math.abs(finalPosition.y) > 0.02 && finalTime > 0 && timeSinceLastShot > SETTINGS.shotSpanTime + 0.3) {
          if (isPlaying === true && ballRefs.current[currentBall]?.current) {
            ballRefs.current[currentBall].current.throwBall(finalPosition);
            setUserShot(finalPosition);
          }
        }
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('touchend', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [lastShot, currentBall, isPlaying, setUserShot]);

  // Animation
  useFrame(({ camera }) => {
    const rackId = getRackIndex(currentBall);
    const rackRef = rackRefs.current[rackId];
    if (!rackRef.current) return;

    const ballPos = rackRef.current.translation();
    const ringPos = ringRef.current?.translation();

    if (!isShooting[currentBall] && isPlaying) {
      // Calculate the horizontal distance between the ball and the ring
      const dx = ballPos.x - ringPos.x;
      const dz = ballPos.z - ringPos.z;
      const distanceSquared = dx * dx + dz * dz; // Squared distance to avoid repetitive sqrt calls

      // Only move the camera if the distance is greater than 0.3 and enough time has passed since the shot
      if (
        distanceSquared > 0.09 &&
        ((Date.now() - userShot?.time) / 1000 > SETTINGS.shotSpanTime || userShot === null)
      ) {
        const initialDistance = Math.sqrt(distanceSquared);

        // Calculate the final distance, keeping within the camera's min distance
        const distance = Math.max(initialDistance + SETTINGS.cameraDistance, SETTINGS.cameraMinDistance);

        // Normalize the direction vector (dx, dz) and calculate the camera's new position
        const factor = distance / initialDistance;
        const newX = ballPos.x + dx * factor;
        const newZ = ballPos.z + dz * factor;

        // Smoothly move the camera to the new position
        camera.position.lerp(new Vector3(newX, SETTINGS.cameraPos.y, newZ), 0.1);
      }
    }

    if (resetCamera) {
      //Reset Camera
      camera.position.lerp(new Vector3(SETTINGS.cameraPos.x, SETTINGS.cameraPos.y, SETTINGS.cameraPos.z), 0.1);
    }
  });

  const rackElements = useMemo(() => {
    return [...Array(SETTINGS.totalRacks)].map((_, i) => (
      <Rack position={[racksPosition[i].x, 0, racksPosition[i].z]} key={i} rackId={i} ref={rackRefs.current[i]} />
    ));
  }, [racksPosition, rackRefs]);

  const ballElements = useMemo(() => {
    return balls.map((ball, i) => {
      if (ball.active) {
        const rackIndex = getRackIndex(i);

        const initialPosition = {
          x: racksPosition[rackIndex].x,
          y: 0.31,
          z: racksPosition[rackIndex].z,
        };
        return (
          <Ball
            ringRef={ringRef}
            key={i}
            initialPosition={initialPosition}
            ballId={i}
            ref={ballRefs.current[i]}
            material={ballMaterial}
          />
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBall, ringRef, ballRefs, balls, racksPosition]);

  return (
    <>
      {rackElements}
      {ballElements}
    </>
  );
};
