import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar as MonthCalendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { Briefcase } from 'lucide-react-native';
import { ShiftCard } from './ShiftCard';
import { Card, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { WorkShift } from '@/types';
import { ShiftConflict } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export interface ShiftCalendarViewProps {
  shifts: WorkShift[];
  conflicts: ShiftConflict[];
  onDeleteShift: (shiftId: string) => void;
  onAddShift: () => void;
}

export const ShiftCalendarView: React.FC<ShiftCalendarViewProps> = ({
  shifts,
  conflicts,
  onDeleteShift,
  onAddShift,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates: Record<string, any> = {};

  shifts.forEach((s) => {
    const isConflictDate = conflicts.some((c) => c.date === s.date);
    markedDates[s.date] = {
      marked: true,
      dotColor: isConflictDate ? '#EF4444' : theme.accent.primary,
    };
  });

  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: theme.accent.primary,
    selectedTextColor: '#FFFFFF',
  };

  const dayShifts = shifts.filter((s) => s.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Month Calendar */}
      <Card variant="elevated" style={styles.calendarCard}>
        <MonthCalendar
          key={theme.isDark ? 'dark' : 'light'}
          current={selectedDate}
          onDayPress={(day: any) => {
            hapticFeedback.selection();
            setSelectedDate(day.dateString);
          }}
          markedDates={markedDates}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: theme.colors.textSecondary,
            selectedDayBackgroundColor: theme.accent.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: theme.accent.primary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.textMuted,
            dotColor: theme.accent.primary,
            selectedDotColor: '#ffffff',
            arrowColor: theme.accent.primary,
            monthTextColor: theme.colors.text,
            textDayFontFamily: 'Inter_500Medium',
            textMonthFontFamily: 'Inter_700Bold',
            textDayHeaderFontFamily: 'Inter_600SemiBold',
            textDayFontSize: 15,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        />
      </Card>

      {/* Selected Day Agenda Header */}
      <View style={styles.agendaHeader}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
          Shifts for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </Text>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {dayShifts.length} {dayShifts.length === 1 ? 'Shift' : 'Shifts'}
        </Text>
      </View>

      {/* Shifts List for Selected Day */}
      {dayShifts.length === 0 ? (
        <EmptyState
          title="No Shifts Scheduled"
          description={`You have no work shifts on ${format(parseISO(selectedDate), 'MMMM d')}.`}
          actionTitle="Add Work Shift"
          onAction={onAddShift}
          icon={<Briefcase size={36} color={theme.accent.primary} />}
          style={{ marginTop: 12 }}
        />
      ) : (
        <View style={styles.shiftsList}>
          {dayShifts.map((shift) => {
            const hasConflict = conflicts.some(
              (c) => c.shiftA.id === shift.id || c.shiftB.id === shift.id,
            );
            return (
              <ShiftCard
                key={shift.id}
                shift={shift}
                hasConflict={hasConflict}
                onDelete={onDeleteShift}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  calendarCard: {
    padding: 10,
    marginBottom: 16,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftsList: {
    width: '100%',
  },
});
