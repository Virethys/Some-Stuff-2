import { useState } from 'react';
import { MoreHorizontal, Download, Edit2, Trash2 } from 'lucide-react';
import { Pin } from '@/types/MoodBoardZ';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface PinCardProps {
  pin: Pin;
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onZoom: (pin: Pin) => void;
  index: number;
}

export const PinCard = ({ pin, onEdit, onDelete, onZoom, index }: PinCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger zoom if clicking on dropdown or buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menu"]')) {
      return;
    }
    onZoom(pin);
  };

  return (
    <div
      className="masonry-item animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="pin-card rounded-2xl overflow-hidden bg-card group cursor-pointer">
        {/* Image Container */}
        <div className="relative">
          {!isLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className={cn(
              "w-full object-cover transition-all duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />

          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent transition-opacity duration-300",
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
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(pin)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(pin._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Save Button */}
          <div
            className={cn(
              "absolute top-3 left-3 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className="rounded-full gradient-warm text-primary-foreground font-semibold shadow-lg"
            >
              Save
            </Button>
          </div>

          {/* Title Overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <h3 className="font-display text-lg font-semibold text-primary-foreground line-clamp-2">
              {pin.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {pin.moods && pin.moods.slice(0, 2).map((mood) => (
              <Badge key={mood} variant="secondary" className="text-xs rounded-full">
                {mood}
              </Badge>
            ))}
            {pin.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs rounded-full">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
