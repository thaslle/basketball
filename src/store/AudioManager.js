import { create } from 'zustand';

export const useAudioManager = create((set) => ({
  audioToPlay: null,
  audioEnabled: false,
  backgroundPlay: false,
  lastAudioPlayed: Date.now(),

  setAudioToPlay: (audio) => set(() => ({ audioToPlay: audio })),
  setBackgroundPlay: (enabled) => set(() => ({ backgroundPlay: enabled })),
  setAudioEnabled: (enabled) => set(() => ({ audioEnabled: enabled })),
  setLastAudioPlayed: (time) => set(() => ({ lastAudioPlayed: time })),
}));
