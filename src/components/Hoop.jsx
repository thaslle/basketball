/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three/src/math/MathUtils.js';

import { CylinderCollider } from '@react-three/rapier';
import { useShootingStore } from '../store/ShootingStore';
import { useAudioManager } from '../store/AudioManager';

import { SETTINGS } from '../config/config';
import { ledGeometry } from './LedGeometry';
import { Net } from './Net';

export const Hoop = ({ ringRef }) => {
  // Accessing state from the shooting store
  const { balls, makes, setMakes, setIsShooting, setBallMake } = useShootingStore();
  const { setAudioToPlay } = useAudioManager();

  const ledMaterial = useRef();

  const [phase, setPhase] = useState(null);

  // Convert arrays to Float32Array and Uint16Array
  const ledGeoPositions = new Float32Array(ledGeometry.attributes.position.array);
  const ledGeoIndices = new Uint16Array(ledGeometry.index.array);

  // Effect to trigger the animation when `makes` changes
  useEffect(() => {
    setPhase(0); // Start the transition on `makes` change
  }, [makes]);

  useFrame(() => {
    if (!ledMaterial.current) return;

    // Animation logic for each phase
    switch (phase) {
      case 0: // Show
        ledMaterial.current.opacity = MathUtils.lerp(ledMaterial.current.opacity, 1, 0.1);
        if (ledMaterial.current.opacity > 0.98) setPhase(1);
        break;

      case 1: // Lerp back to original white color with 0 emissive intensity
        ledMaterial.current.opacity = MathUtils.lerp(ledMaterial.current.opacity, 0, 0.1);
        if (ledMaterial.current.opacity < 0.01) setPhase(null);
        break;

      default:
        break;
    }
  });

  return (
    <group name="hoop">
      <CylinderCollider
        args={[0.5, 0.01]}
        position={[SETTINGS.ringPosition.x, SETTINGS.ringPosition.y, SETTINGS.ringPosition.z]}
        ref={ringRef}
        name="target"
        sensor
        onIntersectionExit={(event) => {
          if (
            event.other.rigidBodyObject.name === 'ball' &&
            event.other.rigidBodyObject.position.y < SETTINGS.ringPosition.y &&
            event.rigidBody.linvel().y < 0
          ) {
            const ballId = event.other.rigidBodyObject.ballId;

            if (balls[ballId].make === false) {
              setIsShooting(ballId, false); // Update the store directly
              setBallMake(ballId, true);

              // Make shot
              setMakes(); // Increment makes
              setAudioToPlay('swish');
            }
          }
        }}
      />

      <group position={[SETTINGS.ringPosition.x, SETTINGS.ringPosition.y, SETTINGS.ringPosition.z]}>
        <Net />
      </group>

      <mesh position={[0, 3.45, -3.065]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={ledGeoPositions}
            count={ledGeoPositions.length / 3}
            itemSize={ledGeometry.attributes.position.itemSize}
          />
          <bufferAttribute attach="index" array={ledGeoIndices} count={ledGeoIndices.length} itemSize={1} />
        </bufferGeometry>

        <meshStandardMaterial
          ref={ledMaterial}
          color="#f23f3f"
          emissive="#f23f3f"
          emissiveIntensity={0.8}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
};
