import { create } from 'zustand'

type AudioManager = {
  audioToPlay: string | null
  audioEnabled: boolean
  backgroundPlay: boolean
  lastAudioPlayed: number

  setAudioToPlay: (audio: string) => void
  setBackgroundPlay: (enabled: boolean) => void
  setAudioEnabled: (enabled: boolean) => void
  setLastAudioPlayed: (time: number) => void
}

export const useAudioManager = create<AudioManager>((set) => ({
  audioToPlay: null,
  audioEnabled: false,
  backgroundPlay: false,
  lastAudioPlayed: Date.now(),

  setAudioToPlay: (audio) => set(() => ({ audioToPlay: audio })),
  setBackgroundPlay: (enabled) => set(() => ({ backgroundPlay: enabled })),
  setAudioEnabled: (enabled) => set(() => ({ audioEnabled: enabled })),
  setLastAudioPlayed: (time) => set(() => ({ lastAudioPlayed: time })),
}))
