import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useComments = (pinId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const commentsQuery = useQuery({
    queryKey: ['comments', pinId],
    queryFn: () => api.getComments(pinId),
    enabled: !!pinId,
  });

  const createMutation = useMutation({
    mutationFn: (text: string) => api.createComment(pinId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', pinId] });
    },
    onError: () => {
      toast({ title: 'Failed to add comment', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => api.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', pinId] });
    },
    onError: () => {
      toast({ title: 'Failed to delete comment', variant: 'destructive' });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    createComment: createMutation.mutate,
    deleteComment: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
