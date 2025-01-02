import { useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import s from './loading.module.scss'

type LoadingProps = {
  onProgress: (progress: number) => void
}

export const Loading = ({ onProgress }: LoadingProps) => {
  const { progress } = useProgress()

  useEffect(() => {
    onProgress(progress)
  }, [onProgress, progress])

  return (
    progress < 100 && (
      <div className={s.loader}>
        <div className={s.wrapper}>
          <div className={s.counter}>
            <div
              className={s.value}
              style={{ clipPath: `inset(0 ${100 - progress}% -10px 0)` }}
            >
              Loading
            </div>
          </div>
        </div>
      </div>
    )
  )
}
