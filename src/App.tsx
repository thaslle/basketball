import { Suspense, useEffect, useState } from 'react'
import { Experience } from './components/experience'
import { Loading } from './ui/loading'
import { GameControl } from './logics/game-control'
import { AudioControl } from './logics/audio-control'

const App = () => {
  const [progress, setProgress] = useState(0)
  const [isLoadingComplete, setIsLoadingComplete] = useState(true)

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoadingComplete(true)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <Suspense fallback={<Loading onProgress={(p) => setProgress(p)} />}>
      <div style={{ visibility: isLoadingComplete ? 'visible' : 'hidden' }}>
        <GameControl />
        <AudioControl />
        <Experience />
      </div>
    </Suspense>
  )
}

export default App

