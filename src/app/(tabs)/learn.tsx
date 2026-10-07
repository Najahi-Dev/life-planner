import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { BookOpen, Plus, Layers } from 'lucide-react-native';
import { Header, Skeleton, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useLearning } from '@/features/learning/hooks/useLearning';
import {
  StudyStreakHeader,
  SpacedReviewSection,
  TopicCard,
  StudyHoursChart,
  RecentStudySessionsList,
  LogStudySessionSheet,
  AddTopicSheet,
} from '@/features/learning/components';
import { hapticFeedback } from '@/utils/haptics';

export default function LearnTabScreen() {
  const theme = useTheme();
  const {
    summary,
    isLoading,
    isRefetching,
    refetch,
    createTopic,
    logSession,
    reviewTopic,
    deleteTopic,
  } = useLearning();

  const logSessionSheetRef = useRef<BottomSheet>(null);
  const addTopicSheetRef = useRef<BottomSheet>(null);

  const handleOpenLogSession = () => {
    hapticFeedback.selection();
    logSessionSheetRef.current?.expand();
  };

  const handleOpenAddTopic = () => {
    hapticFeedback.selection();
    addTopicSheetRef.current?.expand();
  };

  const handleReviewTopic = async (topicId: string) => {
    await reviewTopic(topicId);
  };

  const handleDeleteTopic = async (topicId: string) => {
    await deleteTopic(topicId);
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Top App Header */}
      <Header
        title="Learning & Mastery"
        subtitle="Spaced Repetition & Study Tracker"
        rightAction={
          <Pressable
            onPress={handleOpenAddTopic}
            hitSlop={8}
            style={[
              styles.headerIconBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderRadius: theme.radius.button,
              },
            ]}
          >
            <Plus size={22} color={theme.accent.primary} />
          </Pressable>
        }
      />

      {isLoading && !summary ? (
        <View style={styles.loadingContainer}>
          <Skeleton height={140} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton height={100} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton height={160} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton height={120} borderRadius={16} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
          {/* Study Streak & Weekly Hours Card */}
          <StudyStreakHeader
            streakDays={summary?.studyStreakDays || 0}
            weeklyHours={summary?.weeklyStudyHours || 0}
            goalHours={summary?.weeklyStudyGoalHours || 15}
            onLogSession={handleOpenLogSession}
          />

          {/* Spaced Repetition Due Reviews Section */}
          <SpacedReviewSection
            dueTopics={summary?.dueForReview || []}
            onReviewTopic={handleReviewTopic}
          />

          {/* Weekly Study Hours Distribution Bar Chart */}
          {summary?.dailyStudyChart && (
            <StudyHoursChart
              dailyData={summary.dailyStudyChart}
              goalHours={summary.weeklyStudyGoalHours || 15}
            />
          )}

          {/* Topics List Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Layers size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
              <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                Active Learning Topics
              </Text>
            </View>

            <Pressable
              onPress={handleOpenAddTopic}
              hitSlop={8}
              style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.7 }]}
            >
              <Plus size={16} color={theme.accent.primary} style={{ marginRight: 4 }} />
              <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                New Topic
              </Text>
            </Pressable>
          </View>

          {/* Topics List */}
          {summary?.topics && summary.topics.length > 0 ? (
            summary.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onDelete={handleDeleteTopic}
              />
            ))
          ) : (
            <EmptyState
              title="No topics yet"
              description="Add topics you are studying to build mastery with spaced repetition reviews."
              icon={<BookOpen size={36} color={theme.accent.primary} />}
              actionTitle="Add Topic"
              onAction={handleOpenAddTopic}
            />
          )}

          {/* Recent Study Sessions Logs */}
          {summary?.recentSessions && summary.recentSessions.length > 0 && (
            <RecentStudySessionsList sessions={summary.recentSessions} />
          )}

          <View style={{ height: 90 }} />
        </ScrollView>
      )}

      {/* Log Study Session Bottom Sheet */}
      <LogStudySessionSheet
        ref={logSessionSheetRef}
        topics={summary?.topics || []}
        onSave={async (data) => {
          await logSession(data);
        }}
      />

      {/* Add Topic Bottom Sheet */}
      <AddTopicSheet
        ref={addTopicSheetRef}
        onSave={async (data) => {
          await createTopic(data);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
