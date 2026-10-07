import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { learningService } from '../services/learningService';
import { LearningTopicFormData, StudySessionFormData } from '../schemas/learningSchemas';
import { LearningSummaryData } from '../types';
import { hapticFeedback } from '@/utils/haptics';

export function useLearning() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const learningQuery = useQuery<LearningSummaryData>({
    queryKey: ['learningSummary', userId],
    queryFn: () => learningService.fetchLearningSummary(userId),
    staleTime: 1000 * 60 * 2,
  });

  const createTopicMutation = useMutation({
    mutationFn: (data: LearningTopicFormData) => learningService.createTopic(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['learningSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const logSessionMutation = useMutation({
    mutationFn: (data: StudySessionFormData) => learningService.logStudySession(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['learningSummary', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const reviewTopicMutation = useMutation({
    mutationFn: (topicId: string) => learningService.reviewTopic(userId, topicId),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['learningSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => learningService.deleteTopic(userId, topicId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['learningSummary', userId] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  return {
    summary: learningQuery.data,
    isLoading: learningQuery.isLoading,
    isRefetching: learningQuery.isRefetching,
    refetch: learningQuery.refetch,
    createTopic: createTopicMutation.mutateAsync,
    logSession: logSessionMutation.mutateAsync,
    reviewTopic: reviewTopicMutation.mutateAsync,
    deleteTopic: deleteTopicMutation.mutateAsync,
    isLoggingSession: logSessionMutation.isPending,
  };
}
