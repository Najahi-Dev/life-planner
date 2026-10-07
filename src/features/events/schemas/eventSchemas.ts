import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .max(120, 'Title must not exceed 120 characters'),
  date: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().max(100).optional(),
  type: z.enum(['academic', 'work', 'social', 'health', 'personal', 'deadline']).default('personal'),
  reminderMinutesBefore: z.number().optional(),
  notes: z.string().max(500).optional(),
  color: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;
