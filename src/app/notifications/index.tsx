import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Bell,
  CheckCheck,
  BellRing,
  Sparkles,
  Inbox,
} from 'lucide-react-native';
import {
  Header,
  Button,
  EmptyState,
  SkeletonList,
  ConfettiCelebration,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import {
  NotificationItemCard,
  NotificationFilterBar,
} from '@/features/notifications/components';
import { NotificationFilter, InAppNotification } from '@/features/notifications/types';
import { hapticFeedback } from '@/utils/haptics';

export default function NotificationsScreen() {
  const theme = useTheme();
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefetching,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendTestNotification,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  const handleMarkAllRead = async () => {
    hapticFeedback.success();
    await markAllAsRead();
  };

  const handleTestPush = async () => {
    await sendTestNotification(
      'Spaced Repetition Due 🧠',
      'Time to review "Operating Systems & Concurrency" to maintain your 5-day streak!',
    );
    setCelebrationMsg('Test Notification Delivered! 🔔');
    setCelebrationVisible(true);
  };

  const handleNotificationPress = async (notification: InAppNotification) => {
    hapticFeedback.light();
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Deep link to corresponding tab
    switch (notification.targetType) {
      case 'learning':
        router.push('/(tabs)/learn' as any);
        break;
      case 'shift':
        router.push('/(tabs)/schedule' as any);
        break;
      case 'assignment':
      case 'exam':
        router.push('/(tabs)/uni' as any);
        break;
      case 'event':
        router.push('/events' as any);
        break;
      case 'task':
      default:
        router.push('/(tabs)/plans' as any);
        break;
    }
  };

  // Filter notifications based on active selection
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'push') return n.channel === 'push' || n.channel === 'both';
    if (activeFilter === 'sms') return n.channel === 'sms' || n.channel === 'both';
    return true;
  });

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* App Header */}
      <Header
        title="Notifications Inbox"
        subtitle={`${unreadCount} unread reminders`}
        showBack
        rightAction={
          unreadCount > 0 ? (
            <Pressable
              onPress={handleMarkAllRead}
              hitSlop={8}
              style={[
                styles.markAllBtn,
                {
                  backgroundColor: theme.colors.surfaceSubtle,
                  borderRadius: theme.radius.button,
                },
              ]}
            >
              <CheckCheck size={20} color={theme.accent.primary} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.accent.primary}
            colors={[theme.accent.primary]}
          />
        }
      >
        {/* Test Notification Banner Button */}
        <View style={styles.testBanner}>
          <Button
            title="Send Test Push Notification"
            onPress={handleTestPush}
            variant="outline"
            size="secondary"
            leftIcon={<BellRing size={16} color={theme.accent.primary} />}
          />
        </View>

        {/* Filter Chip Bar */}
        <NotificationFilterBar
          filter={activeFilter}
          onChangeFilter={setActiveFilter}
          unreadCount={unreadCount}
        />

        {/* Loading State */}
        {isLoading && notifications.length === 0 ? (
          <SkeletonList count={4} itemHeight={90} />
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItemCard
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
              onDelete={(id) => deleteNotification(id)}
            />
          ))
        ) : (
          <EmptyState
            title="No notifications found"
            description="You are completely up to date with your reminders, schedules, and deadlines!"
            icon={<Inbox size={36} color={theme.accent.primary} />}
            actionTitle="Send Test Notification"
            onAction={handleTestPush}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Confetti Celebration Modal */}
      <ConfettiCelebration
        visible={celebrationVisible}
        message={celebrationMsg}
        onFinish={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  markAllBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBanner: {
    marginBottom: 12,
  },
});
