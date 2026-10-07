import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Briefcase } from 'lucide-react-native';
import { ShiftCard } from './ShiftCard';
import { EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { WorkShift } from '@/types';
import { ShiftConflict } from '../types';

export interface ShiftListViewProps {
  shifts: WorkShift[];
  conflicts: ShiftConflict[];
  onDeleteShift: (shiftId: string) => void;
  onAddShift: () => void;
}

export const ShiftListView: React.FC<ShiftListViewProps> = ({
  shifts,
  conflicts,
  onDeleteShift,
  onAddShift,
}) => {
  const theme = useTheme();

  if (shifts.length === 0) {
    return (
      <EmptyState
        title="No Shifts Scheduled"
        description="You have no upcoming work shifts or internship hours recorded."
        actionTitle="Add Work Shift"
        onAction={onAddShift}
        icon={<Briefcase size={36} color={theme.accent.primary} />}
        style={{ marginTop: 24 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
          All Scheduled Shifts
        </Text>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          {shifts.length} {shifts.length === 1 ? 'Shift' : 'Shifts'}
        </Text>
      </View>

      <View style={styles.list}>
        {shifts.map((shift) => {
          const hasConflict = conflicts.some(
            (c) => c.shiftA.id === shift.id || c.shiftB.id === shift.id,
          );
          return (
            <ShiftCard
              key={shift.id}
              shift={shift}
              hasConflict={hasConflict}
              onDelete={onDeleteShift}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  list: {
    width: '100%',
  },
});
