/**
 * Firebase Cloud Functions Reference Implementation for Life Planner Reminders Engine
 *
 * This module defines the server-side cron triggers and Expo Push / Twilio SMS dispatchers.
 * Deploy to Firebase Cloud Functions with: `firebase deploy --only functions`
 */

export const CLOUD_FUNCTIONS_REFERENCE_CODE = `
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

/**
 * Scheduled Cron Job: Executes every 5 minutes to dispatch due reminders
 */
exports.scheduledRemindersDispatcher = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Query pending reminders scheduled on or before now
    const remindersQuery = db
      .collectionGroup('reminders')
      .where('scheduledAt', '<=', nowIso)
      .where('isSent', '==', false)
      .limit(100);

    const snapshot = await remindersQuery.get();
    if (snapshot.empty) {
      console.log('No pending reminders due at:', nowIso);
      return null;
    }

    const pushMessages = [];
    const batch = db.batch();

    for (const doc of snapshot.docs) {
      const reminder = doc.data();
      const userId = reminder.userId;

      // Mark reminder as sent
      batch.update(doc.ref, {
        isSent: true,
        sentAt: nowIso,
      });

      // Write in-app notification to user inbox
      const notifRef = db.collection('users').doc(userId).collection('notifications').doc();
      batch.set(notifRef, {
        userId,
        targetType: reminder.targetType || 'task',
        targetId: reminder.targetId || '',
        title: reminder.title,
        body: reminder.body,
        channel: reminder.channel || 'push',
        read: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      // Resolve registered Expo Push Tokens for this user
      if (reminder.channel === 'push' || reminder.channel === 'both') {
        const devicesSnap = await db.collection('users').doc(userId).collection('devices').get();
        devicesSnap.forEach((deviceDoc) => {
          const pushToken = deviceDoc.data().pushToken;
          if (Expo.isExpoPushToken(pushToken)) {
            pushMessages.push({
              to: pushToken,
              sound: 'default',
              title: reminder.title,
              body: reminder.body,
              data: {
                targetType: reminder.targetType,
                targetId: reminder.targetId,
              },
            });
          }
        });
      }

      // Handle SMS Dispatch if channel is 'sms' or 'both'
      if (reminder.channel === 'sms' || reminder.channel === 'both') {
        if (reminder.phoneNumber) {
          // Send SMS via Twilio API / Firebase SMS extension
          console.log(\`[SMS Dispatch] Sending to \${reminder.phoneNumber}: \${reminder.body}\`);
        }
      }
    }

    // Commit batch database updates
    await batch.commit();

    // Send push notification chunks via Expo Push API
    if (pushMessages.length > 0) {
      const chunks = expo.chunkPushNotifications(pushMessages);
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log('[Expo Push] Sent chunk tickets:', ticketChunk);
        } catch (error) {
          console.error('[Expo Push Error]', error);
        }
      }
    }

    return null;
  });
`;
