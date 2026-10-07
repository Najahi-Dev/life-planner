import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Briefcase, Clock, MapPin, DollarSign } from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { WorkShift } from '@/types';

export interface NextShiftCardProps {
  shift: WorkShift | null;
  onPress?: () => void;
}

export const NextShiftCard: React.FC<NextShiftCardProps> = ({ shift, onPress }) => {
  const theme = useTheme();

  if (!shift) {
    return (
      <Card variant="outlined" style={styles.container}>
        <View style={styles.emptyRow}>
          <Briefcase size={20} color={theme.colors.textMuted} />
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginLeft: 10 }]}>
            No upcoming work shifts scheduled.
          </Text>
        </View>
      </Card>
    );
  }

  // Calculate shift duration and earnings
  const [startH, startM] = shift.startTime.split(':').map(Number);
  const [endH, endM] = shift.endTime.split(':').map(Number);
  const totalHours = Math.max(0, (endH * 60 + endM - (startH * 60 + startM) - (shift.breakMinutes || 0)) / 60);
  const estimatedEarnings = shift.hourlyRate ? Math.round(totalHours * shift.hourlyRate) : null;

  return (
    <Card variant="elevated" onPress={onPress} style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.badgeRow}>
            <Chip label="NEXT SHIFT" variant="category" category="work" size="sm" />
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginLeft: 6 }]}>
              {shift.date}
            </Text>
          </View>
          <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
            {shift.title}
          </Text>
          {shift.companyOrRole && (
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              {shift.companyOrRole}
            </Text>
          )}
        </View>

        {estimatedEarnings !== null && (
          <View
            style={[
              styles.earningsBadge,
              { backgroundColor: 'rgba(16, 185, 129, 0.14)', borderRadius: theme.radius.sm },
            ]}
          >
            <DollarSign size={14} color="#10B981" />
            <Text style={[theme.typography.captionBold, { color: "#10B981" }]}>
              ${estimatedEarnings}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Clock size={15} color={theme.accent.primary} />
          <Text style={[theme.typography.captionBold, { color: theme.colors.text, marginLeft: 6 }]}>
            {shift.startTime} - {shift.endTime} ({totalHours}h)
          </Text>
        </View>

        {shift.location && (
          <View style={[styles.detailItem, { marginLeft: 16 }]}>
            <MapPin size={15} color={theme.colors.textSecondary} />
            <Text
              style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 6 }]}
              numberOfLines={1}
            >
              {shift.location}
            </Text>
          </View>
        )}
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
    alignItems: 'flex-start',
    marginBottom: 12,
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
  title: {
    marginTop: 2,
  },
  earningsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
