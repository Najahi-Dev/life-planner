import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { ShiftConflict } from '../types';

export interface OverlapWarningBannerProps {
  conflicts: ShiftConflict[];
}

export const OverlapWarningBanner: React.FC<OverlapWarningBannerProps> = ({ conflicts }) => {
  const theme = useTheme();

  if (conflicts.length === 0) return null;

  return (
    <Card
      variant="outlined"
      style={{
        ...styles.container,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
      }}
    >
      <View style={styles.headerRow}>
        <AlertTriangle size={20} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={[styles.title, theme.typography.heading, { color: '#EF4444' }]}>
          Schedule Conflict Detected!
        </Text>
      </View>

      <Text style={[styles.subtitle, theme.typography.caption, { color: theme.colors.textSecondary }]}>
        You have {conflicts.length} overlapping work {conflicts.length === 1 ? 'shift' : 'shifts'}. Please adjust timings to prevent conflicts:
      </Text>

      <View style={styles.conflictsList}>
        {conflicts.map((c, i) => (
          <View key={i} style={styles.conflictItem}>
            <View style={[styles.bullet, { backgroundColor: '#EF4444' }]} />
            <Text
              style={[
                styles.description,
                theme.typography.captionBold,
                { color: theme.colors.text },
              ]}
            >
              {c.date}: {c.description}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    marginBottom: 10,
  },
  conflictsList: {
    width: '100%',
  },
  conflictItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  description: {
    flex: 1,
    lineHeight: 18,
  },
});
