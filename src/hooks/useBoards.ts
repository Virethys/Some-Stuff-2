import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Board } from '@/types/MoodBoardZ';
import { useToast } from '@/hooks/use-toast';

export const useBoards = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: api.getBoards,
  });

  const createMutation = useMutation({
    mutationFn: (board: Omit<Board, '_id' | 'createdAt' | 'pins'>) => api.createBoard(board),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({ title: 'Board created successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to create board', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Board> }) => 
      api.updateBoard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({ title: 'Board updated successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to update board', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({ title: 'Board deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to delete board', variant: 'destructive' });
    },
  });

  return {
    boards: boardsQuery.data || [],
    isLoading: boardsQuery.isLoading,
    createBoard: createMutation.mutate,
    updateBoard: updateMutation.mutate,
    deleteBoard: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
