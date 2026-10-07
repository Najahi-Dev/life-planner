import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  Bell,
  MessageSquare,
  Smartphone,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  Briefcase,
  GraduationCap,
  Calendar,
} from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { InAppNotification } from '../types';
import { ReminderTargetType } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { formatDistanceToNow, parseISO } from 'date-fns';

export interface NotificationItemCardProps {
  notification: InAppNotification;
  onPress?: (notification: InAppNotification) => void;
  onDelete?: (notificationId: string) => void;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const theme = useTheme();

  const getTargetIcon = (type: ReminderTargetType) => {
    switch (type) {
      case 'learning':
        return <BookOpen size={16} color={theme.accent.primary} />;
      case 'shift':
        return <Briefcase size={16} color={theme.accent.primary} />;
      case 'assignment':
      case 'exam':
        return <GraduationCap size={16} color={theme.accent.primary} />;
      case 'event':
        return <Calendar size={16} color={theme.accent.primary} />;
      default:
        return <Bell size={16} color={theme.accent.primary} />;
    }
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getChannelBadge = () => {
    switch (notification.channel) {
      case 'sms':
        return { label: 'SMS', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
      case 'both':
        return { label: 'PUSH + SMS', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
      default:
        return { label: 'PUSH', color: theme.accent.primary, bg: theme.accent.primarySoft };
    }
  };

  const channelBadge = getChannelBadge();

  const handleDelete = () => {
    hapticFeedback.light();
    onDelete?.(notification.id);
  };

  return (
    <Card
      variant={notification.read ? 'elevated' : 'outlined'}
      style={{
        ...styles.card,
        ...(!notification.read
          ? {
              borderColor: theme.accent.primary,
              backgroundColor: theme.isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
            }
          : {}),
      }}
      onPress={onPress ? () => onPress(notification) : undefined}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.targetBadge,
              { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.sm },
            ]}
          >
            {getTargetIcon(notification.targetType)}
          </View>

          <View
            style={[
              styles.channelBadge,
              { backgroundColor: channelBadge.bg, borderRadius: theme.radius.xs },
            ]}
          >
            <Text
              style={[
                styles.channelText,
                theme.typography.captionBold,
                { color: channelBadge.color },
              ]}
            >
              {channelBadge.label}
            </Text>
          </View>

          {!notification.read && (
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: theme.accent.primary },
              ]}
            />
          )}
        </View>

        <View style={styles.rightMeta}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {getTimeAgo()}
          </Text>

          {onDelete && (
            <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
              <Trash2 size={15} color={theme.colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Notification Title */}
      <Text
        style={[
          styles.title,
          notification.read ? theme.typography.bodyBold : theme.typography.heading,
          { color: theme.colors.text },
        ]}
      >
        {notification.title}
      </Text>

      {/* Body */}
      <Text
        style={[
          styles.body,
          theme.typography.body,
          { color: theme.colors.textSecondary },
        ]}
      >
        {notification.body}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  targetBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  channelText: {
    fontSize: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 2,
  },
  rightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 2,
  },
  title: {
    marginBottom: 4,
  },
  body: {
    lineHeight: 20,
  },
});
