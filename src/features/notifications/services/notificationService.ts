import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { InAppNotification } from '../types';
import { subMinutes, subHours, subDays } from 'date-fns';

export const notificationService = {
  /**
   * Fetch all notifications for user
   */
  async fetchNotifications(userId: string): Promise<InAppNotification[]> {
    try {
      const notifRef = collection(db, 'users', userId, 'notifications');
      const q = query(notifRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      let notifs = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as InAppNotification),
      );

      if (notifs.length === 0) {
        notifs = this.getSeedNotifications(userId);
      }
      return notifs;
    } catch {
      return this.getSeedNotifications(userId);
    }
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'notifications', notificationId);
    await updateDoc(docRef, {
      read: true,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string, notifications: InAppNotification[]): Promise<void> {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) {
        const docRef = doc(db, 'users', userId, 'notifications', n.id);
        batch.update(docRef, { read: true, updatedAt: new Date().toISOString() });
      }
    });
    await batch.commit();
  },

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'notifications', notificationId);
    await deleteDoc(docRef);
  },

  /**
   * Create an in-app notification record
   */
  async createNotification(
    userId: string,
    data: Omit<InAppNotification, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<InAppNotification> {
    const now = new Date().toISOString();
    const notif: Omit<InAppNotification, 'id'> = {
      ...data,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'notifications'), notif);
    return { id: docRef.id, ...notif };
  },

  getSeedNotifications(userId: string): InAppNotification[] {
    const now = new Date();
    return [
      {
        id: 'notif-1',
        userId,
        targetType: 'assignment',
        targetId: 'a1',
        title: 'Assignment Deadline Approaching ⏳',
        body: 'CS301 Red-Black Tree Implementation is due in 2 days at 23:59.',
        channel: 'both',
        read: false,
        createdAt: subMinutes(now, 15).toISOString(),
        updatedAt: subMinutes(now, 15).toISOString(),
      },
      {
        id: 'notif-2',
        userId,
        targetType: 'learning',
        targetId: 'topic-101',
        title: 'Spaced Review Due Today 🧠',
        body: 'Review "React Native & Reanimated Worklets" to advance your 3-day retention interval.',
        channel: 'push',
        read: false,
        createdAt: subHours(now, 2).toISOString(),
        updatedAt: subHours(now, 2).toISOString(),
      },
      {
        id: 'notif-3',
        userId,
        targetType: 'shift',
        targetId: 'shift-1',
        title: 'Upcoming Work Shift 💼',
        body: 'Software Intern shift starts at 13:00 today at Tech Hub HQ.',
        channel: 'sms',
        read: false,
        createdAt: subHours(now, 4).toISOString(),
        updatedAt: subHours(now, 4).toISOString(),
      },
      {
        id: 'notif-4',
        userId,
        targetType: 'exam',
        targetId: 'e1',
        title: 'Midterm Exam in 4 Days 📚',
        body: 'CS301 Midterm Exam: Algorithms & Complexity in Turing Science Hall Room 302.',
        channel: 'push',
        read: true,
        createdAt: subDays(now, 1).toISOString(),
        updatedAt: subDays(now, 1).toISOString(),
      },
      {
        id: 'notif-5',
        userId,
        targetType: 'event',
        targetId: 'ev-1',
        title: 'Career Fair & Networking 🚀',
        body: 'Student Union Grand Ballroom: Career fair starts in 30 minutes!',
        channel: 'both',
        read: true,
        createdAt: subDays(now, 2).toISOString(),
        updatedAt: subDays(now, 2).toISOString(),
      },
    ];
  },
};
