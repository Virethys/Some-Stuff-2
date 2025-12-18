// ============================================
// PIN CARD COMPONENT - Menampilkan satu pin
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Pin } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PinCardProps {
  pin: Pin;
  isOwner: boolean;
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
}

export const PinCard = ({ pin, isOwner, onEdit, onDelete }: PinCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="masonry-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="pin-card rounded-2xl overflow-hidden bg-card cursor-pointer"
        onClick={() => navigate(`/pin/${pin._id}`)}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full object-cover"
            loading="lazy"
          />

          {/* Overlay saat hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/30">
              {/* Menu button untuk owner */}
              {isOwner && (
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(pin)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(pin._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold truncate">{pin.title}</h3>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {pin.tags.length > 0 && (
          <div className="p-2 flex flex-wrap gap-1">
            {pin.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
