import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Chip } from '@/components/ui';
import { NotificationFilter } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export interface NotificationFilterBarProps {
  filter: NotificationFilter;
  onChangeFilter: (filter: NotificationFilter) => void;
  unreadCount: number;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  filter,
  onChangeFilter,
  unreadCount,
}) => {
  const filters: { label: string; value: NotificationFilter }[] = [
    { label: 'ALL NOTIFICATIONS', value: 'all' },
    { label: `UNREAD (${unreadCount})`, value: 'unread' },
    { label: 'PUSH ONLY', value: 'push' },
    { label: 'SMS ONLY', value: 'sms' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((f) => (
        <Chip
          key={f.value}
          label={f.label}
          selected={filter === f.value}
          onPress={() => {
            hapticFeedback.selection();
            onChangeFilter(f.value);
          }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
});
