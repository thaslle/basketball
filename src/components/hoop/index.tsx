import { useEffect, useRef, useState } from 'react'
import { MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three/src/math/MathUtils.js'
import { CylinderCollider, RapierCollider } from '@react-three/rapier'

import { useShootingStore } from '~/store/use-shooting-store'
import { useAudioManager } from '~/store/use-audio-manager'

import { settings } from '~/lib/config'
import { Net } from '~/components/hoop/net'
import { getLedGeometry } from './led'

type HoopProps = {
  ringRef: React.RefObject<RapierCollider>
}

export const Hoop: React.FC<HoopProps> = ({ ringRef }) => {
  const { balls, makes, setMakes, setIsShooting, setBallMake } =
    useShootingStore()
  const { setAudioToPlay } = useAudioManager()

  const [phase, setPhase] = useState<number | null>(null)
  const ledMaterial = useRef<MeshStandardMaterial>(null)

  // We separate led geometry from the 3D model
  const ledGeometry = getLedGeometry()

  // Effect to trigger the animation when `makes` changes
  useEffect(() => {
    setPhase(0) // Start the transition on `makes` change
  }, [makes])

  useFrame(() => {
    if (!ledMaterial.current) return

    // Animation logic for each phase
    switch (phase) {
      case 0: // Show
        ledMaterial.current.opacity = MathUtils.lerp(
          ledMaterial.current.opacity,
          1,
          0.1,
        )
        if (ledMaterial.current.opacity > 0.98) setPhase(1)
        break

      case 1: // Lerp back to original white color with 0 emissive intensity
        ledMaterial.current.opacity = MathUtils.lerp(
          ledMaterial.current.opacity,
          0,
          0.1,
        )
        if (ledMaterial.current.opacity < 0.01) setPhase(null)
        break
    }
  })

  return (
    <group name="hoop">
      <CylinderCollider
        args={[0.5, 0.01]}
        position={[
          settings.ringPosition.x,
          settings.ringPosition.y,
          settings.ringPosition.z,
        ]}
        ref={ringRef}
        name="target"
        sensor
        onIntersectionExit={(event) => {
          // When the object detected by the sensor is a ball
          // and it has already passed through the rim at a certain height
          if (
            event.other.rigidBodyObject?.name === 'ball' &&
            event.other.rigidBodyObject.position.y <=
              settings.ringPosition.y - 0.15
          ) {
            const ballId = event.other.rigidBodyObject.userData.ballId

            // Only count a shot if the current ball hasn't been counted yet
            if (balls[ballId].make === false) {
              setIsShooting(ballId, false) // Update the store directly
              setBallMake(ballId, true)

              // Make shot
              setMakes() // Increment makes
              setAudioToPlay('swish')
            }
          }
        }}
      />

      <group
        position={[
          settings.ringPosition.x,
          settings.ringPosition.y,
          settings.ringPosition.z,
        ]}
      >
        <Net />
      </group>

      <mesh position={[0, 3.45, -3.065]} geometry={ledGeometry}>
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
  )
}
