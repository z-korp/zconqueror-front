import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface DialogCreateJoinProps {
  onClick: () => Promise<void>;
  playerName: string;
  setPlayerName: (name: string) => void;
  dialogTitle: string;
  buttonText: string;
  buttonTextDisplayed: string;
  hours?: number | null;
  setHours?: (hours: number) => void;
  minutes?: number;
  setMinutes?: (minutes: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  isCreating: boolean;
}

export function DialogCreateJoin({
  onClick,
  playerName,
  setPlayerName,
  dialogTitle,
  buttonText,
  buttonTextDisplayed,
  hours,
  setHours,
  minutes,
  setMinutes,
  limit,
  setLimit,
  isCreating,
}: DialogCreateJoinProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
      setIsOpen(false); // Close the dialog after the operation
    } catch (error) {
      console.error('Error executing onClick:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              disabled={loading}
              id="nickname"
              className="w-full"
              type="text"
              placeholder="Enter Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            {isCreating && (
              <>
                <Label htmlFor="timeToPlay" className="text-sm font-semibold text-white my-2 ml-3">
                  Time to Play
                </Label>
                <div className="flex space-x-2">
                  <Input
                    disabled={loading}
                    id="hours"
                    className="w-full"
                    type="number"
                    placeholder="Hours"
                    value={hours !== null ? hours : ''}
                    onChange={(e) => setHours && setHours(Number(e.target.value))}
                  />
                  <Input
                    disabled={loading}
                    id="minutes"
                    className="w-full"
                    type="number"
                    placeholder="Minutes"
                    value={minutes}
                    onChange={(e) => setMinutes && setMinutes(Number(e.target.value))}
                  />
                </div>
                <Label htmlFor="timeToPlay" className="text-sm font-semibold text-white my-2 ml-3">
                  Turns of the game
                </Label>
                <div className="flex space-x-2">
                  <Input
                    disabled={loading}
                    id="limit"
                    className="w-6/12"
                    type="number"
                    placeholder="Max turns"
                    value={limit}
                    onChange={(e) => setLimit && setLimit(Number(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            isLoading={loading}
            isDisabled={loading}
            onClick={handleClick}
            variant="tertiary"
            className="hover:bg-green-600"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
