import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import {
  Check,
  Clock,
  Repeat,
  Trash2,
} from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskItem } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export interface TaskItemCardProps {
  task: TaskItem;
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: TaskItem) => void;
}

export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isCompleted = task.status === 'completed';

  const handleToggle = () => {
    onToggleStatus(task.id, task.status);
  };

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(task.id);
  };

  return (
    <Card
      variant={isCompleted ? 'flat' : 'elevated'}
      style={{
        ...styles.card,
        ...(isCompleted ? { opacity: 0.75 } : {}),
      }}
    >
      <View style={styles.mainRow}>
        {/* Checkbox */}
        <Pressable
          onPress={handleToggle}
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

        {/* Task Content */}
        <View style={styles.contentCol}>
          <Pressable onPress={() => setExpanded((p) => !p)}>
            <Text
              style={[
                styles.title,
                theme.typography.bodyBold,
                {
                  color: isCompleted ? theme.colors.textMuted : theme.colors.text,
                  textDecorationLine: isCompleted ? 'line-through' : 'none',
                },
              ]}
            >
              {task.title}
            </Text>
          </Pressable>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            {task.dueTime && (
              <View style={styles.timeTag}>
                <Clock size={12} color={theme.colors.textSecondary} style={{ marginRight: 3 }} />
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  {task.dueTime}
                </Text>
              </View>
            )}

            {task.repeat !== 'none' && (
              <View style={styles.repeatTag}>
                <Repeat size={12} color={theme.accent.primary} style={{ marginRight: 3 }} />
                <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                  {task.repeat}
                </Text>
              </View>
            )}

            <Chip label={task.category.toUpperCase()} variant="category" category={task.category} size="sm" />
            <Chip label={task.priority.toUpperCase()} variant="priority" priority={task.priority} size="sm" />
          </View>
        </View>

        {/* Action button */}
        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Expanded Notes Section */}
      {expanded && task.notes ? (
        <View
          style={[
            styles.notesContainer,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderRadius: theme.radius.sm,
              marginTop: 10,
              padding: 10,
            },
          ]}
        >
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {task.notes}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    width: '100%',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  title: {
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  repeatTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesContainer: {
    width: '100%',
  },
});
