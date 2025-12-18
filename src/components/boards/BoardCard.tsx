import { useState } from 'react';
import { MoreHorizontal, Lock, Edit2, Trash2 } from 'lucide-react';
import { Board } from '@/types/MoodBoardZ';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
  pinCount: number;
  onEdit: (board: Board) => void;
  onDelete: (id: string) => void;
  onClick: (board: Board) => void;
  index: number;
}

export const BoardCard = ({ board, pinCount, onEdit, onDelete, onClick, index }: BoardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(board)}
    >
      <div className="pin-card rounded-3xl overflow-hidden bg-card group">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {board.coverImage ? (
            <img
              src={board.coverImage}
              alt={board.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500",
                isHovered && "scale-110"
              )}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <span className="text-5xl font-display font-bold text-muted-foreground/30">
                {board.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-foreground/30 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Actions */}
          <div
            className={cn(
              "absolute top-3 right-3 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(board)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(board._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Private Badge */}
          {board.isPrivate && (
            <div className="absolute top-3 left-3">
              <div className="bg-foreground/80 backdrop-blur-sm text-background rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold truncate">{board.name}</h3>
          {board.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {board.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {pinCount} pins
          </p>
        </div>
      </div>
    </div>
  );
};
