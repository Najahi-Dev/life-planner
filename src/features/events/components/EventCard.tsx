import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  Clock,
  MapPin,
  Bell,
  Trash2,
  Calendar,
} from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { CalendarEvent } from '@/types';
import { EVENT_TYPE_COLORS } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export interface EventCardProps {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onDelete,
}) => {
  const theme = useTheme();

  const typeConfig = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.personal;

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(event.id);
  };

  return (
    <Card
      variant="elevated"
      style={styles.card}
      onPress={onPress ? () => onPress(event) : undefined}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: typeConfig.bg, borderRadius: theme.radius.sm },
            ]}
          >
            <Text style={[styles.typeText, theme.typography.captionBold, { color: typeConfig.color }]}>
              {typeConfig.label.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.timeBadge,
              { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
            ]}
          >
            <Clock size={11} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[theme.typography.captionBold, { color: theme.colors.text }]}>
              {event.startTime} - {event.endTime}
            </Text>
          </View>
        </View>

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Event Title */}
      <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
        {event.title}
      </Text>

      {/* Date & Location */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {event.date}
          </Text>
        </View>

        {event.location ? (
          <View style={[styles.metaItem, { marginLeft: 12, flex: 1 }]}>
            <MapPin size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
            <Text
              style={[theme.typography.caption, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Notes / Details */}
      {event.notes ? (
        <Text
          style={[styles.notes, theme.typography.caption, { color: theme.colors.textMuted }]}
          numberOfLines={2}
        >
          {event.notes}
        </Text>
      ) : null}

      {/* Reminder footer */}
      {event.reminderMinutesBefore ? (
        <View style={styles.footerRow}>
          <Bell size={12} color={theme.accent.primary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.captionBold, { color: theme.accent.primary, fontSize: 11 }]}>
            Reminder set for {event.reminderMinutesBefore}m before start
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 11,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    marginTop: 2,
    marginBottom: 6,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
});
