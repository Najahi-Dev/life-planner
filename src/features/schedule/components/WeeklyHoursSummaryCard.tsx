import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Clock, DollarSign, Calendar } from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { WeeklyShiftSummary } from '../types';

export interface WeeklyHoursSummaryCardProps {
  summary: WeeklyShiftSummary;
}

export const WeeklyHoursSummaryCard: React.FC<WeeklyHoursSummaryCardProps> = ({ summary }) => {
  const theme = useTheme();

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Calendar size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Weekly Work Schedule
          </Text>
        </View>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {summary.weekStart} - {summary.weekEnd}
        </Text>
      </View>

      <View style={styles.statsRow}>
        {/* Total Hours */}
        <View
          style={[
            styles.statBox,
            { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
          ]}
        >
          <View style={styles.statIconRow}>
            <Clock size={15} color={theme.accent.primary} />
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 4 }]}>
              Hours
            </Text>
          </View>
          <Text style={[styles.statNumber, theme.typography.heading, { color: theme.colors.text }]}>
            {summary.totalHours}h
          </Text>
        </View>

        {/* Estimated Earnings */}
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              borderRadius: theme.radius.sm,
              marginHorizontal: 8,
            },
          ]}
        >
          <View style={styles.statIconRow}>
            <DollarSign size={15} color="#10B981" />
            <Text style={[theme.typography.caption, { color: '#10B981', marginLeft: 4 }]}>
              Est. Earnings
            </Text>
          </View>
          <Text style={[styles.statNumber, theme.typography.heading, { color: '#10B981' }]}>
            ${summary.totalEarnings}
          </Text>
        </View>

        {/* Shift Count */}
        <View
          style={[
            styles.statBox,
            { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
          ]}
        >
          <View style={styles.statIconRow}>
            <Calendar size={15} color={theme.colors.textSecondary} />
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 4 }]}>
              Shifts
            </Text>
          </View>
          <Text style={[styles.statNumber, theme.typography.heading, { color: theme.colors.text }]}>
            {summary.shiftCount}
          </Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statNumber: {
    marginTop: 2,
  },
});
