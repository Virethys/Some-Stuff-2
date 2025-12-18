import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Pin } from '@/types/MoodBoardZ';
import { useToast } from '@/hooks/use-toast';

export const usePins = (filters?: { boardId?: string; moods?: string[]; tag?: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const pinsQuery = useQuery({
    queryKey: ['pins', filters],
    queryFn: () => api.getPins(filters),
  });

  const createMutation = useMutation({
    mutationFn: (pin: Omit<Pin, '_id' | 'createdAt'>) => api.createPin(pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pins'] });
      toast({ title: 'Pin created successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to create pin', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Pin> }) => 
      api.updatePin(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pins'] });
      toast({ title: 'Pin updated successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to update pin', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pins'] });
      toast({ title: 'Pin deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to delete pin', variant: 'destructive' });
    },
  });

  return {
    pins: pinsQuery.data || [],
    isLoading: pinsQuery.isLoading,
    createPin: createMutation.mutate,
    updatePin: updateMutation.mutate,
    deletePin: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useUploadImage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => api.uploadImage(file),
    onError: () => {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    },
  });
};
