import { useState, useRef } from 'react';
import { X, ImagePlus, Plus, Loader2 } from 'lucide-react';
import { Pin, MOODS, Mood } from '@/types/MoodBoardZ';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Board } from '@/types/MoodBoardZ';
import { uploadImage } from '@/services/api';

interface CreatePinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pin: Omit<Pin, '_id' | 'createdAt'>) => void;
  boards: Board[];
  editPin?: Pin | null;
  isLoading?: boolean;
  onCreateBoard?: () => void;
}

export const CreatePinDialog = ({
  open,
  onOpenChange,
  onSubmit,
  boards,
  editPin,
  isLoading,
  onCreateBoard,
}: CreatePinDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editPin?.imageUrl || '');
  const [title, setTitle] = useState(editPin?.title || '');
  const [description, setDescription] = useState(editPin?.description || '');
  const [boardId, setBoardId] = useState(editPin?.boardId || '');
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(editPin?.moods as Mood[] || []);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editPin?.tags || []);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !title || !boardId) return;

    try {
      setIsUploading(true);
      
      let finalImageUrl = imagePreview;
      
      // Upload gambar jika ada file baru (bukan URL existing)
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      onSubmit({
        title,
        description,
        imageUrl: finalImageUrl,
        boardId,
        tags,
        moods: selectedMoods.length > 0 ? selectedMoods : undefined,
        userId: '1',
      });

      // Reset form
      setImageFile(null);
      setImagePreview('');
      setTitle('');
      setDescription('');
      setBoardId('');
      setSelectedMoods([]);
      setTags([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {editPin ? 'Edit Pin' : 'Create New Pin'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Image Upload */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden",
              dragActive ? "border-primary bg-primary/5" : "border-border",
              imagePreview ? "p-0" : "p-8"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-80 object-contain rounded-xl"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-3 right-3 rounded-full"
                  onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium mb-1">Drag & drop or click to upload</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title"
              className="rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell everyone what your Pin is about"
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Board Select */}
          <div className="space-y-2">
            <Label>Board</Label>
            {boards.length === 0 ? (
              <div className="p-4 border border-dashed border-border rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Belum ada board. Buat board terlebih dahulu.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onCreateBoard?.();
                  }}
                  className="rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Board Baru
                </Button>
              </div>
            ) : (
              <Select value={boardId} onValueChange={setBoardId} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih board" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {boards.map((board) => (
                    <SelectItem key={board._id} value={board._id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Moods - Multi Select */}
          <div className="space-y-3">
            <Label>Moods (pilih satu atau lebih)</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((mood) => {
                const isSelected = selectedMoods.includes(mood.value);
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMoods(selectedMoods.filter(m => m !== mood.value));
                      } else {
                        setSelectedMoods([...selectedMoods, mood.value]);
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: mood.color }}
                    />
                    {mood.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="rounded-xl"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
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
              disabled={!imagePreview || !title || !boardId || isLoading || isUploading}
            >
              {isUploading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
              ) : isLoading ? (
                'Saving...'
              ) : editPin ? (
                'Update Pin'
              ) : (
                'Create Pin'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
