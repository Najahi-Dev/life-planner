import { z } from 'zod';

export const reminderSchema = z.object({
  targetType: z.enum(['task', 'shift', 'assignment', 'exam', 'event', 'learning']),
  targetId: z.string().min(1, 'Target ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Body is required').max(300),
  scheduledAt: z.string().min(1, 'Scheduled date is required'),
  channel: z.enum(['push', 'sms', 'both']).default('push'),
  phoneNumber: z.string().optional(),
});

export type ReminderFormData = z.infer<typeof reminderSchema>;

export const testNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Reminder Alert 🔔'),
  body: z.string().min(1, 'Body is required').default('Your scheduled activity starts in 15 minutes!'),
  channel: z.enum(['push', 'sms', 'both']).default('push'),
  leadSeconds: z.number().min(1).default(5),
});

export type TestNotificationFormData = z.infer<typeof testNotificationSchema>;
