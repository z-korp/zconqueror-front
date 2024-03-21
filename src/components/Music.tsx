import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Music as MusicIcon } from 'lucide-react';

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(new Audio('/music/lords_sounds.mp3'));

  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <Button onClick={togglePlay} variant="secondary">
        <MusicIcon />
      </Button>
    </div>
  );
};

export default Music;
