import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { CheckSquare } from 'lucide-react-native';
import { TaskItemCard } from './TaskItemCard';
import { EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskItem } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export interface DailyViewProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  tasks,
  onToggleStatus,
  onDeleteTask,
  onAddTask,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate current week dates (Monday to Sunday)
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 14 }).map((_, i) => addDays(startWeek, i));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <View style={styles.container}>
      {/* 14-Day Horizontal Date Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStrip}
      >
        {weekDays.map((d) => {
          const isSelected = isSameDay(d, selectedDate);
          const isToday = isSameDay(d, new Date());
          const dateString = format(d, 'yyyy-MM-dd');
          const hasTasks = tasks.some((t) => t.dueDate === dateString);

          return (
            <Pressable
              key={dateString}
              onPress={() => {
                hapticFeedback.selection();
                setSelectedDate(d);
              }}
              style={[
                styles.dateCard,
                {
                  backgroundColor: isSelected
                    ? theme.accent.primary
                    : isToday
                    ? theme.accent.primarySoft
                    : theme.colors.surfaceSubtle,
                  borderRadius: theme.radius.button,
                  borderColor: isToday && !isSelected ? theme.accent.primary : 'transparent',
                  borderWidth: isToday && !isSelected ? 1 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  theme.typography.captionBold,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isToday
                      ? theme.accent.primary
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                {format(d, 'EEE')}
              </Text>

              <Text
                style={[
                  styles.numText,
                  theme.typography.heading,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isToday
                      ? theme.accent.primary
                      : theme.colors.text,
                  },
                ]}
              >
                {format(d, 'd')}
              </Text>

              {hasTasks && (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isSelected ? '#FFFFFF' : theme.accent.primary,
                    },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Day Summary Title */}
      <View style={styles.dayHeaderRow}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
          {format(selectedDate, 'EEEE, MMMM d')}
        </Text>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {dayTasks.length} {dayTasks.length === 1 ? 'Task' : 'Tasks'}
        </Text>
      </View>

      {/* Task List or Empty State */}
      {dayTasks.length === 0 ? (
        <EmptyState
          title="No Tasks for this Day"
          description={`Your agenda for ${format(selectedDate, 'MMMM d')} is completely clear.`}
          actionTitle="Create Task"
          onAction={onAddTask}
          icon={<CheckSquare size={36} color={theme.accent.primary} />}
          style={{ marginTop: 16 }}
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
  dateStrip: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 12,
  },
  dateCard: {
    width: 58,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 12,
    marginBottom: 2,
  },
  numText: {
    fontSize: 17,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
  },
  dayHeaderRow: {
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
