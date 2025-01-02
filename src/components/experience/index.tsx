import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { Stage } from './stage'
import { settings } from '~/lib/config'

export const Experience = () => {
  return (
    <Canvas
      shadows
      camera={{
        position: [
          settings.cameraPos.x,
          settings.cameraPos.y,
          settings.cameraPos.z,
        ],
        fov: 35,
        near: 0.1,
      }}
      style={{
        touchAction: 'none',
      }}
    >
      <color attach="background" args={['#79f2eb']} />
      <fog attach="fog" args={['#79f2eb', 7, 150]} />

      <Physics>
        <Stage />
      </Physics>
    </Canvas>
  )
}
