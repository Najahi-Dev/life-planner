import { z } from 'zod';

export const shiftSchema = z.object({
  title: z
    .string()
    .min(1, 'Shift role or title is required')
    .max(100, 'Title must not exceed 100 characters'),
  companyOrRole: z.string().max(100).optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'), // HH:mm
  endTime: z.string().min(1, 'End time is required'),     // HH:mm
  breakMinutes: z.number().min(0).default(0),
  hourlyRate: z.number().min(0).optional(),
  location: z.string().max(150).optional(),
  notes: z.string().max(500).optional(),
  repeatRule: z.enum(['none', 'weekly', 'biweekly']).default('none'),
  color: z.string().optional(),
});

export type ShiftFormData = z.infer<typeof shiftSchema>;
