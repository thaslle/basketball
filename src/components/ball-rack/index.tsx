import { useRef, useEffect, useMemo, createRef, useState } from 'react'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { RapierCollider, RapierRigidBody } from '@react-three/rapier'
import { Ball, BallImperativeHandle } from './ball'
import { Rack } from './rack'

import { useShootingStore, UserShot } from '~/store/use-shooting-store'
import { settings } from '~/lib/config'
import { getRackIndex } from '~/lib/utils'
import { racksPositions } from './rack/positions'
import BallMaterial from './ball/ball-material'

type BallRackProps = {
  ringRef: React.RefObject<RapierCollider>
}

type MouseTouchEvent = MouseEvent | TouchEvent

export const BallRack: React.FC<BallRackProps> = ({ ringRef }) => {
  const {
    balls,
    currentBall,
    userShot,
    lastShot,
    isPlaying,
    isShooting,
    isGameOver,
    isTimeUp,
    setUserShot,
  } = useShootingStore()

  const rackRefs = useRef(
    [...Array(settings.totalRacks)].map(() => createRef<RapierRigidBody>()),
  )
  const ballRefs = useRef(balls.map(() => createRef<BallImperativeHandle>()))
  const [resetCamera, setResetCamera] = useState(false)

  const racksPosition = useMemo(() => racksPositions(), [])
  const ballMaterial = BallMaterial()

  // Reset Camera when restart the game
  useEffect(() => {
    setResetCamera(!isPlaying && (isGameOver || isTimeUp))
  }, [isPlaying, isGameOver, isTimeUp])

  // Mouse movement to throw the ball
  const isClicking = useRef(false)
  const clickStart = useRef(0)
  const clickPosition = useRef<{ x: number; y: number }>()

  useEffect(() => {
    const onMouseDown = (e: MouseTouchEvent) => {
      isClicking.current = true
      clickStart.current = Date.now()
      const mouse = 'touches' in e ? e.touches[0] : e // Check for touch events
      clickPosition.current = { x: mouse.clientX, y: mouse.clientY }
    }

    const onMouseUp = (e: MouseTouchEvent) => {
      isClicking.current = false

      if (!clickStart.current || !clickPosition.current) return

      const finalTime = (Date.now() - clickStart.current) / 1000
      const mouse = 'changedTouches' in e ? e.changedTouches[0] : e // Check for touch events

      // The object that defines userShot
      const finalPosition: UserShot = {
        ball: currentBall,
        x: clickPosition.current.x - mouse.clientX,
        y: clickPosition.current.y - mouse.clientY,
        t: finalTime,
        time: Date.now(),
      }

      const timeSinceLastShot = lastShot ? (Date.now() - lastShot) / 1000 : 0
      if (
        Math.abs(finalPosition.y) > 0.02 &&
        finalTime > 0 &&
        timeSinceLastShot > settings.shotSpawnTime + 0.3 &&
        isPlaying === true &&
        ballRefs.current[currentBall]?.current
      ) {
        // The method throwBall inside the Ball component triggers the action
        // to throw the ball. I prefer this approach because it directly targets
        // the specific ball we want to throw. An alternative would be using an
        // useEffect hook to listen for userShot changes.
        // The downside is that with multiple balls, we need to check if
        // the current one is the one to throw.
        // After testing both methods, I decided to keep this approach.
        ballRefs.current[currentBall].current.throwBall(finalPosition)

        // And store the user shot
        setUserShot(finalPosition)
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchstart', onMouseDown)
    document.addEventListener('touchend', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchstart', onMouseDown)
      document.removeEventListener('touchend', onMouseUp)
    }
  }, [lastShot, currentBall, isPlaying])

  // Animation
  useFrame(({ camera }) => {
    const rackId = getRackIndex(currentBall)
    const rackRef = rackRefs.current[rackId]

    if (!rackRef.current || !ringRef.current) return

    const ballPos = rackRef.current.translation()
    const ringPos = ringRef.current.translation()

    if (!isShooting[currentBall] && isPlaying) {
      // Calculate the horizontal distance between the ball and the ring
      const dx = ballPos.x - ringPos.x
      const dz = ballPos.z - ringPos.z
      const distanceSquared = dx * dx + dz * dz // Squared distance to avoid repetitive sqrt calls
      const lastShotTime = userShot?.time ?? 0

      // Only move the camera if the distance is greater than 0.3 and enough time has passed since the shot
      if (
        distanceSquared > 0.09 &&
        ((Date.now() - lastShotTime) / 1000 > settings.shotSpawnTime ||
          userShot === null)
      ) {
        const initialDistance = Math.sqrt(distanceSquared)

        // Calculate the final distance, keeping within the camera's min distance
        const distance = Math.max(
          initialDistance + settings.cameraDistance,
          settings.cameraMinDistance,
        )

        // Normalize the direction vector (dx, dz) and calculate the camera's new position
        const factor = distance / initialDistance
        const newX = ballPos.x + dx * factor
        const newZ = ballPos.z + dz * factor

        // Smoothly move the camera to the new position
        camera.position.lerp(new Vector3(newX, settings.cameraPos.y, newZ), 0.1)
      }
    }

    if (resetCamera) {
      //Reset Camera
      camera.position.lerp(
        new Vector3(
          settings.cameraPos.x,
          settings.cameraPos.y,
          settings.cameraPos.z,
        ),
        0.1,
      )
    }
  })

  const rackElements = useMemo(() => {
    return [...Array(settings.totalRacks)].map((_, i) => {
      const rackPosition = new Vector3(
        racksPosition[i].x,
        0,
        racksPosition[i].z,
      )
      return (
        <Rack
          position={rackPosition}
          key={i}
          rackId={i}
          ref={rackRefs.current[i]}
        />
      )
    })
  }, [racksPosition, rackRefs])

  const ballElements = useMemo(() => {
    return balls.map((ball, i) => {
      if (ball.active) {
        const rackIndex = getRackIndex(i)

        const initialPosition = {
          x: racksPosition[rackIndex].x,
          y: 0.31,
          z: racksPosition[rackIndex].z,
        }

        return (
          <Ball
            ringRef={ringRef}
            key={i}
            initialPosition={initialPosition}
            ballId={i}
            ref={ballRefs.current[i]}
            material={ballMaterial}
          />
        )
      }
    })
  }, [currentBall, ringRef, ballRefs, balls, racksPosition])

  return (
    <>
      {rackElements}
      {ballElements}
    </>
  )
}
