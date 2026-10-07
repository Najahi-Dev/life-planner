import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { NotificationSchedulePayload } from '../types';

// Configure foreground notification behavior for Expo SDK 57
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const pushNotificationService = {
  /**
   * Register device and retrieve Expo push token
   */
  async registerForPushNotificationsAsync(userId?: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      // Set up Android notification channels
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Life Planner Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
          sound: 'default',
        });
      }

      if (!Device.isDevice) {
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      const pushToken = tokenData.data;

      // Save token to Firestore device registry
      if (userId && pushToken) {
        const deviceId = `${Platform.OS}-${Device.modelName || 'device'}`.replace(/\s+/g, '-');
        const deviceRef = doc(db, 'users', userId, 'devices', deviceId);
        await setDoc(
          deviceRef,
          {
            pushToken,
            platform: Platform.OS,
            model: Device.modelName || 'Unknown Device',
            lastActiveAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      return pushToken;
    } catch {
      return null;
    }
  },

  /**
   * Schedule a local notification reminder
   */
  async scheduleLocalReminder(payload: NotificationSchedulePayload): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const id = await Notifications.scheduleNotificationAsync({
        identifier: payload.id,
        content: {
          title: payload.title,
          body: payload.body,
          sound: 'default',
          data: {
            targetType: payload.targetType,
            targetId: payload.targetId,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: payload.scheduledDate,
        },
      });

      return id;
    } catch {
      return null;
    }
  },

  /**
   * Cancel a scheduled notification by identifier
   */
  async cancelScheduledReminder(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
      // Non-blocking
    }
  },

  /**
   * Send an immediate test notification
   */
  async sendImmediateTestNotification(
    title = 'Life Planner Alert 🔔',
    body = 'Your scheduled study session starts in 15 minutes!',
  ): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { test: true },
        },
        trigger: {
          seconds: 2,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    } catch {
      // Non-blocking
    }
  },
};
