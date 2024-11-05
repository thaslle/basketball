import { useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Sphere } from '@react-three/drei';
import { MathUtils } from 'three/src/math/MathUtils.js';

import { useShootingStore } from '../store/ShootingStore';
import { useAudioManager } from '../store/AudioManager';
import { SETTINGS } from '../config/config';

export const Ball = forwardRef(({ ringRef, initialPosition, ballId, material }, ref) => {
  const {
    currentBall,
    setCurrentBall,
    setTotalShots,
    isShooting,
    setIsShooting,
    setLastShot,
    setIsGameOver,
    setBallActive,
  } = useShootingStore();

  const { setAudioToPlay } = useAudioManager();

  const [playBall, setPlayBall] = useState(['waiting', Date.now()]);
  const ballRef = useRef();

  useImperativeHandle(ref, () => ({
    throwBall,
  }));

  const proximityToTarget = (value, expected, range) => {
    const difference = value - expected;
    const absDifference = Math.abs(difference);
    const sign = Math.sign(difference) * -1; // Keep the same sign behavior

    // Determine the output based on the difference
    let r =
      absDifference <= range
        ? 0
        : absDifference <= range * 3
          ? ((absDifference - range) / (range * 2)) * sign // Map to -1 to 1
          : ((absDifference - range * 3) / range + 1) * sign;

    return 100 - r; // Return final value
  };

  const throwBall = (userFactor) => {
    if (!ballRef.current || !ringRef.current || ballId !== currentBall) return;

    setIsShooting(ballId, true);
    setLastShot(Date.now());
    setTotalShots(); // Increment the total shots

    setCurrentBall();
    setAudioToPlay('throw');

    const g = 9.81;
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const ballPos = ballRef.current.translation();
    const ringPos = ringRef.current.translation();

    const deltaX = ringPos.x - ballPos.x;
    const deltaZ = ringPos.z - ballPos.z;
    const horizontalDist = Math.sqrt(deltaX ** 2 + deltaZ ** 2);
    const maxH = ringPos.y + 1 + horizontalDist / 10; // Determine the max height based on distance
    const vY = Math.sqrt(2 * g * (maxH - ballPos.y));
    const totalFlightTime = (2 * vY) / g; // Total time for the ball to reach the highest point and come down
    const vX = deltaX / totalFlightTime;
    const vZ = deltaZ / totalFlightTime;

    const userShotModifier = {
      y: proximityToTarget(userFactor.y, 200, 10) / 100,
      t: proximityToTarget(userFactor.t * 8, 1, 1) / 100,
    };

    const userRotation = Math.atan2(userFactor.x, userFactor.y) * -0.09;
    const perfectShotConstant = 0.12231; //Stephen Curry

    const impulseVec = {
      x: (vX * Math.cos(userRotation) - vZ * Math.sin(userRotation)) * perfectShotConstant,
      y: vY * ((userShotModifier.y + userShotModifier.t) / 2) * perfectShotConstant,
      z: (vX * Math.sin(userRotation) + vZ * Math.cos(userRotation)) * perfectShotConstant,
    };

    const absvX = Math.abs(vX);
    const absvZ = Math.abs(vZ);

    const rX = ((vZ * -1) / (absvX + absvZ)) * 30;
    const rZ = (vX / (absvX + absvZ)) * 30;

    ballRef.current.applyImpulse(impulseVec, true);
    ballRef.current.setAngvel({ x: rX, y: 0, z: rZ }, true);
  };

  // UseEffect for waiting
  useEffect(() => {
    if (ballId === currentBall && playBall[0] === 'waiting') {
      setPlayBall(['entering', Date.now()]);
    }
  }, [currentBall, ballId, playBall]);

  // Animation
  useFrame((_, delta) => {
    if (!ballRef.current) return;

    const ballPos = ballRef.current.translation();
    switch (playBall[0]) {
      case 'entering':
        // Lerp the y position
        // eslint-disable-next-line no-case-declarations
        const newY = MathUtils.lerp(ballPos.y, initialPosition.y, delta * 0.1);

        // Update rigid body position with the new interpolated y value
        ballRef.current.setTranslation({
          x: initialPosition.x,
          y: newY,
          z: initialPosition.z,
        });

        if (newY >= initialPosition.y) setPlayBall(['settled', Date.now()]);

        break;

      case 'settled':
        if (playBall[1] + SETTINGS.shotSpanTime * 100 < Date.now()) setPlayBall(['playing', Date.now()]);

        break;

      case 'exiting':
        if (playBall[1] + 1500 < Date.now()) {
          if (ballId === currentBall && currentBall === SETTINGS.totalBalls - 1) {
            setPlayBall(['ended', Date.now()]);
            setIsGameOver(true);
          } else {
            setBallActive(ballId, false);
          }
        }

        break;

      default:
        break;
    }

    // Check if the ball has fallen below a certain threshold
    if (ballPos.y < -2) {
      resetBall();
      if (isShooting[ballId]) setIsShooting(ballId, false);
    }

    // Check if is a missed shot
    if (
      playBall[0] === 'playing' &&
      ballPos.y < SETTINGS.ringPosition.y - 0.8 &&
      ballPos.y > 1 &&
      ballRef.current.linvel().y < 0
    ) {
      // Missed shot
      if (isShooting[ballId] === true) setIsShooting(ballId, false); // Update the store directly

      // Set animation to remove the ball from screen
      if (playBall[1] < Date.now() - 200) setPlayBall(['exiting', Date.now()]);
    }
  });

  const resetBall = (x = -100, y = -100 - ballId, z = -100) => {
    ballRef.current.setTranslation({ x, y, z });
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  const randomRotation = useMemo(
    () => [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
    [],
  );

  return (
    <RigidBody
      colliders={'ball'}
      restitution={1.4}
      friction={0.4}
      mass={0.2}
      enabled={playBall[0] === 'playing'} // Enable physics only when playing
      angularDamping={0.8}
      position={[initialPosition.x, initialPosition.y - 0.3, initialPosition.z]}
      ref={ballRef}
      name="ball"
      ballId={ballId}
      collisionFilterGroup={SETTINGS.groupBalls}
      collisionFilterMask={0b1111}
      onCollisionEnter={(event) => {
        let audio = null;
        switch (event.other.rigidBodyObject.name) {
          case 'floor':
            if (ballRef.current.translation().y >= 0.1) audio = 'bounce';
            break;

          case 'ring':
            audio = 'ring';
            break;
        }

        audio && setAudioToPlay(audio);
      }}
    >
      <Sphere
        args={[0.3, SETTINGS.roundSegments, SETTINGS.roundSegments]}
        rotation={randomRotation}
        material={material}
        castShadow
      />
    </RigidBody>
  );
});

Ball.displayName = 'Ball';
