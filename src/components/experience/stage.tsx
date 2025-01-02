import { useRef } from 'react'
import { Vector3 } from 'three'
import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { Level } from '../level'
import { BallRack } from '../ball-rack'
import { Hoop } from '../hoop'
import { RapierCollider } from '@react-three/rapier'

export const Stage = () => {
  // Create the ringRef at this higher level to make it accessible in other components
  const ringRef = useRef<RapierCollider>(null)
  const cameraLookAt = useRef(new Vector3())

  // Set camera to always look at the ring
  useFrame(({ camera }) => {
    if (!ringRef.current) return

    const ringPosition = ringRef.current.translation()
    cameraLookAt.current.lerp(
      new Vector3(ringPosition.x, ringPosition.y - 2, ringPosition.z),
      0.1,
    )
    camera.lookAt(cameraLookAt.current)
  })

  return (
    <>
      <Environment preset="sunset" environmentIntensity={1.2} />
      <ambientLight intensity={0.75} />

      <directionalLight
        intensity={0.72}
        position={[8, 10, 4]}
        shadow-normalBias={0.06}
        color={'yellow'}
        castShadow
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Hoop ringRef={ringRef} />
      <BallRack ringRef={ringRef} />
      <Level />
    </>
  )
}
