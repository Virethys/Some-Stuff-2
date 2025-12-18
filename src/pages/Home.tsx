// ============================================
// HOME PAGE - Halaman utama menampilkan pins
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { PinCard } from '@/components/PinCard';
import { CreatePinModal } from '@/components/CreatePinModal';
import { pinAPI } from '@/api';
import { Pin, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check login status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch pins
  useEffect(() => {
    const fetchPins = async () => {
      try {
        setIsLoading(true);
        const data = await pinAPI.getAll();
        setPins(data);
      } catch (error) {
        toast({ title: 'Failed to load pins', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPins();
  }, [toast]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({ title: 'Logged out successfully' });
  };

  // Create click
  const handleCreateClick = () => {
    if (!user) {
      toast({ title: 'Please login first', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    setEditingPin(null);
    setModalOpen(true);
  };

  // Submit pin
  const handleSubmit = async (pinData: Omit<Pin, '_id' | 'createdAt' | 'userId'>) => {
    try {
      setIsSaving(true);
      if (editingPin) {
        const updated = await pinAPI.update(editingPin._id, pinData);
        setPins(pins.map((p) => (p._id === updated._id ? updated : p)));
        toast({ title: 'Pin updated!' });
      } else {
        const created = await pinAPI.create(pinData);
        setPins([created, ...pins]);
        toast({ title: 'Pin created!' });
      }
    } catch (error) {
      toast({ title: 'Failed to save pin', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Edit pin
  const handleEdit = (pin: Pin) => {
    setEditingPin(pin);
    setModalOpen(true);
  };

  // Delete pin
  const handleDelete = async (id: string) => {
    try {
      await pinAPI.delete(id);
      setPins(pins.filter((p) => p._id !== id));
      toast({ title: 'Pin deleted!' });
    } catch (error) {
      toast({ title: 'Failed to delete pin', variant: 'destructive' });
    }
  };

  // Filter pins by search
  const filteredPins = pins.filter((pin) =>
    searchQuery
      ? pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
        onCreateClick={handleCreateClick}
      />

      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          // Loading skeleton
          <div className="masonry-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="masonry-item">
                <Skeleton className="w-full rounded-2xl" style={{ height: 200 + Math.random() * 100 }} />
              </div>
            ))}
          </div>
        ) : filteredPins.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-2xl font-bold mb-2">No pins yet</h2>
            <p className="text-muted-foreground">Be the first to create a pin!</p>
          </div>
        ) : (
          // Pin grid
          <div className="masonry-grid">
            {filteredPins.map((pin) => (
              <PinCard
                key={pin._id}
                pin={pin}
                isOwner={user?._id === pin.userId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <CreatePinModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editPin={editingPin}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Home;
