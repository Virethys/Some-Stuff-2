import { Board, Pin } from '@/types/MoodBoardZ';
import { BoardCard } from './BoardCard';
import { Skeleton } from '@/components/ui/skeleton';

interface BoardGridProps {
  boards: Board[];
  pins: Pin[];
  isLoading: boolean;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (id: string) => void;
  onBoardClick: (board: Board) => void;
}

export const BoardGrid = ({
  boards,
  pins,
  isLoading,
  onEditBoard,
  onDeleteBoard,
  onBoardClick,
}: BoardGridProps) => {
  const getPinCount = (boardId: string) => {
    return pins.filter(pin => {
      const pinBoardId = typeof pin.boardId === 'object' && pin.boardId !== null
        ? (pin.boardId as { _id?: string })._id
        : pin.boardId;
      return pinBoardId === boardId;
    }).length;
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <span className="text-4xl">📁</span>
        </div>
        <h3 className="font-display text-2xl font-semibold mb-2">No boards yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Create your first board to start organizing your pins!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {boards.map((board, index) => (
        <BoardCard
          key={board._id}
          board={board}
          pinCount={getPinCount(board._id)}
          index={index}
          onEdit={onEditBoard}
          onDelete={onDeleteBoard}
          onClick={onBoardClick}
        />
      ))}
    </div>
  );
};
