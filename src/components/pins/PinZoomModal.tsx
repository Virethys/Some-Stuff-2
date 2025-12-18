import { X, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Pin } from '@/types/MoodBoardZ';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommentSection } from './CommentSection';

interface PinZoomModalProps {
  pin: Pin | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PinZoomModal = ({ pin, isOpen, onClose }: PinZoomModalProps) => {
  if (!pin) return null;

  const username = typeof pin.userId === 'object' && pin.userId !== null 
    ? (pin.userId as { username?: string }).username 
    : 'User';

  const boardName = typeof pin.boardId === 'object' && pin.boardId !== null
    ? (pin.boardId as { name?: string }).name
    : 'Board';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideCloseButton className="max-w-5xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="md:w-1/2 bg-secondary flex items-center justify-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background z-10"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-full object-contain max-h-[50vh] md:max-h-[90vh]"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 flex flex-col">
            {/* Header Actions */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">0</span>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  {boardName}
                </Badge>
                <Button className="rounded-full gradient-warm text-primary-foreground font-semibold">
                  Save
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Title & Description */}
                <div>
                  <h1 className="font-display text-2xl font-bold mb-2">{pin.title}</h1>
                  {pin.description && (
                    <p className="text-muted-foreground">{pin.description}</p>
                  )}
                </div>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{username}</p>
                      <p className="text-sm text-muted-foreground">Creator</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    Follow
                  </Button>
                </div>

                {/* Moods & Tags */}
                {((pin.moods && pin.moods.length > 0) || (pin.tags && pin.tags.length > 0)) && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Moods & Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pin.moods?.map((mood) => (
                        <Badge key={mood} variant="secondary" className="rounded-full">
                          {mood}
                        </Badge>
                      ))}
                      {pin.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-6 border-t">
                  <CommentSection pinId={pin._id} />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
