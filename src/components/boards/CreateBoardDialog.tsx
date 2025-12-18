import { useState, useEffect } from 'react';
import { Board } from '@/types/MoodBoardZ';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (board: Omit<Board, '_id' | 'createdAt' | 'pins'>) => void;
  editBoard?: Board | null;
  isLoading?: boolean;
}

export const CreateBoardDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editBoard,
  isLoading,
}: CreateBoardDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (editBoard) {
      setName(editBoard.name);
      setDescription(editBoard.description || '');
      setIsPrivate(editBoard.isPrivate);
    } else {
      setName('');
      setDescription('');
      setIsPrivate(false);
    }
  }, [editBoard, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      isPrivate,
      userId: '1', // Mock user ID
    });

    setName('');
    setDescription('');
    setIsPrivate(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {editBoard ? 'Edit Board' : 'Create Board'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="boardName">Name</Label>
            <Input
              id="boardName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Like "Travel Inspiration" or "Recipes to Try"'
              className="rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="boardDescription">Description (optional)</Label>
            <Textarea
              id="boardDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this board about?"
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
            <div>
              <Label htmlFor="isPrivate" className="font-medium">
                Keep this board secret
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Only you can see this board
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl gradient-warm"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : editBoard ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
