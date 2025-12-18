// ============================================
// PIN DETAIL PAGE - Halaman detail satu pin
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { pinAPI } from '@/api';
import { Pin, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

const PinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [pin, setPin] = useState<Pin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check login status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch pin
  useEffect(() => {
    const fetchPin = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await pinAPI.getById(id);
        setPin(data);
      } catch (error) {
        toast({ title: 'Pin not found', variant: 'destructive' });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPin();
  }, [id, navigate, toast]);

  // Delete pin
  const handleDelete = async () => {
    if (!pin) return;
    try {
      await pinAPI.delete(pin._id);
      toast({ title: 'Pin deleted!' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  // Download image
  const handleDownload = async () => {
    if (!pin) return;
    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pin.title}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const isOwner = user && pin && user._id === pin.userId;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-10 rounded-full mb-4" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!pin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pin not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mb-4 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Content */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="bg-secondary">
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-6">
              {/* Actions */}
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-2">{pin.title}</h1>

              {/* Description */}
              {pin.description && (
                <p className="text-muted-foreground mb-4">{pin.description}</p>
              )}

              {/* Tags */}
              {pin.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {pin.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Date */}
              <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                Created {new Date(pin.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
