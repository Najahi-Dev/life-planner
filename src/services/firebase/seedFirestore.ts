import { doc, setDoc, writeBatch, collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from './config';
import { taskService } from '@/features/plans/services/taskService';
import { shiftService } from '@/features/schedule/services/shiftService';
import { uniService } from '@/features/university/services/uniService';
import { eventService } from '@/features/events/services/eventService';
import { learningService } from '@/features/learning/services/learningService';
import { notificationService } from '@/features/notifications/services/notificationService';

export async function seedUserDataToFirestore(userId: string, userEmail?: string, displayName?: string) {
  if (!userId) return;

  try {
    console.log('[Seed] Checking if Firestore has data for user:', userId);

    // 1. Ensure top-level user document exists
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        userId,
        email: userEmail || 'user@lifeplanner.app',
        displayName: displayName || 'Planner User',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    // 2. Check if tasks subcollection is already populated
    const tasksSnap = await getDocs(query(collection(db, 'users', userId, 'tasks'), limit(1)));
    if (!tasksSnap.empty) {
      console.log('[Seed] Firestore user subcollections already populated.');
      return;
    }

    console.log('[Seed] Populating full initial sample data in Firestore...');
    const batch = writeBatch(db);

    // Seed Tasks
    const seedTasks = taskService.getSeedTasks(userId);
    seedTasks.forEach((t) => {
      const ref = doc(db, 'users', userId, 'tasks', t.id);
      batch.set(ref, t, { merge: true });
    });

    // Seed Shifts
    const seedShifts = shiftService.getSeedShifts(userId);
    seedShifts.forEach((s) => {
      const ref = doc(db, 'users', userId, 'shifts', s.id);
      batch.set(ref, s, { merge: true });
    });

    // Seed Courses
    const seedCourses = uniService.getSeedCourses(userId);
    seedCourses.forEach((c) => {
      const ref = doc(db, 'users', userId, 'courses', c.id);
      batch.set(ref, c, { merge: true });
    });

    // Seed Assignments
    const seedAssignments = uniService.getSeedAssignments(userId);
    seedAssignments.forEach((a) => {
      const ref = doc(db, 'users', userId, 'assignments', a.id);
      batch.set(ref, a, { merge: true });
    });

    // Seed Exams
    const seedExams = uniService.getSeedExams(userId);
    seedExams.forEach((e) => {
      const ref = doc(db, 'users', userId, 'exams', e.id);
      batch.set(ref, e, { merge: true });
    });

    // Seed Events
    const seedEvents = eventService.getSeedEvents(userId);
    seedEvents.forEach((ev) => {
      const ref = doc(db, 'users', userId, 'events', ev.id);
      batch.set(ref, ev, { merge: true });
    });

    // Seed Learning Topics
    const seedTopics = learningService.getSeedTopics(userId);
    seedTopics.forEach((tp) => {
      const ref = doc(db, 'users', userId, 'topics', tp.id);
      batch.set(ref, tp, { merge: true });
    });

    // Seed Study Sessions
    const seedSessions = learningService.getSeedSessions(userId);
    seedSessions.forEach((ss) => {
      const ref = doc(db, 'users', userId, 'studySessions', ss.id);
      batch.set(ref, ss, { merge: true });
    });

    // Seed Notifications
    const seedNotifs = notificationService.getSeedNotifications(userId);
    seedNotifs.forEach((n) => {
      const ref = doc(db, 'users', userId, 'notifications', n.id);
      batch.set(ref, n, { merge: true });
    });

    await batch.commit();
    console.log('[Seed] Successfully committed all seed data to Firestore!');
  } catch (err: any) {
    console.error('[Seed] Error seeding data to Firestore:', err);
  }
}
