import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pin, MOODS, Mood } from '@/types/MoodBoardZ';

interface EditPinDialogProps {
  pin: Pin | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Pin>) => void;
  isLoading?: boolean;
}

export const EditPinDialog = ({ pin, isOpen, onClose, onSave, isLoading }: EditPinDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
      setDescription(pin.description || '');
      setTags(pin.tags?.join(', ') || '');
      setSelectedMoods((pin.moods as Mood[]) || []);
    }
  }, [pin]);

  const handleMoodToggle = (mood: Mood) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      title,
      description,
      tags: tagArray,
      moods: selectedMoods,
    });
  };

  if (!pin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pin title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, minimal, modern"
            />
          </div>

          <div className="space-y-2">
            <Label>Moods</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {MOODS.map(mood => (
                <Badge
                  key={mood.value}
                  variant={selectedMoods.includes(mood.value) ? 'default' : 'outline'}
                  className="cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedMoods.includes(mood.value) ? mood.color : undefined,
                    borderColor: mood.color,
                  }}
                  onClick={() => handleMoodToggle(mood.value)}
                >
                  {mood.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
