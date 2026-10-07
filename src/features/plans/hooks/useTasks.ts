import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { taskService } from '../services/taskService';
import { TaskFormData } from '../schemas/taskSchemas';
import { TaskFilterOptions } from '../types';
import { TaskItem } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const [filters, setFilters] = useState<TaskFilterOptions>({
    status: 'all',
    priority: 'all',
    category: 'all',
    searchQuery: '',
    sortBy: 'dueDate',
  });

  const tasksQuery = useQuery<TaskItem[]>({
    queryKey: ['tasks', userId, filters],
    queryFn: () => taskService.fetchTasks(userId, filters),
    staleTime: 1000 * 60 * 2,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskFormData) => taskService.createTask(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<TaskFormData> }) =>
      taskService.updateTask(userId, taskId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(userId, taskId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, currentStatus }: { taskId: string; currentStatus: string }) =>
      taskService.toggleTaskStatus(userId, taskId, currentStatus),
    onMutate: async ({ taskId, currentStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', userId] });
      const prev = queryClient.getQueryData<TaskItem[]>(['tasks', userId, filters]);

      if (prev) {
        const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        queryClient.setQueryData<TaskItem[]>(
          ['tasks', userId, filters],
          prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus as any } : t)),
        );
      }

      if (currentStatus !== 'completed') {
        hapticFeedback.success();
      } else {
        hapticFeedback.light();
      }

      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['tasks', userId, filters], context.prev);
      }
      hapticFeedback.error();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: (taskIds: string[]) => taskService.reorderTasks(userId, taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isRefetching: tasksQuery.isRefetching,
    refetch: tasksQuery.refetch,
    filters,
    setFilters,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTaskStatus: (taskId: string, currentStatus: string) =>
      toggleTaskMutation.mutate({ taskId, currentStatus }),
    reorderTasks: reorderTasksMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
  };
}
