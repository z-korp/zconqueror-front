import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const MusicButton = () => {
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
    <Button onClick={togglePlay} variant="secondary">
      {isPlaying ? <Volume2 /> : <VolumeX />}
    </Button>
  );
};

export default MusicButton;
