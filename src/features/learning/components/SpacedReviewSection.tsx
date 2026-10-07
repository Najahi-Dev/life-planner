import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Repeat, CheckCircle2, BookOpen } from 'lucide-react-native';
import { Card, Button, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { LearningTopic } from '@/types';
import { SPACED_INTERVALS } from '../types';

export interface SpacedReviewSectionProps {
  dueTopics: LearningTopic[];
  onReviewTopic: (topicId: string) => void;
}

export const SpacedReviewSection: React.FC<SpacedReviewSectionProps> = ({
  dueTopics,
  onReviewTopic,
}) => {
  const theme = useTheme();

  if (dueTopics.length === 0) {
    return (
      <Card
        variant="outlined"
        style={{
          ...styles.container,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.06)',
        }}
      >
        <View style={styles.emptyRow}>
          <CheckCircle2 size={20} color="#10B981" />
          <Text style={[theme.typography.bodyBold, { color: '#10B981', marginLeft: 8 }]}>
            All caught up on spaced reviews today! 🎉
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Repeat size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Spaced Repetition Reviews
          </Text>
        </View>

        <View
          style={[
            styles.dueBadge,
            { backgroundColor: 'rgba(239, 68, 68, 0.14)', borderRadius: theme.radius.sm },
          ]}
        >
          <Text style={[theme.typography.captionBold, { color: '#EF4444' }]}>
            {dueTopics.length} Due Today
          </Text>
        </View>
      </View>

      <Text style={[styles.subtitle, theme.typography.caption, { color: theme.colors.textSecondary }]}>
        Review these topics to reinforce long-term memory retention before interval decays:
      </Text>

      <View style={styles.list}>
        {dueTopics.map((topic, index) => {
          const currentInterval = SPACED_INTERVALS[topic.intervalIndex || 0] || 1;
          const nextInterval =
            SPACED_INTERVALS[Math.min(SPACED_INTERVALS.length - 1, (topic.intervalIndex || 0) + 1)];

          return (
            <View
              key={topic.id}
              style={[
                styles.itemRow,
                index !== dueTopics.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.itemContent}>
                <View style={styles.badgeRow}>
                  <Chip label={topic.category.toUpperCase()} variant="category" category="study" size="sm" />
                  <Text style={[theme.typography.captionBold, { color: theme.accent.primary, marginLeft: 4 }]}>
                    Interval: {currentInterval}d ➔ {nextInterval}d
                  </Text>
                </View>

                <Text
                  style={[theme.typography.bodyBold, { color: theme.colors.text, marginTop: 2 }]}
                  numberOfLines={1}
                >
                  {topic.title}
                </Text>
              </View>

              <Button
                title="Mark Reviewed"
                onPress={() => onReviewTopic(topic.id)}
                variant="primary"
                size="sm"
                fullWidth={false}
                style={{ minWidth: 110 }}
              />
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
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subtitle: {
    marginBottom: 12,
  },
  list: {
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemContent: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
