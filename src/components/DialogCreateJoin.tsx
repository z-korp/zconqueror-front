import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DialogCreateJoinProps {
  onClick: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  dialogTitle: string;
  buttonText: string;
  buttonTextDisplayed: string;
}

export function DialogCreateJoin({
  onClick,
  playerName,
  setPlayerName,
  dialogTitle,
  buttonText,
  buttonTextDisplayed,
}: DialogCreateJoinProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tertiary" className="hover:bg-green-600">
          {buttonTextDisplayed}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center">
          <div className="grid flex-1">
            <Label htmlFor="nickname" className="sr-only">
              nickname
            </Label>
            <Input
              id="nickname"
              className="w-full"
              type="text"
              placeholder="Enter Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button onClick={onClick} variant="tertiary" className="hover:bg-green-600">
              {buttonText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
