import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { TaskItemCard } from './TaskItemCard';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskItem } from '@/types';

export interface WeeklyViewProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  tasks,
  onToggleStatus,
  onDeleteTask,
}) => {
  const theme = useTheme();

  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startWeek, i));

  return (
    <View style={styles.container}>
      {weekDays.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isToday = isSameDay(day, new Date());
        const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

        return (
          <View key={dateStr} style={styles.daySection}>
            {/* Section Header */}
            <View style={styles.dayHeader}>
              <View style={styles.dayTitleRow}>
                <Text
                  style={[
                    theme.typography.heading,
                    { color: isToday ? theme.accent.primary : theme.colors.text },
                  ]}
                >
                  {format(day, 'EEEE')}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 8 }]}>
                  {format(day, 'MMM d')}
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor:
                      dayTasks.length > 0
                        ? theme.accent.primarySoft
                        : theme.colors.surfaceSubtle,
                    borderRadius: theme.radius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.captionBold,
                    {
                      color:
                        dayTasks.length > 0
                          ? theme.accent.primary
                          : theme.colors.textMuted,
                    },
                  ]}
                >
                  {dayTasks.length}
                </Text>
              </View>
            </View>

            {/* Task list for this day */}
            {dayTasks.length === 0 ? (
              <Card variant="flat" style={styles.emptyDayCard}>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  No tasks scheduled
                </Text>
              </Card>
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
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  taskList: {
    width: '100%',
  },
  emptyDayCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
