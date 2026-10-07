import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  CheckSquare,
  Upload,
} from 'lucide-react-native';
import { Card, Chip, ProgressBar, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { UniAssignment, AssignmentStatus } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { format, differenceInDays, parseISO } from 'date-fns';

export interface AssignmentCardProps {
  assignment: UniAssignment;
  onToggleChecklist?: (assignmentId: string, itemId: string) => void;
  onUpdateStatus?: (assignmentId: string, status: AssignmentStatus) => void;
  onDelete?: (assignmentId: string) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleChecklist,
  onUpdateStatus,
  onDelete,
}) => {
  const theme = useTheme();

  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'graded';

  // Compute countdown
  const getDueBadge = () => {
    try {
      const today = new Date();
      const dueDate = parseISO(assignment.dueDate);
      const daysDiff = differenceInDays(dueDate, today);

      if (isSubmitted) {
        return {
          label: 'Submitted 🎉',
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
        };
      }
      if (daysDiff < 0) {
        return {
          label: 'Overdue',
          color: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.12)',
        };
      }
      if (daysDiff === 0) {
        return {
          label: 'Due Today',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.12)',
        };
      }
      if (daysDiff === 1) {
        return {
          label: 'Due Tomorrow',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.12)',
        };
      }
      return {
        label: `Due in ${daysDiff} days`,
        color: theme.accent.primary,
        bg: theme.accent.primarySoft,
      };
    } catch {
      return {
        label: assignment.dueDate,
        color: theme.colors.textSecondary,
        bg: theme.colors.surfaceSubtle,
      };
    }
  };

  const dueBadge = getDueBadge();

  const handleToggleItem = (itemId: string) => {
    onToggleChecklist?.(assignment.id, itemId);
  };

  const handleSubmit = () => {
    hapticFeedback.success();
    onUpdateStatus?.(assignment.id, 'submitted');
  };

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(assignment.id);
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Chip label={assignment.courseCode} variant="category" category="uni" size="sm" />
          <View
            style={[
              styles.dueBadge,
              { backgroundColor: dueBadge.bg, borderRadius: theme.radius.sm },
            ]}
          >
            <Clock size={11} color={dueBadge.color} style={{ marginRight: 3 }} />
            <Text style={[styles.dueText, theme.typography.captionBold, { color: dueBadge.color }]}>
              {dueBadge.label}
            </Text>
          </View>
        </View>

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Assignment Title */}
      <Text
        style={[
          styles.title,
          theme.typography.heading,
          { color: theme.colors.text },
          isSubmitted && { textDecorationLine: 'line-through', opacity: 0.7 },
        ]}
      >
        {assignment.title}
      </Text>

      {/* Meta Information (Due time & Weight) */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {assignment.dueDate} {assignment.dueTime ? `at ${assignment.dueTime}` : ''}
          </Text>
        </View>

        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          Weight: {assignment.weightPercent}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={assignment.progressPercent}
          label={`${assignment.progressPercent}% Complete`}
          showLabel
        />
      </View>

      {/* Checklist Sub-tasks */}
      {assignment.checklist && assignment.checklist.length > 0 && (
        <View style={styles.checklistContainer}>
          <Text
            style={[
              styles.checklistHeader,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary },
            ]}
          >
            Progress Checklist:
          </Text>

          {assignment.checklist.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleToggleItem(item.id)}
              style={({ pressed }) => [
                styles.checklistItem,
                pressed && { opacity: 0.7 },
              ]}
              hitSlop={4}
            >
              {item.completed ? (
                <CheckCircle2 size={18} color="#10B981" />
              ) : (
                <Circle size={18} color={theme.colors.borderSubtle} />
              )}
              <Text
                style={[
                  styles.checkTitle,
                  theme.typography.body,
                  {
                    color: item.completed ? theme.colors.textSecondary : theme.colors.text,
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Notes / Submission Instructions */}
      {assignment.notes ? (
        <Text
          style={[styles.notesText, theme.typography.caption, { color: theme.colors.textMuted }]}
        >
          {assignment.notes}
        </Text>
      ) : null}

      {/* Submit / Mark Complete Action */}
      {!isSubmitted && (
        <Button
          title="Mark Assignment Submitted"
          onPress={handleSubmit}
          variant="outline"
          size="sm"
          leftIcon={<Upload size={15} color={theme.accent.primary} />}
          style={{ marginTop: 10 }}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dueText: {
    fontSize: 11,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    marginTop: 2,
    marginBottom: 4,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressSection: {
    marginVertical: 4,
  },
  checklistContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  checklistHeader: {
    marginBottom: 6,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkTitle: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  notesText: {
    marginTop: 6,
    fontStyle: 'italic',
  },
});
