import { UniCourse, UniAssignment, UniExam } from '@/types';

export * from '../schemas/uniSchemas';

export type UniViewMode = 'overview' | 'assignments' | 'exams' | 'courses' | 'gpa';

export interface GPASummary {
  currentGPA: number;
  targetGPA: number;
  totalCredits: number;
  completedCredits: number;
  gradeBreakdown: {
    grade: string;
    count: number;
    points: number;
  }[];
}

export interface UniversityData {
  courses: UniCourse[];
  assignments: UniAssignment[];
  exams: UniExam[];
  gpaSummary: GPASummary;
  upcomingDeadlinesCount: number;
}
