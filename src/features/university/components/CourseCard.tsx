import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BookOpen, User, Award, Trash2 } from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { UniCourse } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export interface CourseCardProps {
  course: UniCourse;
  onDelete?: (courseId: string) => void;
  onSelect?: (course: UniCourse) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onDelete,
  onSelect,
}) => {
  const theme = useTheme();

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(course.id);
  };

  return (
    <Card
      variant="elevated"
      style={styles.card}
      onPress={onSelect ? () => onSelect(course) : undefined}
    >
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.codeBadge,
                { backgroundColor: `${course.color || theme.accent.primary}20`, borderRadius: theme.radius.sm },
              ]}
            >
              <Text
                style={[
                  styles.codeText,
                  theme.typography.captionBold,
                  { color: course.color || theme.accent.primary },
                ]}
              >
                {course.code}
              </Text>
            </View>

            <View
              style={[
                styles.creditBadge,
                { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
              ]}
            >
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {course.credits} Credits • {course.semester}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
            {course.name}
          </Text>

          {course.lecturer ? (
            <View style={styles.lecturerRow}>
              <User size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {course.lecturer}
              </Text>
            </View>
          ) : null}
        </View>

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Grade Points & Target Display */}
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Target Grade:
          </Text>
          <View
            style={[
              styles.targetBadge,
              { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.xs },
            ]}
          >
            <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
              {course.targetGrade || 'A'}
            </Text>
          </View>
        </View>

        {course.achievedGrade ? (
          <View style={styles.gradeItem}>
            <Award size={14} color="#10B981" style={{ marginRight: 4 }} />
            <Text style={[theme.typography.captionBold, { color: '#10B981' }]}>
              Grade: {course.achievedGrade}
            </Text>
          </View>
        ) : (
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            In Progress
          </Text>
        )}
      </View>
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
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  codeText: {
    fontSize: 12,
  },
  creditBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  title: {
    marginBottom: 4,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
});
