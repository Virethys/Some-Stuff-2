import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Bookmark, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePins } from '@/hooks/usePins';
import { useBoards } from '@/hooks/useBoards';
import { PinGrid } from '@/components/pins/PinGrid';
import { BoardGrid } from '@/components/boards/BoardGrid';
import { PinZoomModal } from '@/components/pins/PinZoomModal';
import { EditPinDialog } from '@/components/pins/EditPinDialog';
import { Pin } from '@/types/MoodBoardZ';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pins, updatePin, deletePin, isUpdating } = usePins();
  const { boards } = useBoards();

  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);

  // Filter user's pins and boards
  const userPins = useMemo(() => {
    return pins.filter(pin => {
      const pinUserId = typeof pin.userId === 'object' ? (pin.userId as { _id: string })._id : pin.userId;
      return pinUserId === user?._id;
    });
  }, [pins, user]);

  const userBoards = useMemo(() => {
    return boards.filter(board => {
      const boardUserId = typeof board.userId === 'object' ? (board.userId as { _id: string })._id : board.userId;
      return boardUserId === user?._id;
    });
  }, [boards, user]);

  const handlePinZoom = (pin: Pin) => {
    setSelectedPin(pin);
    setIsZoomOpen(true);
  };

  const handlePinEdit = (pin: Pin) => {
    setEditingPin(pin);
  };

  const handleSaveEdit = (updates: Partial<Pin>) => {
    if (editingPin) {
      updatePin({ id: editingPin._id, updates });
      setEditingPin(null);
    }
  };

  const handlePinDelete = (pin: Pin) => {
    if (confirm('Are you sure you want to delete this pin?')) {
      deletePin(pin._id);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-semibold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Profile Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-3xl mb-4">
            {user.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 className="font-display text-2xl font-bold">{user.username}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold">{userPins.length}</span>
              <span className="text-muted-foreground ml-1">Pins</span>
            </div>
            <div>
              <span className="font-bold">{userBoards.length}</span>
              <span className="text-muted-foreground ml-1">Boards</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pins" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="pins" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Pins
            </TabsTrigger>
            <TabsTrigger value="boards" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Boards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pins" className="mt-6">
            {userPins.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't created any pins yet.</p>
                <Button className="mt-4" onClick={() => navigate('/')}>
                  Create your first pin
                </Button>
              </div>
            ) : (
              <PinGrid
                pins={userPins}
                isLoading={false}
                onEditPin={handlePinEdit}
                onDeletePin={(id) => handlePinDelete(pins.find(p => p._id === id) as Pin)}
              />
            )}
          </TabsContent>

          <TabsContent value="boards" className="mt-6">
            {userBoards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't created any boards yet.</p>
                <Button className="mt-4" onClick={() => navigate('/')}>
                  Create your first board
                </Button>
              </div>
            ) : (
              <BoardGrid 
                boards={userBoards} 
                pins={pins}
                isLoading={false}
                onEditBoard={() => {}}
                onDeleteBoard={() => {}}
                onBoardClick={() => {}}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <PinZoomModal
        pin={selectedPin}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />

      <EditPinDialog
        pin={editingPin}
        isOpen={!!editingPin}
        onClose={() => setEditingPin(null)}
        onSave={handleSaveEdit}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default Profile;
