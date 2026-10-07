import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Clock, MapPin, DollarSign, Repeat, Trash2, Briefcase } from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { WorkShift } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export interface ShiftCardProps {
  shift: WorkShift;
  hasConflict?: boolean;
  onDelete?: (shiftId: string) => void;
  onEdit?: (shift: WorkShift) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  hasConflict = false,
  onDelete,
}) => {
  const theme = useTheme();

  // Calculate shift duration and earnings
  const [startH, startM] = shift.startTime.split(':').map(Number);
  const [endH, endM] = shift.endTime.split(':').map(Number);
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM) - (shift.breakMinutes || 0);
  const totalHours = Math.max(0, Math.round((totalMinutes / 60) * 10) / 10);
  const estimatedEarnings = shift.hourlyRate ? Math.round(totalHours * shift.hourlyRate) : null;

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete?.(shift.id);
  };

  return (
    <Card
      variant={hasConflict ? 'outlined' : 'elevated'}
      style={{
        ...styles.card,
        ...(hasConflict ? { borderColor: '#EF4444', borderWidth: 1.5 } : {}),
      }}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.badgeRow}>
            <Chip label="WORK SHIFT" variant="category" category="work" size="sm" />
            {shift.repeatRule && shift.repeatRule !== 'none' && (
              <View style={styles.repeatBadge}>
                <Repeat size={12} color={theme.accent.primary} style={{ marginRight: 3 }} />
                <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                  {shift.repeatRule}
                </Text>
              </View>
            )}
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginLeft: 6 }]}>
              {shift.date}
            </Text>
          </View>

          <Text style={[styles.title, theme.typography.heading, { color: theme.colors.text }]}>
            {shift.title}
          </Text>

          {shift.companyOrRole ? (
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
              {shift.companyOrRole}
            </Text>
          ) : null}
        </View>

        {estimatedEarnings !== null && (
          <View
            style={[
              styles.earningsBadge,
              { backgroundColor: 'rgba(16, 185, 129, 0.14)', borderRadius: theme.radius.sm },
            ]}
          >
            <DollarSign size={14} color="#10B981" />
            <Text style={[theme.typography.captionBold, { color: '#10B981' }]}>
              ${estimatedEarnings}
            </Text>
          </View>
        )}
      </View>

      {/* Timing and Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Clock size={14} color={theme.accent.primary} />
          <Text style={[theme.typography.captionBold, { color: theme.colors.text, marginLeft: 5 }]}>
            {shift.startTime} - {shift.endTime} ({totalHours}h)
          </Text>
        </View>

        {shift.location ? (
          <View style={[styles.detailItem, { marginLeft: 14 }]}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text
              style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 4 }]}
              numberOfLines={1}
            >
              {shift.location}
            </Text>
          </View>
        ) : null}

        {onDelete && (
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
            <Trash2 size={15} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {shift.notes ? (
        <View
          style={[
            styles.notesBox,
            { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
          ]}
        >
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {shift.notes}
          </Text>
        </View>
      ) : null}
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
    marginBottom: 10,
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
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
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
  deleteButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  notesBox: {
    marginTop: 8,
    padding: 8,
  },
});
