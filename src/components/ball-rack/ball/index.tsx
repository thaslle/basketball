import {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react'
import * as THREE from 'three'
import { Euler, useFrame } from '@react-three/fiber'
import { RigidBody, RapierRigidBody, RapierCollider } from '@react-three/rapier'
import { Sphere } from '@react-three/drei'
import { MathUtils } from 'three/src/math/MathUtils.js'

import { UserShot, useShootingStore } from '~/store/use-shooting-store'
import { useAudioManager } from '~/store/use-audio-manager'
import { settings } from '~/lib/config'
import { throwBallPhysics } from '~/lib/utils'

export interface BallImperativeHandle {
  throwBall: (userFactor: UserShot) => void
}

type BallProps = {
  ringRef: React.RefObject<RapierCollider>
  initialPosition: { x: number; y: number; z: number }
  ballId: number
  material: THREE.Material
}

type PlayBall = {
  status: string
  time: number
}

export const Ball = forwardRef<BallImperativeHandle, BallProps>(
  ({ ringRef, initialPosition, ballId, material }, ref) => {
    useImperativeHandle(ref, () => ({
      throwBall,
    }))

    const {
      currentBall,
      isShooting,
      setIsShooting,
      setIsGameOver,
      setBallActive,
      setLastShot,
      setTotalShots,
      setCurrentBall,
    } = useShootingStore()

    const { setAudioToPlay } = useAudioManager()

    // Create a local state to manage just the current ball
    const [playBall, setPlayBall] = useState<PlayBall>({
      status: 'waiting',
      time: Date.now(),
    })

    const ballRef = useRef<RapierRigidBody>(null)

    // Throw Ball handles the shot
    const throwBall = (userFactor: UserShot) => {
      if (
        !userFactor ||
        !ballRef.current ||
        !ringRef.current ||
        ballId !== currentBall ||
        userFactor.ball !== ballId ||
        isShooting[ballId] === true
      )
        return

      setIsShooting(ballId, true)
      setLastShot(Date.now())
      setTotalShots() // Increment the total shots

      setCurrentBall() // Pick the next ball
      setAudioToPlay('throw')

      // Make sure the ball is not moving before the shot
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

      const ballPos = ballRef.current.translation()
      const ringPos = ringRef.current.translation()

      // Just physics :)
      const { impulseVec, rotationVec } = throwBallPhysics(
        userFactor,
        ballPos,
        ringPos,
      )

      // Apply impulse and rotation
      ballRef.current.applyImpulse(impulseVec, true)
      ballRef.current.setAngvel(rotationVec, true)
    }

    /*// Throw Ball alternative approach
    useEffect(() => {
      if (
        !userShot ||
        !ballRef.current ||
        !ringRef.current ||
        ballId !== currentBall ||
        userShot.ball !== ballId ||
        isShooting[ballId] === true
      )
        return

      setIsShooting(ballId, true)
      setLastShot(Date.now())
      setTotalShots() // Increment the total shots

      setCurrentBall()
      setAudioToPlay('throw')

      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

      const ballPos = ballRef.current.translation()
      const ringPos = ringRef.current.translation()

      const { impulseVec, rotationVec } = throwBallPhysics(
        userShot,
        ballPos,
        ringPos,
      )

      ballRef.current.applyImpulse(impulseVec, true)
      ballRef.current.setAngvel(rotationVec, true)
    }, [userShot])*/

    // Changes to enter state when this is the current ball
    useEffect(() => {
      if (ballId === currentBall && playBall.status === 'waiting') {
        setPlayBall({ status: 'entering', time: Date.now() })
      }
    }, [currentBall, ballId, playBall])

    // Animation
    useFrame((_, delta) => {
      if (!ballRef.current) return

      const ballPos = ballRef.current.translation()
      switch (playBall.status) {
        case 'entering':
          // Lerp the y position
          const newY: number = MathUtils.lerp(
            ballPos.y,
            initialPosition.y,
            delta * 0.1,
          )

          // Update rigid body position with the new interpolated y value
          ballRef.current.setTranslation(
            {
              x: initialPosition.x,
              y: newY,
              z: initialPosition.z,
            },
            true,
          )

          // When ball reaches the settled position
          if (newY >= initialPosition.y)
            setPlayBall({ status: 'settled', time: Date.now() })

          break

        case 'settled':
          // Wait for the spawn time before allowing to play
          if (playBall.time + settings.shotSpawnTime * 100 < Date.now())
            setPlayBall({ status: 'playing', time: Date.now() })

          break

        case 'exiting':
          // Wait for 1500ms before starting exit animation
          if (playBall.time + 1500 < Date.now()) {
            // Ends the game if it's the last ball
            if (
              ballId === currentBall &&
              currentBall === settings.totalBalls - 1
            ) {
              setPlayBall({ status: 'ended', time: Date.now() })
              setIsGameOver(true)
            } else {
              setBallActive(ballId, false)
            }
          }

          break
      }

      // Check if the ball has fallen below a certain threshold
      if (ballPos.y < -2) {
        resetBall()
        if (isShooting[ballId]) setIsShooting(ballId, false)
      }

      // Check if is a missed shot
      if (
        playBall.status === 'playing' &&
        ballPos.y < settings.ringPosition.y - 0.8 &&
        ballPos.y > 1 &&
        ballRef.current.linvel().y < 0
      ) {
        // Missed shot
        if (isShooting[ballId] === true) setIsShooting(ballId, false) // Update the store directly

        // Set animation to remove the ball from screen
        if (playBall.time < Date.now() - 200)
          setPlayBall({ status: 'exiting', time: Date.now() })
      }
    })

    const resetBall = (x = -100, y = -100 - ballId, z = -100) => {
      if (!ballRef.current) return
      ballRef.current.setTranslation({ x, y, z }, true)
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }

    // A fancy effect to make the ball always appear in a different rotation
    const randomRotation: Euler = useMemo(
      () => [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ],
      [],
    )

    return (
      <RigidBody
        userData={{ ballId: ballId }}
        ref={ballRef}
        name="ball"
        position={[
          initialPosition.x,
          initialPosition.y - 0.3,
          initialPosition.z,
        ]}
        colliders={'ball'}
        restitution={1.4}
        friction={0.4}
        mass={0.2}
        canSleep
        angularDamping={0.8}
        collisionGroups={settings.groupBalls}
        onCollisionEnter={(event) => {
          let audio = null
          switch (event.other.rigidBodyObject?.name) {
            case 'floor':
              // Prevent the audio from playing when the ball enters
              if (ballRef.current && ballRef.current.translation().y >= 0.1)
                audio = 'bounce'
              break

            case 'ring':
              audio = 'ring'
              break
          }

          audio && setAudioToPlay(audio)
        }}
      >
        <Sphere
          args={[0.3, settings.roundSegments, settings.roundSegments]}
          rotation={randomRotation}
          material={material}
          castShadow
        />
      </RigidBody>
    )
  },
)

Ball.displayName = 'Ball'
