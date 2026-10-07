import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface StudyHoursChartProps {
  dailyData: {
    day: string;
    date: string;
    hours: number;
  }[];
  goalHours: number;
}

export const StudyHoursChart: React.FC<StudyHoursChartProps> = ({ dailyData, goalHours }) => {
  const theme = useTheme();

  const totalHours = dailyData.reduce((acc, d) => acc + d.hours, 0);
  const maxHours = Math.max(3, ...dailyData.map((d) => d.hours));

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <BarChart3 size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Study Hours Distribution
          </Text>
        </View>

        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {totalHours}h / {goalHours}h Goal
        </Text>
      </View>

      <View style={styles.chartArea}>
        {dailyData.map((item, index) => {
          const heightPercent = maxHours > 0 ? (item.hours / maxHours) * 100 : 0;
          const isToday = index === (new Date().getDay() + 6) % 7; // Monday index = 0

          return (
            <View key={item.day} style={styles.column}>
              <Text
                style={[
                  styles.hourText,
                  theme.typography.caption,
                  { color: item.hours > 0 ? theme.colors.text : 'transparent' },
                ]}
              >
                {item.hours > 0 ? `${item.hours}h` : ''}
              </Text>

              <View
                style={[
                  styles.barTrack,
                  {
                    height: 80,
                    backgroundColor: theme.colors.surfaceSubtle,
                    borderRadius: theme.radius.xs,
                  },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(4, heightPercent)}%`,
                      backgroundColor:
                        item.hours > 0
                          ? isToday
                            ? theme.accent.primary
                            : theme.accent.primaryLight
                          : 'transparent',
                      borderRadius: theme.radius.xs,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.dayLabel,
                  isToday ? theme.typography.captionBold : theme.typography.caption,
                  { color: isToday ? theme.accent.primary : theme.colors.textSecondary },
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
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  hourText: {
    fontSize: 10,
    marginBottom: 4,
    height: 14,
  },
  barTrack: {
    width: '100%',
    maxWidth: 24,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  dayLabel: {
    marginTop: 6,
    fontSize: 12,
  },
});
