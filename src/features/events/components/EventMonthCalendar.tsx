import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { CalendarEvent } from '@/types';
import { eventService } from '../services/eventService';
import { hapticFeedback } from '@/utils/haptics';

export interface EventMonthCalendarProps {
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const EventMonthCalendar: React.FC<EventMonthCalendarProps> = ({
  events,
  selectedDate,
  onSelectDate,
}) => {
  const theme = useTheme();

  const markedDates = eventService.getMarkedDates(events, selectedDate);

  const handleDayPress = (day: { dateString: string }) => {
    hapticFeedback.selection();
    onSelectDate(day.dateString);
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markingType="multi-dot"
        markedDates={markedDates}
        enableSwipeMonths
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: theme.colors.textSecondary,
          selectedDayBackgroundColor: theme.accent.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: theme.accent.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.textMuted,
          monthTextColor: theme.colors.text,
          textMonthFontFamily: 'Inter_600SemiBold',
          textMonthFontSize: 16,
          textDayHeaderFontFamily: 'Inter_500Medium',
          textDayHeaderFontSize: 12,
          textDayFontFamily: 'Inter_400Regular',
          textDayFontSize: 14,
          arrowColor: theme.accent.primary,
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    padding: 8,
  },
});
