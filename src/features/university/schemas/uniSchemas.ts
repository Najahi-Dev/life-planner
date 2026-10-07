import { z } from 'zod';

export const uniCourseSchema = z.object({
  code: z
    .string()
    .min(2, 'Course code must be at least 2 characters')
    .max(12, 'Course code too long')
    .transform((v) => v.toUpperCase().trim()),
  name: z.string().min(2, 'Course name is required').max(100),
  lecturer: z.string().max(80).optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Max 10 credits'),
  semester: z.string().min(2, 'Semester is required'),
  color: z.string().default('#6366F1'),
  targetGrade: z.string().optional(),
  achievedGrade: z.string().optional(),
});

export type UniCourseFormData = z.infer<typeof uniCourseSchema>;

export const uniAssignmentSchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
  courseCode: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Assignment title is required').max(120),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().optional(),
  weightPercent: z.number().min(1).max(100).default(15),
  notes: z.string().max(500).optional(),
  checklist: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean().default(false),
      }),
    )
    .default([]),
});

export type UniAssignmentFormData = z.infer<typeof uniAssignmentSchema>;

export const uniExamSchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
  courseCode: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Exam title is required').max(120),
  date: z.string().min(1, 'Exam date is required'),
  time: z.string().min(1, 'Exam time is required'),
  venue: z.string().max(100).optional(),
  weightPercent: z.number().min(1).max(100).optional(),
  topicsToCover: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
});

export type UniExamFormData = z.infer<typeof uniExamSchema>;
