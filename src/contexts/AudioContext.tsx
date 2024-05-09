import React, { createContext, useState, useContext, useRef, useEffect, ReactNode } from 'react';

type Sound = {
  audio: HTMLAudioElement;
  identifier: string;
};

type AudioSettingsContextType = {
  musicVolume: number;
  effectsVolume: number;
  playSound: (identifier: string) => void;
  updateMusicVolume: (volume: number) => void;
  updateEffectsVolume: (volume: number) => void;
};

const AudioSettingsContext = createContext<AudioSettingsContextType>({
  musicVolume: 0.5,
  effectsVolume: 0.5,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  playSound: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateMusicVolume: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateEffectsVolume: () => {},
});

export const AudioSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  const sounds = useRef<Record<string, Sound>>({
    bell: { audio: new Audio('/music/bell.mp3'), identifier: 'bell' },
    marching: { audio: new Audio('/music/marchingShort.mp3'), identifier: 'marching' },
    sword: { audio: new Audio('/music/sword.mp3'), identifier: 'sword' },
    backgroundMusic: { audio: new Audio('/music/lords_sounds.mp3'), identifier: 'backgroundMusic' },
  });

  // Update volumes
  useEffect(() => {
    sounds.current.backgroundMusic.audio.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    sounds.current.marching.audio.volume = effectsVolume;
    sounds.current.sword.audio.volume = effectsVolume;
    sounds.current.bell.audio.volume = effectsVolume;
  }, [effectsVolume]);

  const playSound = (identifier: string) => {
    sounds.current[identifier]?.audio.play().catch(console.error);
    if (identifier === 'backgroundMusic') {
      sounds.current.backgroundMusic.audio.loop = true;
    }
  };

  const updateMusicVolume = (volume: number) => {
    setMusicVolume(volume);
  };

  const updateEffectsVolume = (volume: number) => {
    setEffectsVolume(volume);
  };

  return (
    <AudioSettingsContext.Provider
      value={{
        musicVolume,
        effectsVolume,
        playSound,
        updateMusicVolume,
        updateEffectsVolume,
      }}
    >
      {children}
    </AudioSettingsContext.Provider>
  );
};

export const useAudioSettings = () => useContext(AudioSettingsContext);
