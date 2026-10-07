import { WorkShift } from '@/types';

export * from '../schemas/shiftSchemas';

export type ScheduleViewMode = 'calendar' | 'list';

export interface ShiftConflict {
  shiftA: WorkShift;
  shiftB: WorkShift;
  date: string;
  description: string;
}

export interface WeeklyShiftSummary {
  totalHours: number;
  totalEarnings: number;
  shiftCount: number;
  weekStart: string;
  weekEnd: string;
}
