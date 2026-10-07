import { z } from 'zod';

export const learningTopicSchema = z.object({
  title: z
    .string()
    .min(1, 'Topic title is required')
    .max(100, 'Title must not exceed 100 characters'),
  category: z.string().min(1, 'Category is required'),
  targetHours: z.number().min(1, 'Target hours must be at least 1 hour'),
  completedHours: z.number().min(0).default(0),
  resources: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.string().optional(),
        type: z.enum(['video', 'book', 'article', 'course']),
      }),
    )
    .default([]),
});

export type LearningTopicFormData = z.infer<typeof learningTopicSchema>;

export const studySessionSchema = z.object({
  topicId: z.string().min(1, 'Please select a learning topic'),
  topicTitle: z.string().min(1, 'Topic title is required'),
  durationMinutes: z.number().min(5, 'Session must be at least 5 minutes'),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  date: z.string().min(1, 'Date is required'),
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]).optional(),
});

export type StudySessionFormData = z.infer<typeof studySessionSchema>;
