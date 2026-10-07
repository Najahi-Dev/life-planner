import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar as MonthCalendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { CheckSquare } from 'lucide-react-native';
import { TaskItemCard } from './TaskItemCard';
import { Card, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskItem } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export interface MonthlyViewProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  tasks,
  onToggleStatus,
  onDeleteTask,
  onAddTask,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Build marked dates map with dot indicators
  const markedDates: Record<string, any> = {};

  tasks.forEach((t) => {
    if (!markedDates[t.dueDate]) {
      markedDates[t.dueDate] = {
        marked: true,
        dotColor: theme.accent.primary,
      };
    }
  });

  // Selected date styling
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: theme.accent.primary,
    selectedTextColor: '#FFFFFF',
  };

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <View style={styles.container}>
      {/* Month Calendar Card */}
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
          Tasks for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </Text>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {dayTasks.length} {dayTasks.length === 1 ? 'Task' : 'Tasks'}
        </Text>
      </View>

      {/* Selected Day Tasks */}
      {dayTasks.length === 0 ? (
        <EmptyState
          title="No Tasks for this Date"
          description={`Nothing planned for ${format(parseISO(selectedDate), 'MMMM d')}.`}
          actionTitle="Create Task"
          onAction={onAddTask}
          icon={<CheckSquare size={36} color={theme.accent.primary} />}
          style={{ marginTop: 12 }}
        />
      ) : (
        <View style={styles.taskList}>
          {dayTasks.map((task) => (
            <TaskItemCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDelete={onDeleteTask}
            />
          ))}
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
    marginTop: 4,
  },
  taskList: {
    width: '100%',
  },
});
