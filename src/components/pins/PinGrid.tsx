import { useState } from 'react';
import { Pin } from '@/types/MoodBoardZ';
import { PinCard } from './PinCard';
import { PinZoomModal } from './PinZoomModal';
import { Skeleton } from '@/components/ui/skeleton';

interface PinGridProps {
  pins: Pin[];
  isLoading: boolean;
  onEditPin: (pin: Pin) => void;
  onDeletePin: (id: string) => void;
}

export const PinGrid = ({ pins, isLoading, onEditPin, onDeletePin }: PinGridProps) => {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const handleZoom = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handleCloseZoom = () => {
    setSelectedPin(null);
  };

  if (isLoading) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="masonry-item">
            <Skeleton 
              className="w-full rounded-2xl" 
              style={{ height: `${Math.random() * 200 + 200}px` }} 
            />
          </div>
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <span className="text-4xl">📌</span>
        </div>
        <h3 className="font-display text-2xl font-semibold mb-2">No pins yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start creating your collection by adding your first pin!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {pins.map((pin, index) => (
          <PinCard
            key={pin._id}
            pin={pin}
            index={index}
            onEdit={onEditPin}
            onDelete={onDeletePin}
            onZoom={handleZoom}
          />
        ))}
      </div>

      <PinZoomModal
        pin={selectedPin}
        isOpen={!!selectedPin}
        onClose={handleCloseZoom}
      />
    </>
  );
};
