import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { useAudioSettings } from '@/contexts/AudioContext';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const SoundsDialog = () => {
  const { musicVolume, effectsVolume, updateMusicVolume, updateEffectsVolume } = useAudioSettings();

  return (
    <div>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Volume2 />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-0 font-vt323">Sounds settings</TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-md bg-stone-700 border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-white text-3xl text-center">Sounds Settings</DialogTitle>
          </DialogHeader>

          <div className="flex flex-row items-center gap-5 ">
            <label className="text-gray-100 w-24">Music Volume</label>
            <Slider
              className="w-32"
              min={0}
              max={100}
              value={[Math.round(musicVolume * 100)]}
              onValueChange={(newValue: number[]) => updateMusicVolume(newValue[0] / 100)}
              shouldShowNumber={false}
            />
            {musicVolume !== 0 ? <Volume2 color="white" /> : <VolumeX color="white" />}
          </div>
          <div className="flex flex-row items-center gap-5 ">
            <label className="text-gray-100 w-24">Effects Volume</label>
            <Slider
              className="w-32"
              min={0}
              max={100}
              value={[Math.round(effectsVolume * 100)]}
              onValueChange={(newValue: number[]) => updateEffectsVolume(newValue[0] / 100)}
              shouldShowNumber={false}
            />
            {effectsVolume !== 0 ? <Volume2 color="white" /> : <VolumeX color="white" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoundsDialog;
