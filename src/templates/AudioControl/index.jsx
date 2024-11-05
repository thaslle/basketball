import { useEffect, useRef } from 'react';
import { useAudioManager } from '../../store/AudioManager';

const audios = {
  background: new Audio('/audios/background.mp3'),
  backboard: new Audio('/audios/backboard.mp3'),
  bounce: new Audio('/audios/bounce.mp3'),
  buzzer: new Audio('/audios/buzzer.mp3'),
  success: new Audio('/audios/success.mp3'),
  fail: new Audio('/audios/fail.mp3'),
  ring: new Audio('/audios/ring.mp3'),
  swish: new Audio('/audios/swish.mp3'),
  throw: new Audio('/audios/throw.mp3'),
};

export const AudioControl = () => {
  const { audioToPlay, audioEnabled, lastAudioPlayed, backgroundPlay, setLastAudioPlayed } = useAudioManager();

  const playAudio = (action, force = true) => {
    if (!audioEnabled) return;
    if (!force && Date.now() - lastAudioPlayed < 100) return;

    setLastAudioPlayed(Date.now());

    const audio = audios[action];
    audio && audio.play();
  };

  const background = useRef(audios['background']);
  useEffect(() => {
    if (backgroundPlay) {
      background.current.currentTime = 0;
      background.current.play();
      background.current.loop = true;
    } else {
      background.current.pause();
    }
  }, [backgroundPlay]);

  useEffect(() => {
    playAudio(audioToPlay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioToPlay]);
};
