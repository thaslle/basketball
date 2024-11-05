/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
// import { Stats } from '@react-three/drei';
import { Experience } from './components/Experience';
import { GameControl } from './templates/GameControl/';
import { AudioControl } from './templates/audioControl';

import { SETTINGS } from './config/config';
import { Loading } from './templates/Loading';

const App = () => {
  const [progress, setProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoadingComplete(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <Suspense fallback={<Loading onProgress={(p) => setProgress(p)} />}>
      <div style={{ visibility: isLoadingComplete ? 'visible' : 'hidden' }}>
        <Canvas
          shadows
          camera={{
            position: [SETTINGS.cameraPos.x, SETTINGS.cameraPos.y, SETTINGS.cameraPos.z],
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
            <Experience />
          </Physics>
          {/* <Stats /> */}
        </Canvas>
        <GameControl />
        <AudioControl />
      </div>
    </Suspense>
  );
};

export default App;
