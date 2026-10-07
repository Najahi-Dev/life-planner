import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { eventService } from '../services/eventService';
import { EventFormData } from '../schemas/eventSchemas';
import { EventsSummaryData } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export function useEvents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const eventsQuery = useQuery<EventsSummaryData>({
    queryKey: ['eventsSummary', userId],
    queryFn: () => eventService.fetchEventsSummary(userId),
    staleTime: 1000 * 60 * 2,
  });

  const createEventMutation = useMutation({
    mutationFn: (data: EventFormData) => eventService.createEvent(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['eventsSummary', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Partial<EventFormData> }) =>
      eventService.updateEvent(userId, eventId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['eventsSummary', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(userId, eventId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['eventsSummary', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  return {
    data: eventsQuery.data,
    events: eventsQuery.data?.events || [],
    grouped: eventsQuery.data?.grouped,
    todayCount: eventsQuery.data?.todayCount || 0,
    upcomingThisWeekCount: eventsQuery.data?.upcomingThisWeekCount || 0,
    isLoading: eventsQuery.isLoading,
    isRefetching: eventsQuery.isRefetching,
    refetch: eventsQuery.refetch,
    createEvent: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
  };
}
