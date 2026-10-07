import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Check, Clock, Plus } from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskItem } from '@/types';

export interface TodayTasksListProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string, currentStatus: string) => void;
  onAddTask?: () => void;
}

export const TodayTasksList: React.FC<TodayTasksListProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const theme = useTheme();

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Today's Priority Tasks
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            {tasks.filter((t) => t.status === 'completed').length} of {tasks.length} completed
          </Text>
        </View>

        {onAddTask && (
          <Pressable
            onPress={onAddTask}
            hitSlop={8}
            style={[
              styles.addButton,
              { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.button },
            ]}
          >
            <Plus size={18} color={theme.accent.primary} />
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {tasks.map((task, index) => {
          const isCompleted = task.status === 'completed';

          return (
            <View
              key={task.id}
              style={[
                styles.taskRow,
                index !== tasks.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.borderSubtle,
                },
              ]}
            >
              {/* Checkbox */}
              <Pressable
                onPress={() => onToggleTask(task.id, task.status)}
                hitSlop={8}
                style={[
                  styles.checkbox,
                  {
                    borderRadius: theme.radius.sm,
                    borderColor: isCompleted ? theme.accent.primary : theme.colors.border,
                    backgroundColor: isCompleted ? theme.accent.primary : 'transparent',
                  },
                ]}
              >
                {isCompleted && <Check size={14} color="#FFFFFF" />}
              </Pressable>

              {/* Task Details */}
              <View style={styles.taskContent}>
                <Text
                  style={[
                    theme.typography.bodyBold,
                    {
                      color: isCompleted ? theme.colors.textMuted : theme.colors.text,
                      textDecorationLine: isCompleted ? 'line-through' : 'none',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>

                <View style={styles.tagsRow}>
                  {task.dueTime && (
                    <View style={styles.timeTag}>
                      <Clock size={12} color={theme.colors.textSecondary} style={{ marginRight: 3 }} />
                      <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                        {task.dueTime}
                      </Text>
                    </View>
                  )}

                  <Chip label={task.category.toUpperCase()} variant="category" category={task.category} size="sm" />
                  <Chip label={task.priority.toUpperCase()} variant="priority" priority={task.priority} size="sm" />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
});
