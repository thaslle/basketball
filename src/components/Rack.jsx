/* eslint-disable react/no-unknown-property */
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useShootingStore } from '../store/ShootingStore';

import { SETTINGS } from '../config/config';
import { RigidBody } from '@react-three/rapier';

export const Rack = forwardRef(({ position, rackId }, ref) => {
  const rackHeight = 0.2;

  const { currentBall } = useShootingStore();
  const [currentRack, setCurrentRack] = useState([false, Date.now()]);
  const meshRef = useRef();

  const getRackIndex = (i) => {
    const ballsPerRack = Math.floor(SETTINGS.totalBalls / SETTINGS.totalRacks);
    return Math.floor(i / ballsPerRack);
  };

  const args = useMemo(
    () => ({
      fog: false,
      transparent: true,
      depthWrite: false,
      // depthTest: false,
      alphaTest: 0.5,
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
      fragmentShader: `
      varying vec2 vUv;
      void main() {
        float y = vUv.y;
        gl_FragColor = vec4(0.45, 1.0, 0.65, 1. -y);
      }
    `,
    }),
    [],
  );

  useEffect(() => {
    setCurrentRack([rackId === getRackIndex(currentBall), Date.now()]);
  }, [currentBall, rackId]);

  useFrame(() => {
    if (meshRef.current && currentRack[1] + 300 < Date.now()) {
      const meshY = meshRef.current.position.y;
      if (currentRack[0] === true) {
        if (meshY < 0) meshRef.current.position.y += 0.05;
      } else {
        if (meshY > -rackHeight) meshRef.current.position.y -= 0.05;
      }
    }
  });

  return (
    <RigidBody type="fixed" name="rack" colliders={false} ref={ref} position={position}>
      <mesh ref={meshRef} position={[0, -rackHeight, 0]}>
        <cylinderGeometry args={[0.4, 0.4, rackHeight, SETTINGS.roundSegments, 1, true]} />
        <shaderMaterial args={[args]} side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
});

Rack.displayName = 'Rack';
