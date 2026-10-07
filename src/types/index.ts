/**
 * Core Type Definitions for Personal Life Planner
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory = 'work' | 'personal' | 'study' | 'uni' | 'health' | 'finance';

export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface BaseEntity {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends BaseEntity {
  email: string;
  displayName: string;
  photoURL?: string | null;
  phoneNumber?: string | null;
  bio?: string;
  onboardingCompleted: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky';
export type WeekStartDay = 'monday' | 'sunday';

export interface UserSettings extends BaseEntity {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  pushEnabled: boolean;
  smsEnabled: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm format, e.g. "22:00"
  quietHoursEnd: string;   // HH:mm format, e.g. "07:00"
  defaultReminderLeadMinutes: number; // 5, 15, 30, 60
  weekStartDay: WeekStartDay;
}

export interface TaskItem extends BaseEntity {
  title: string;
  notes?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  repeat: TaskRepeat;
  reminderMinutesBefore?: number;
  status: TaskStatus;
  completedAt?: string | null;
  orderIndex: number;
}

export interface WorkShift extends BaseEntity {
  title: string;
  companyOrRole?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakMinutes?: number;
  hourlyRate?: number;
  location?: string;
  notes?: string;
  repeatRule?: 'none' | 'weekly' | 'biweekly';
  color?: string;
}

export interface LearningTopic extends BaseEntity {
  title: string;
  category: string;
  targetHours: number;
  completedHours: number;
  progressPercent: number; // 0-100
  resources: Array<{ id: string; title: string; url?: string; type: 'video' | 'book' | 'article' | 'course' }>;
  lastReviewedAt?: string | null;
  nextReviewDate?: string | null;
  intervalIndex: number; // For spaced repetition (1, 3, 7, 14, 30 days)
  easeFactor: number;
  repetitions: number;
  isArchived?: boolean;
}

export interface StudySession extends BaseEntity {
  topicId: string;
  topicTitle: string;
  durationMinutes: number;
  notes?: string;
  date: string; // YYYY-MM-DD
  rating?: 1 | 2 | 3 | 4 | 5; // Difficulty / comprehension
}

export interface UniCourse extends BaseEntity {
  code: string;
  name: string;
  lecturer?: string;
  credits: number;
  semester: string; // e.g. "Fall 2026", "Spring 2027"
  color: string;
  targetGrade?: string;
  achievedGrade?: string;
}

export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded';

export interface AssignmentChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface UniAssignment extends BaseEntity {
  courseId: string;
  courseCode: string;
  courseName?: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  weightPercent: number;
  status: AssignmentStatus;
  progressPercent: number; // 0-100
  grade?: number | null; // e.g. 88
  maxGrade?: number; // e.g. 100
  checklist: AssignmentChecklistItem[];
  notes?: string;
}

export interface UniExam extends BaseEntity {
  courseId: string;
  courseCode: string;
  courseName?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  venue?: string;
  topicsToCover: string[];
  revisionProgressPercent: number; // 0-100
  resultGrade?: string | number;
  weightPercent?: number;
  notes?: string;
}

export type EventType = 'academic' | 'work' | 'social' | 'health' | 'personal' | 'deadline';

export interface CalendarEvent extends BaseEntity {
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  type: EventType;
  notes?: string;
  reminderMinutesBefore?: number;
  color?: string;
}

export type NotificationChannel = 'push' | 'sms' | 'both';
export type ReminderTargetType = 'task' | 'shift' | 'assignment' | 'exam' | 'event' | 'learning';

export interface AppReminder extends BaseEntity {
  targetType: ReminderTargetType;
  targetId: string;
  title: string;
  body: string;
  scheduledAt: string; // ISO String
  channel: NotificationChannel;
  isSent: boolean;
  sentAt?: string | null;
  phoneNumber?: string;
}

export interface DeviceToken extends BaseEntity {
  pushToken: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  lastActiveAt: string;
}
