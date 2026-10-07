import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { pushNotificationService } from '../services/pushNotificationService';
import { InAppNotification, NotificationFilter } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  // Fetch in-app notifications
  const notifQuery = useQuery<InAppNotification[]>({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.fetchNotifications(userId),
    staleTime: 1000 * 60,
  });

  // Automatically register device push token if user is signed in
  useEffect(() => {
    if (user?.uid) {
      pushNotificationService.registerForPushNotificationsAsync(user.uid).catch(() => {
        // Non-blocking
      });
    }
  }, [user?.uid]);

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(userId, notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });
      const prev = queryClient.getQueryData<InAppNotification[]>(['notifications', userId]);
      if (prev) {
        queryClient.setQueryData<InAppNotification[]>(
          ['notifications', userId],
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', userId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: (notifications: InAppNotification[]) =>
      notificationService.markAllAsRead(userId, notifications),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(userId, notificationId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const sendTestNotification = async (title?: string, body?: string) => {
    hapticFeedback.medium();
    await pushNotificationService.sendImmediateTestNotification(title, body);

    // Also add to in-app notifications inbox
    await notificationService.createNotification(userId, {
      targetType: 'task',
      targetId: 'test-1',
      title: title || 'Immediate Test Reminder 🔔',
      body: body || 'Test push notification delivered successfully!',
      channel: 'push',
      read: false,
    });

    queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
  };

  const notifications = notifQuery.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading: notifQuery.isLoading,
    isRefetching: notifQuery.isRefetching,
    refetch: notifQuery.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: () => markAllAsReadMutation.mutateAsync(notifications),
    deleteNotification: deleteNotificationMutation.mutateAsync,
    sendTestNotification,
  };
}
