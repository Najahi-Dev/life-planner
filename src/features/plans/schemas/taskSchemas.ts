import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Title must not exceed 100 characters'),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['work', 'personal', 'study', 'uni', 'health', 'finance']),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().optional(),
  repeat: z.enum(['none', 'daily', 'weekly', 'monthly']),
  reminderMinutesBefore: z.number().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
});

export type TaskFormData = z.infer<typeof taskSchema>;
