// ============================================
// CREATE PIN MODAL - Form untuk membuat pin
// ============================================

import { useState, useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { Pin } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreatePinModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pin: Omit<Pin, '_id' | 'createdAt' | 'userId'>) => void;
  editPin?: Pin | null;
  isLoading?: boolean;
}

export const CreatePinModal = ({
  open,
  onClose,
  onSubmit,
  editPin,
  isLoading,
}: CreatePinModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState(editPin?.imageUrl || '');
  const [title, setTitle] = useState(editPin?.title || '');
  const [description, setDescription] = useState(editPin?.description || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editPin?.tags || []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !title) return;

    onSubmit({
      title,
      description,
      imageUrl: imagePreview,
      tags,
    });

    // Reset form
    setImagePreview('');
    setTitle('');
    setDescription('');
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editPin ? 'Edit Pin' : 'Create New Pin'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div
            className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-60 mx-auto rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Click to upload image</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell everyone about your pin"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (press Enter to add)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags..."
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-warm"
              disabled={!imagePreview || !title || isLoading}
            >
              {isLoading ? 'Saving...' : editPin ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
