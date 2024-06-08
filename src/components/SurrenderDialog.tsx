import { Flag } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useElementStore } from '@/utils/store';
import { useDojo } from '@/dojo/useDojo';

const SurrenderDialog = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const surrender = async () => {
    if (game_id) await play.surrender(account, game_id);
  };

  return (
    <div>
      <div>
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Flag />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-0 font-vt323">Surrender</TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-md bg-stone-700 border-2 border-black">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Do you confirm you want to surrender?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <DialogClose asChild>
                <Button variant="destructive" className="m-4 gap-2" onClick={surrender}>
                  Yes I want to surrender !
                  <Flag />
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SurrenderDialog;
