import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import DynamicOverlayTuto from './DynamicOverlayTuto';
import { Map as MapLucid } from 'lucide-react';
import { useElementStore } from '@/utils/store';
import tutorialData from '../data/tutorialSteps.json';

const MapButton = () => {
  const { setContinentMode } = useElementStore((state) => state);

  return (
    <DynamicOverlayTuto tutorialStep="6" texts={tutorialData['6']}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            onMouseEnter={() => setContinentMode(true)} // Activates when the mouse enters the button area
            onMouseLeave={() => setContinentMode(false)} // Deactivates when the mouse leaves the button area
          >
            <MapLucid />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-0 font-vt323">Continents</TooltipContent>
      </Tooltip>
    </DynamicOverlayTuto>
  );
};

export default MapButton;
