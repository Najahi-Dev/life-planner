import { LearningTopic, StudySession } from '@/types';

export * from '../schemas/learningSchemas';

export const SPACED_INTERVALS = [1, 3, 7, 14, 30] as const;

export interface LearningSummaryData {
  topics: LearningTopic[];
  recentSessions: StudySession[];
  dueForReview: LearningTopic[];
  studyStreakDays: number;
  weeklyStudyHours: number;
  weeklyStudyGoalHours: number;
  dailyStudyChart: {
    day: string;
    date: string;
    hours: number;
  }[];
}
