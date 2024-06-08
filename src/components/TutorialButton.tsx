import { BadgeHelp } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useTutorial } from '@/contexts/TutorialContext';

const TutorialButton = () => {
  const { setShowTuto } = useTutorial();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" onClick={() => setShowTuto(true)}>
          <BadgeHelp />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-0 font-vt323" side="top">
        Tutorial
      </TooltipContent>
    </Tooltip>
  );
};

export default TutorialButton;
