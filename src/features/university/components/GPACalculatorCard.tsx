import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Award, GraduationCap, TrendingUp, Sparkles } from 'lucide-react-native';
import { Card, ProgressRing } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { GPASummary } from '../types';

export interface GPACalculatorCardProps {
  summary?: GPASummary;
}

export const GPACalculatorCard: React.FC<GPACalculatorCardProps> = ({ summary }) => {
  const theme = useTheme();

  const currentGPA = summary?.currentGPA || 3.82;
  const targetGPA = summary?.targetGPA || 3.9;
  const totalCredits = summary?.totalCredits || 16;
  const completedCredits = summary?.completedCredits || 12;

  const gpaPercent = Math.min(100, Math.round((currentGPA / 4.0) * 100));

  const getHonorsLabel = (gpa: number) => {
    if (gpa >= 3.85) return "Dean's High Honors / Summa Cum Laude 🏆";
    if (gpa >= 3.7) return "Dean's List / Magna Cum Laude 🌟";
    if (gpa >= 3.5) return 'Honors List / Cum Laude ⭐';
    if (gpa >= 3.0) return 'Good Academic Standing ✨';
    return 'Academic Monitoring';
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <View
            style={[
              styles.honorsBadge,
              { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
            ]}
          >
            <Sparkles size={14} color={theme.accent.primary} />
            <Text
              style={[
                styles.honorsText,
                theme.typography.captionBold,
                { color: theme.accent.primary },
              ]}
              numberOfLines={1}
            >
              {getHonorsLabel(currentGPA)}
            </Text>
          </View>

          <Text style={[styles.heading, theme.typography.display, { color: theme.colors.text }]}>
            {currentGPA.toFixed(2)}{' '}
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              / 4.00
            </Text>
          </Text>

          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Cumulative & Semester Grade Point Average
          </Text>
        </View>

        <View style={styles.ringWrapper}>
          <ProgressRing progress={gpaPercent} size={84} strokeWidth={8} />
        </View>
      </View>

      {/* Credit Stats & Target */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Completed
          </Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text, marginTop: 2 }]}>
            {completedCredits} Credits
          </Text>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.borderSubtle },
          ]}
        />

        <View style={styles.statBox}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Target GPA
          </Text>
          <Text style={[theme.typography.heading, { color: theme.accent.primary, marginTop: 2 }]}>
            {targetGPA.toFixed(2)}
          </Text>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.borderSubtle },
          ]}
        />

        <View style={styles.statBox}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Total Enrolled
          </Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text, marginTop: 2 }]}>
            {totalCredits} Credits
          </Text>
        </View>
      </View>

      {/* Grade Points Distribution */}
      {summary?.gradeBreakdown && summary.gradeBreakdown.length > 0 && (
        <View style={styles.distributionSection}>
          <Text
            style={[
              styles.distHeader,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary },
            ]}
          >
            Course Grade Distribution:
          </Text>
          <View style={styles.distGrid}>
            {summary.gradeBreakdown.map((item) => (
              <View
                key={item.grade}
                style={[
                  styles.gradePill,
                  { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.sm },
                ]}
              >
                <Text style={[theme.typography.captionBold, { color: theme.colors.text }]}>
                  {item.grade} ({item.count})
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textSecondary, marginLeft: 4, fontSize: 11 },
                  ]}
                >
                  {item.points.toFixed(1)} pts
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  honorsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  honorsText: {
    marginLeft: 4,
    fontSize: 12,
  },
  heading: {
    lineHeight: 34,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 28,
  },
  distributionSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  distHeader: {
    marginBottom: 6,
  },
  distGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
