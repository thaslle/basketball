/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';
import { Vector3 } from 'three';
import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { Hoop } from './Hoop';
import { Court } from './Court';
import { BallRack } from './BallRack';
import { CloudySky } from './Sky';

export const Experience = () => {
  const ringRef = useRef();
  const cameraLookAt = useRef(new Vector3());

  useFrame(({ camera }) => {
    if (ringRef.current) {
      const ringPosition = ringRef.current.translation();
      cameraLookAt.current.lerp(new Vector3(ringPosition.x, ringPosition.y - 2, ringPosition.z), 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <>
      <Environment preset="sunset" environmentIntensity={1.2} />
      <ambientLight intensity={0.75} />
      <directionalLight intensity={0.72} position={[8, 10, 4]} castShadow shadow-normalBias={0.06} color={'yellow'} />

      <Hoop ringRef={ringRef} />
      <BallRack ringRef={ringRef} />
      <Court />
      <CloudySky />
    </>
  );
};
