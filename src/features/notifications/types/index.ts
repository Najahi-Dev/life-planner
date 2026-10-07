import { NotificationChannel, ReminderTargetType, BaseEntity } from '@/types';

export * from '../schemas/notificationSchemas';

export type NotificationFilter = 'all' | 'unread' | 'push' | 'sms';

export interface InAppNotification extends BaseEntity {
  targetType: ReminderTargetType;
  targetId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read: boolean;
  scheduledAt?: string;
  sentAt?: string;
  phoneNumber?: string;
}

export interface NotificationSchedulePayload {
  id: string;
  title: string;
  body: string;
  targetType: ReminderTargetType;
  targetId: string;
  scheduledDate: Date;
  channel?: NotificationChannel;
}
