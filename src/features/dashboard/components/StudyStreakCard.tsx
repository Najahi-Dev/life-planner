import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Flame, Clock } from 'lucide-react-native';
import { Card, ProgressRing } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface StudyStreakCardProps {
  streakDays: number;
  weeklyHours: number;
  goalHours: number;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  streakDays,
  weeklyHours,
  goalHours,
}) => {
  const theme = useTheme();

  const progressPercent = Math.min(100, Math.round((weeklyHours / goalHours) * 100));

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.contentRow}>
        <View style={styles.leftCol}>
          <View
            style={[
              styles.streakBadge,
              { backgroundColor: 'rgba(245, 158, 11, 0.14)', borderRadius: theme.radius.full },
            ]}
          >
            <Flame size={18} color="#F59E0B" />
            <Text style={[styles.streakText, theme.typography.captionBold, { color: '#F59E0B' }]}>
              {streakDays} Day Study Streak 🔥
            </Text>
          </View>

          <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
            Weekly Learning Goal
          </Text>

          <View style={styles.hoursRow}>
            <Clock size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                {weeklyHours}h
              </Text>{' '}
              of {goalHours}h target
            </Text>
          </View>
        </View>

        <View style={styles.ringWrapper}>
          <ProgressRing progress={progressPercent} size={76} strokeWidth={7} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  streakText: {
    marginLeft: 4,
  },
  title: {
    marginBottom: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
