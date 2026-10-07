import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import {
  GreetingHeader,
  StudyStreakCard,
  TodayTasksList,
  NextShiftCard,
  UpcomingDeadlinesCard,
  WeeklyProgressChart,
} from '@/features/dashboard/components';
import { SkeletonList, Card, Skeleton } from '@/components/ui';

export default function HomeDashboardScreen() {
  const theme = useTheme();
  const { data, isLoading, isRefetching, refetch, toggleTask } = useDashboard();

  if (isLoading && !data) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={{ paddingHorizontal: theme.spacing.screenPadding, paddingTop: 16 }}>
          <Skeleton variant="text" width="40%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton variant="text" width="70%" height={28} style={{ marginBottom: 20 }} />
          <Skeleton variant="card" width="100%" height={100} style={{ marginBottom: 16 }} />
          <SkeletonList count={3} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.accent.primary}
            colors={[theme.accent.primary]}
          />
        }
      >
        {/* Top Greeting Header */}
        <GreetingHeader />

        {/* Study Streak & Weekly Goal */}
        {data && (
          <StudyStreakCard
            streakDays={data.studyStreakDays}
            weeklyHours={data.weeklyStudyHours}
            goalHours={data.weeklyStudyGoalHours}
          />
        )}

        {/* Today's Tasks */}
        {data && (
          <TodayTasksList
            tasks={data.todayTasks}
            onToggleTask={toggleTask}
          />
        )}

        {/* Next Work Shift */}
        {data && <NextShiftCard shift={data.nextShift} />}

        {/* Upcoming Academic Deadlines (Next 7 days) */}
        {data && <UpcomingDeadlinesCard deadlines={data.upcomingDeadlines} />}

        {/* Weekly Productivity Bar Chart */}
        {data && <WeeklyProgressChart stats={data.weeklyTaskStats} />}

        {/* Bottom tab bar spacer */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
});
