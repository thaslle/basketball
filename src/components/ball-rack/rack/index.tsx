import { forwardRef, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import { useShootingStore } from '~/store/use-shooting-store'
import { settings } from '~/lib/config'
import { getRackIndex } from '~/lib/utils'

type RackProps = {
  position: THREE.Vector3
  rackId: number
}

export const Rack = forwardRef<RapierRigidBody, RackProps>(
  ({ position, rackId }, ref) => {
    const rackHeight = 0.2

    const { currentBall } = useShootingStore()
    const [currentRack, setCurrentRack] = useState({
      current: false,
      time: Date.now(),
    })
    const meshRef = useRef<THREE.Mesh>(null)

    const vertexShader = /*glsl*/ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `
    const fragmentShader = /*glsl*/ `
      varying vec2 vUv;
      void main() {
        float y = vUv.y;
        gl_FragColor = vec4(0.45, 1.0, 0.65, 1. -y);
      }
    `

    useEffect(() => {
      setCurrentRack({
        current: rackId === getRackIndex(currentBall),
        time: Date.now(),
      })
    }, [currentBall, rackId])

    // Just a silly animation to make it show
    useFrame(() => {
      if (meshRef.current && currentRack.time + 300 < Date.now()) {
        const meshY = meshRef.current.position.y
        if (currentRack.current === true) {
          if (meshY < 0) meshRef.current.position.y += 0.05
        } else {
          if (meshY > -rackHeight) meshRef.current.position.y -= 0.05
        }
      }
    })

    return (
      <RigidBody
        type="fixed"
        name="rack"
        colliders={false}
        ref={ref}
        position={position}
      >
        <mesh ref={meshRef} position={[0, -rackHeight, 0]}>
          <cylinderGeometry
            args={[0.4, 0.4, rackHeight, settings.roundSegments, 1, true]}
          />
          <shaderMaterial
            fog={false}
            transparent={true}
            depthWrite={false}
            alphaTest={0.5}
            side={THREE.DoubleSide}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </mesh>
      </RigidBody>
    )
  },
)

Rack.displayName = 'Rack'
