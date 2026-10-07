import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react-native';
import { Card, Chip, ProgressBar } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { UniExam } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { parseISO, differenceInDays } from 'date-fns';

export interface ExamCardProps {
  exam: UniExam;
  onUpdateProgress?: (examId: string, progress: number) => void;
  onDelete?: (examId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onUpdateProgress,
  onDelete,
}) => {
  const theme = useTheme();

  const getCountdown = () => {
    try {
      const today = new Date();
      const examDate = parseISO(exam.date);
      const days = differenceInDays(examDate, today);

      if (days < 0) {
        return { label: 'Completed', color: theme.colors.textMuted, bg: theme.colors.surfaceSubtle };
      }
      if (days === 0) {
        return { label: 'Exam Today! 🔥', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
      }
      if (days === 1) {
        return { label: 'Tomorrow ⚠️', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
      }
      return {
        label: `In ${days} Days`,
        color: theme.accent.primary,
        bg: theme.accent.primarySoft,
      };
    } catch {
      return { label: exam.date, color: theme.colors.textSecondary, bg: theme.colors.surfaceSubtle };
    }
  };

  const countdown = getCountdown();

  const handleIncrementProgress = (delta: number) => {
    const current = exam.revisionProgressPercent || 0;
    const next = Math.min(100, Math.max(0, current + delta));
    onUpdateProgress?.(exam.id, next);
  };

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(exam.id);
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Chip label={exam.courseCode} variant="category" category="uni" size="sm" />
          <View
            style={[
              styles.countdownBadge,
              { backgroundColor: countdown.bg, borderRadius: theme.radius.sm },
            ]}
          >
            <Clock size={11} color={countdown.color} style={{ marginRight: 3 }} />
            <Text
              style={[
                styles.countdownText,
                theme.typography.captionBold,
                { color: countdown.color },
              ]}
            >
              {countdown.label}
            </Text>
          </View>
        </View>

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Exam Title */}
      <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
        {exam.title}
      </Text>

      {/* Date, Time & Venue */}
      <View style={styles.detailsCol}>
        <View style={styles.detailItem}>
          <Calendar size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {exam.date} • {exam.time}
          </Text>
        </View>

        {exam.venue ? (
          <View style={[styles.detailItem, { marginTop: 3 }]}>
            <MapPin size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              {exam.venue}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Revision Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Revision Mastery
          </Text>
          <View style={styles.quickButtonsRow}>
            <Pressable
              onPress={() => handleIncrementProgress(10)}
              style={[
                styles.quickBtn,
                { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.xs },
              ]}
              hitSlop={4}
            >
              <Text style={[styles.quickBtnText, theme.typography.captionBold, { color: theme.accent.primary }]}>
                +10%
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleIncrementProgress(25)}
              style={[
                styles.quickBtn,
                { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.xs },
              ]}
              hitSlop={4}
            >
              <Text style={[styles.quickBtnText, theme.typography.captionBold, { color: theme.accent.primary }]}>
                +25%
              </Text>
            </Pressable>
          </View>
        </View>

        <ProgressBar
          progress={exam.revisionProgressPercent || 0}
          label={`${exam.revisionProgressPercent || 0}% Prepared`}
          showLabel
        />
      </View>

      {/* Topics to Cover */}
      {exam.topicsToCover && exam.topicsToCover.length > 0 && (
        <View style={styles.topicsSection}>
          <Text
            style={[
              styles.topicsHeader,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary },
            ]}
          >
            Core Topics:
          </Text>
          <View style={styles.topicsGrid}>
            {exam.topicsToCover.map((t, idx) => (
              <View
                key={idx}
                style={[
                  styles.topicChip,
                  { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
                ]}
              >
                <BookOpen size={11} color={theme.accent.primary} style={{ marginRight: 4 }} />
                <Text
                  style={[theme.typography.caption, { color: theme.colors.text, fontSize: 12 }]}
                  numberOfLines={1}
                >
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    width: '100%',
  },
  topRow: {
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
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countdownText: {
    fontSize: 11,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    marginTop: 2,
    marginBottom: 6,
  },
  detailsCol: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  quickBtnText: {
    fontSize: 11,
  },
  topicsSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  topicsHeader: {
    marginBottom: 6,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
