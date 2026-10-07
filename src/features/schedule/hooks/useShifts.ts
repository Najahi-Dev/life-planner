import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { shiftService } from '../services/shiftService';
import { ShiftFormData } from '../schemas/shiftSchemas';
import { WorkShift } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export function useShifts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const shiftsQuery = useQuery<WorkShift[]>({
    queryKey: ['shifts', userId],
    queryFn: () => shiftService.fetchShifts(userId),
    staleTime: 1000 * 60 * 2,
  });

  const shifts = shiftsQuery.data || [];
  const conflicts = shiftService.detectConflicts(shifts);
  const weeklySummary = shiftService.calculateWeeklySummary(shifts);

  const createShiftMutation = useMutation({
    mutationFn: (data: ShiftFormData) => shiftService.createShift(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['shifts', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const updateShiftMutation = useMutation({
    mutationFn: ({ shiftId, data }: { shiftId: string; data: Partial<ShiftFormData> }) =>
      shiftService.updateShift(userId, shiftId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['shifts', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: (shiftId: string) => shiftService.deleteShift(userId, shiftId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['shifts', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  return {
    shifts,
    conflicts,
    weeklySummary,
    hasConflicts: conflicts.length > 0,
    isLoading: shiftsQuery.isLoading,
    isRefetching: shiftsQuery.isRefetching,
    refetch: shiftsQuery.refetch,
    createShift: createShiftMutation.mutateAsync,
    updateShift: updateShiftMutation.mutateAsync,
    deleteShift: deleteShiftMutation.mutateAsync,
    isCreating: createShiftMutation.isPending,
  };
}
