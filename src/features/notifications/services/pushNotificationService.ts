import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { NotificationSchedulePayload } from '../types';

const isExpoGo = Constants.appOwnership === 'expo';
const isWeb = Platform.OS === 'web';

// Configure foreground notification behavior safely
try {
  if (!isWeb) {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch {
  // Graceful fallback in Expo Go / web
}

export const pushNotificationService = {
  /**
   * Register device and retrieve Expo push token (development builds / production only)
   */
  async registerForPushNotificationsAsync(userId?: string): Promise<string | null> {
    if (isWeb || isExpoGo) {
      // Remote notifications are only supported in Development Builds or standalone builds in Expo SDK 53+
      return null;
    }

    try {
      if (Platform.OS === 'android') {
        await setNotificationChannelAsync('default', {
          name: 'Life Planner Reminders',
          importance: AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
          sound: 'default',
        });
      }

      if (!Device.isDevice) {
        return null;
      }

      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      const { getExpoPushTokenAsync } = await import(
        'expo-notifications/build/getExpoPushTokenAsync'
      );
      const tokenData = await getExpoPushTokenAsync(
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
    if (isWeb) return null;

    try {
      const id = await scheduleNotificationAsync({
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
          type: SchedulableTriggerInputTypes.DATE,
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
    if (isWeb) return;
    try {
      await cancelScheduledNotificationAsync(notificationId);
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
    if (isWeb) {
      return;
    }

    try {
      await scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { test: true },
        },
        trigger: {
          seconds: 2,
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    } catch {
      // Non-blocking in Expo Go
    }
  },
};
