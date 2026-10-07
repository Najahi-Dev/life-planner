import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AlertCircle, Calendar, GraduationCap, CheckCircle2 } from 'lucide-react-native';
import { Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface DeadlineItem {
  id: string;
  type: 'assignment' | 'exam';
  title: string;
  courseCode: string;
  date: string;
  time?: string;
  daysLeft: number;
  urgency: 'critical' | 'warning' | 'normal';
}

export interface UpcomingDeadlinesCardProps {
  deadlines: DeadlineItem[];
}

export const UpcomingDeadlinesCard: React.FC<UpcomingDeadlinesCardProps> = ({ deadlines }) => {
  const theme = useTheme();

  if (deadlines.length === 0) {
    return (
      <Card variant="outlined" style={styles.container}>
        <View style={styles.emptyRow}>
          <CheckCircle2 size={20} color="#10B981" />
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginLeft: 10 }]}>
            No university deadlines due in the next 7 days!
          </Text>
        </View>
      </Card>
    );
  }

  const getUrgencyBadge = (daysLeft: number, urgency: 'critical' | 'warning' | 'normal') => {
    let color = '#3B82F6';
    let bg = 'rgba(59, 130, 246, 0.14)';
    let text = `${daysLeft}d left`;

    if (daysLeft === 0) {
      color = '#EF4444';
      bg = 'rgba(239, 68, 68, 0.14)';
      text = 'Due Today';
    } else if (daysLeft === 1) {
      color = '#EF4444';
      bg = 'rgba(239, 68, 68, 0.14)';
      text = 'Tomorrow';
    } else if (urgency === 'critical') {
      color = '#EF4444';
      bg = 'rgba(239, 68, 68, 0.14)';
    } else if (urgency === 'warning') {
      color = '#F59E0B';
      bg = 'rgba(245, 158, 11, 0.14)';
    }

    return (
      <View style={[styles.urgencyBadge, { backgroundColor: bg, borderRadius: theme.radius.sm }]}>
        <Text style={[theme.typography.captionBold, { color }]}>{text}</Text>
      </View>
    );
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
          Upcoming Academic Deadlines
        </Text>
        <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
          Next 7 Days
        </Text>
      </View>

      <View style={styles.list}>
        {deadlines.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              index !== deadlines.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor:
                    item.type === 'exam'
                      ? 'rgba(236, 72, 153, 0.14)'
                      : theme.accent.primarySoft,
                  borderRadius: theme.radius.button,
                },
              ]}
            >
              {item.type === 'exam' ? (
                <GraduationCap size={18} color="#EC4899" />
              ) : (
                <Calendar size={18} color={theme.accent.primary} />
              )}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.courseTagRow}>
                <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                  {item.courseCode}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginLeft: 6 }]}>
                  • {item.type === 'exam' ? 'Exam' : 'Assignment'}
                </Text>
              </View>
              <Text
                style={[theme.typography.bodyBold, { color: theme.colors.text, marginTop: 2 }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}
              >
                {item.date} {item.time ? `at ${item.time}` : ''}
              </Text>
            </View>

            {getUrgencyBadge(item.daysLeft, item.urgency)}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  list: {
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBadge: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
    paddingRight: 8,
  },
  courseTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
