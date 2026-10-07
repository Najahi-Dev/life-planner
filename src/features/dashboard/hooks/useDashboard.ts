import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { dashboardService, DashboardSummaryData } from '../services/dashboardService';
import { hapticFeedback } from '@/utils/haptics';

export function useDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const dashboardQuery = useQuery<DashboardSummaryData>({
    queryKey: ['dashboardSummary', userId],
    queryFn: () => dashboardService.getDashboardSummary(userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, currentStatus }: { taskId: string; currentStatus: string }) =>
      dashboardService.toggleTaskStatus(userId, taskId, currentStatus),
    onMutate: async ({ taskId, currentStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboardSummary', userId] });
      const previousData = queryClient.getQueryData<DashboardSummaryData>(['dashboardSummary', userId]);

      if (previousData) {
        const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const updatedTasks = previousData.todayTasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus as any } : t,
        );

        queryClient.setQueryData<DashboardSummaryData>(['dashboardSummary', userId], {
          ...previousData,
          todayTasks: updatedTasks,
        });
      }

      if (currentStatus !== 'completed') {
        hapticFeedback.success();
      } else {
        hapticFeedback.light();
      }

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['dashboardSummary', userId], context.previousData);
      }
      hapticFeedback.error();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isRefetching: dashboardQuery.isRefetching,
    refetch: dashboardQuery.refetch,
    toggleTask: (taskId: string, currentStatus: string) =>
      toggleTaskMutation.mutate({ taskId, currentStatus }),
  };
}
