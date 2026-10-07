import { CalendarEvent, EventType } from '@/types';

export * from '../schemas/eventSchemas';

export type EventViewMode = 'calendar' | 'agenda' | 'today';

export const EVENT_TYPE_COLORS: Record<EventType, { color: string; bg: string; label: string }> = {
  academic: { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)', label: 'Academic' },
  work: { color: '#0284C7', bg: 'rgba(2, 132, 199, 0.12)', label: 'Work' },
  social: { color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.12)', label: 'Social' },
  health: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', label: 'Health' },
  personal: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', label: 'Personal' },
  deadline: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', label: 'Deadline' },
};

export interface GroupedEvents {
  today: CalendarEvent[];
  tomorrow: CalendarEvent[];
  thisWeek: CalendarEvent[];
  later: CalendarEvent[];
}

export interface EventsSummaryData {
  events: CalendarEvent[];
  grouped: GroupedEvents;
  todayCount: number;
  upcomingThisWeekCount: number;
}
