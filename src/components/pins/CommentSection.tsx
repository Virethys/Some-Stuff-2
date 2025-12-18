import { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/MoodBoardZ';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  pinId: string;
}

export const CommentSection = ({ pinId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { comments, isLoading, createComment, deleteComment, isCreating } = useComments(pinId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    createComment(newComment.trim());
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments ({comments.length})</h3>
      
      {/* Comment List */}
      <ScrollArea className="h-[200px]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment: Comment) => (
              <div key={comment._id} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {comment.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.userId?.username || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    {user && (user._id === comment.userId?._id || user.role === 'admin') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteComment(comment._id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground break-words">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={!newComment.trim() || isCreating}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please login to comment.
        </p>
      )}
    </div>
  );
};
