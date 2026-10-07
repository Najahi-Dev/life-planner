import { TaskItem, Priority, TaskCategory, TaskRepeat, TaskStatus } from '@/types';

export * from '../schemas/taskSchemas';

export type PlanViewMode = 'daily' | 'weekly' | 'monthly';

export interface TaskFilterOptions {
  status: 'all' | 'pending' | 'completed';
  priority?: Priority | 'all';
  category?: TaskCategory | 'all';
  searchQuery?: string;
  sortBy?: 'dueDate' | 'priority' | 'title' | 'orderIndex';
}

export interface TasksByDay {
  date: string;
  dayLabel: string;
  tasks: TaskItem[];
}
