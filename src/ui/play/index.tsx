import { useRef, useState, useEffect } from 'react'
import { MathUtils } from 'three/src/math/MathUtils.js'

import s from './play.module.scss'

type PlayProps = {
  startGame: () => void
}

type MouseTouchEvent = MouseEvent | TouchEvent

export const Play = ({ startGame }: PlayProps) => {
  const isClicking = useRef(false)
  const clickPosition = useRef<{ x: number; y: number }>()
  const currentPosition = useRef({ x: 0, y: 0 })
  const [slideY, setSlideY] = useState(0)

  // Swipe up logics
  useEffect(() => {
    const onMouseDown = (e: MouseTouchEvent) => {
      isClicking.current = true
      const mouse = 'touches' in e ? e.touches[0] : e // Check for touch events
      clickPosition.current = { x: mouse.clientX, y: mouse.clientY }
      currentPosition.current = { ...clickPosition.current }
    }

    const onMouseUp = (e: MouseTouchEvent) => {
      isClicking.current = false

      if (clickPosition.current) {
        const mouse = 'changedTouches' in e ? e.changedTouches[0] : e // Check for touch events
        const finalPosition = {
          x: clickPosition.current.x - mouse.clientX,
          y: clickPosition.current.y - mouse.clientY,
        }

        if (Math.abs(finalPosition.y) > 0.02) startGame()
      }
    }

    const onMouseMove = (e: MouseTouchEvent) => {
      if (isClicking.current && clickPosition.current) {
        const mouse = 'touches' in e ? e.touches[0] : e // Check for touch events
        currentPosition.current = { x: mouse.clientX, y: mouse.clientY }

        const posY = MathUtils.lerp(
          currentPosition.current.y - clickPosition.current.y,
          0,
          0.6,
        )

        setSlideY(posY)
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchstart', onMouseDown)
    document.addEventListener('touchend', onMouseUp)
    document.addEventListener('touchmove', onMouseMove)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchstart', onMouseDown)
      document.removeEventListener('touchend', onMouseUp)
      document.removeEventListener('touchend', onMouseUp)
    }
  }, [startGame])

  return (
    <div className={s.start}>
      <div
        className={s.wrapper}
        style={{ transform: `translateY(${slideY}px)` }}
      >
        <div className={s.ball}></div>
        <div className={s.play}>Swipe up to play</div>
      </div>
    </div>
  )
}
