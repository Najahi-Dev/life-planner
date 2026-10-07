import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Flame, Clock, Plus } from 'lucide-react-native';
import { Card, ProgressRing, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface StudyStreakHeaderProps {
  streakDays: number;
  weeklyHours: number;
  goalHours: number;
  onLogSession: () => void;
}

export const StudyStreakHeader: React.FC<StudyStreakHeaderProps> = ({
  streakDays,
  weeklyHours,
  goalHours,
  onLogSession,
}) => {
  const theme = useTheme();
  const progressPercent = Math.min(100, Math.round((weeklyHours / goalHours) * 100));

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.topRow}>
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

          <Text style={[styles.title, theme.typography.title, { color: theme.colors.text }]}>
            Mastery & Learning
          </Text>

          <View style={styles.hoursRow}>
            <Clock size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                {weeklyHours}h
              </Text>{' '}
              of {goalHours}h weekly goal
            </Text>
          </View>
        </View>

        <View style={styles.ringWrapper}>
          <ProgressRing progress={progressPercent} size={82} strokeWidth={8} />
        </View>
      </View>

      <Button
        title="Log Study Session"
        onPress={onLogSession}
        variant="primary"
        size="secondary"
        leftIcon={<Plus size={18} color="#FFFFFF" />}
        style={{ marginTop: 14 }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  streakText: {
    marginLeft: 4,
  },
  title: {
    marginBottom: 4,
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
