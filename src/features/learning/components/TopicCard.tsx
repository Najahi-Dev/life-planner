import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BookOpen, Clock, Repeat, Trash2, ExternalLink } from 'lucide-react-native';
import { Card, Chip, ProgressBar } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { LearningTopic } from '@/types';
import { SPACED_INTERVALS } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export interface TopicCardProps {
  topic: LearningTopic;
  onDelete?: (topicId: string) => void;
  onLogStudy?: (topic: LearningTopic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onDelete,
  onLogStudy,
}) => {
  const theme = useTheme();

  const intervalDays = SPACED_INTERVALS[topic.intervalIndex || 0] || 1;

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(topic.id);
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.badgeRow}>
            <Chip label={topic.category.toUpperCase()} variant="category" category="study" size="sm" />
            <View
              style={[
                styles.intervalBadge,
                { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.sm },
              ]}
            >
              <Repeat size={11} color={theme.accent.primary} style={{ marginRight: 3 }} />
              <Text style={[theme.typography.captionBold, { color: theme.accent.primary, fontSize: 11 }]}>
                {intervalDays}d Interval • #{topic.repetitions || 0}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
            {topic.title}
          </Text>
        </View>

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
            <Trash2 size={16} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={topic.progressPercent}
          label={`${topic.completedHours}h of ${topic.targetHours}h`}
          showLabel
        />
      </View>

      {/* Footer Info & Resources */}
      <View style={styles.footerRow}>
        <View style={styles.reviewInfo}>
          <Clock size={13} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Next review: {topic.nextReviewDate || 'Today'}
          </Text>
        </View>

        {topic.resources && topic.resources.length > 0 && (
          <View style={styles.resourcesInfo}>
            <ExternalLink size={13} color={theme.accent.primary} style={{ marginRight: 4 }} />
            <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
              {topic.resources.length} {topic.resources.length === 1 ? 'Resource' : 'Resources'}
            </Text>
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  intervalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  title: {
    marginTop: 2,
    lineHeight: 22,
  },
  deleteButton: {
    padding: 4,
  },
  progressSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  reviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourcesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
