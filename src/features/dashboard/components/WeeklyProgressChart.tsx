import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface WeeklyProgressChartProps {
  stats: {
    day: string;
    completed: number;
    total: number;
  }[];
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ stats }) => {
  const theme = useTheme();

  const totalTasks = stats.reduce((acc, s) => acc + s.total, 0);
  const totalCompleted = stats.reduce((acc, s) => acc + s.completed, 0);
  const completionPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const maxDailyTasks = Math.max(1, ...stats.map((s) => s.total));

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Weekly Productivity
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            {totalCompleted} of {totalTasks} tasks completed
          </Text>
        </View>

        <View
          style={[
            styles.percentBadge,
            { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.sm },
          ]}
        >
          <TrendingUp size={14} color={theme.accent.primary} style={{ marginRight: 4 }} />
          <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
            {completionPercent}%
          </Text>
        </View>
      </View>

      {/* Bar Chart Visualization */}
      <View style={styles.chartContainer}>
        {stats.map((item, index) => {
          const isToday = index === (new Date().getDay() + 6) % 7; // Monday = 0
          const barHeightPercent = (item.total / maxDailyTasks) * 100;
          const completedHeightPercent = item.total > 0 ? (item.completed / item.total) * 100 : 0;

          return (
            <View key={item.day} style={styles.column}>
              <View
                style={[
                  styles.barTrack,
                  {
                    height: 100,
                    backgroundColor: theme.colors.surfaceSubtle,
                    borderRadius: theme.radius.xs,
                  },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${barHeightPercent}%`,
                      backgroundColor: theme.colors.surfaceHover,
                      borderRadius: theme.radius.xs,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.completedFill,
                      {
                        height: `${completedHeightPercent}%`,
                        backgroundColor: isToday ? theme.accent.primary : theme.accent.primaryLight,
                        borderRadius: theme.radius.xs,
                      },
                    ]}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.dayLabel,
                  isToday ? theme.typography.captionBold : theme.typography.caption,
                  {
                    color: isToday ? theme.accent.primary : theme.colors.textSecondary,
                  },
                ]}
              >
                {item.day}
              </Text>
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
    marginBottom: 16,
  },
  percentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 124,
    paddingTop: 8,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barTrack: {
    width: '100%',
    maxWidth: 28,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  completedFill: {
    width: '100%',
  },
  dayLabel: {
    marginTop: 6,
    fontSize: 12,
  },
});
