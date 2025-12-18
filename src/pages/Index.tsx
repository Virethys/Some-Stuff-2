import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PinGrid } from '@/components/pins/PinGrid';
import { BoardGrid } from '@/components/boards/BoardGrid';
import { CreatePinDialog } from '@/components/pins/CreatePinDialog';
import { CreateBoardDialog } from '@/components/boards/CreateBoardDialog';
import { MoodFilter } from '@/components/filters/MoodFilter';
import { usePins } from '@/hooks/usePins';
import { useBoards } from '@/hooks/useBoards';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Pin, Board, Mood } from '@/types/MoodBoardZ';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Pin dialog state
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  
  // Board dialog state
  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // Fetch all pins for board counting
  const { pins: allPins } = usePins();
  
  const { pins, isLoading: pinsLoading, createPin, updatePin, deletePin, isCreating } = usePins({
    boardId: selectedBoard?._id,
    moods: selectedMoods.length > 0 ? selectedMoods : undefined,
  });

  const { boards, isLoading: boardsLoading, createBoard, updateBoard, deleteBoard, isCreating: isBoardCreating } = useBoards();

  const handleCreateClick = () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to create pins and boards',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (activeTab === 'boards') {
      setEditingBoard(null);
      setBoardDialogOpen(true);
    } else {
      setEditingPin(null);
      setPinDialogOpen(true);
    }
  };

  const handleEditPin = (pin: Pin) => {
    setEditingPin(pin);
    setPinDialogOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setBoardDialogOpen(true);
  };

  const handleBoardClick = (board: Board) => {
    setSelectedBoard(board);
    setActiveTab('home');
  };

  const handlePinSubmit = (pinData: Omit<Pin, '_id' | 'createdAt'>) => {
    if (editingPin) {
      updatePin({ id: editingPin._id, updates: pinData });
    } else {
      createPin(pinData);
    }
  };

  const handleBoardSubmit = (boardData: Omit<Board, '_id' | 'createdAt' | 'pins'>) => {
    if (editingBoard) {
      updateBoard({ id: editingBoard._id, updates: boardData });
    } else {
      createBoard(boardData);
    }
  };

  const filteredPins = pins.filter(pin => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pin.title.toLowerCase().includes(query) ||
        pin.description?.toLowerCase().includes(query) ||
        pin.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCreateClick={handleCreateClick}
        onSearch={setSearchQuery}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedBoard(null);
        }}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb when viewing board */}
        {selectedBoard && (
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button
              onClick={() => setSelectedBoard(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              All Boards
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{selectedBoard.name}</span>
          </div>
        )}

        {/* Mood Filter for home/explore */}
        {(activeTab === 'home' || activeTab === 'explore') && !selectedBoard && (
          <div className="mb-6">
            <MoodFilter
              selectedMoods={selectedMoods}
              onMoodsChange={setSelectedMoods}
            />
          </div>
        )}

        {/* Content */}
        {activeTab === 'boards' ? (
          <BoardGrid
            boards={boards}
            pins={allPins}
            isLoading={boardsLoading}
            onEditBoard={handleEditBoard}
            onDeleteBoard={deleteBoard}
            onBoardClick={handleBoardClick}
          />
        ) : (
          <PinGrid
            pins={filteredPins}
            isLoading={pinsLoading}
            onEditPin={handleEditPin}
            onDeletePin={deletePin}
          />
        )}
      </main>

      {/* Dialogs */}
      <CreatePinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        onSubmit={handlePinSubmit}
        editPin={editingPin}
        boards={boards}
        isLoading={isCreating}
        onCreateBoard={() => setBoardDialogOpen(true)}
      />

      <CreateBoardDialog
        open={boardDialogOpen}
        onOpenChange={setBoardDialogOpen}
        onSubmit={handleBoardSubmit}
        editBoard={editingBoard}
        isLoading={isBoardCreating}
      />
    </div>
  );
};

export default Index;
