import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { CalendarEvent, EventType } from '@/types';
import { EventFormData } from '../schemas/eventSchemas';
import {
  EventsSummaryData,
  GroupedEvents,
  EVENT_TYPE_COLORS,
} from '../types';
import {
  format,
  addDays,
  parseISO,
  isSameDay,
  differenceInDays,
  isThisWeek,
} from 'date-fns';

export const eventService = {
  /**
   * Fetch all calendar events
   */
  async fetchEvents(userId: string): Promise<CalendarEvent[]> {
    try {
      const eventsRef = collection(db, 'users', userId, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'), orderBy('startTime', 'asc'));
      const snap = await getDocs(q);
      let events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CalendarEvent));

      if (events.length === 0) {
        events = this.getSeedEvents(userId);
      }
      return events;
    } catch {
      return this.getSeedEvents(userId);
    }
  },

  /**
   * Fetch events summary with timeline grouping
   */
  async fetchEventsSummary(userId: string): Promise<EventsSummaryData> {
    try {
      const events = await this.fetchEvents(userId);
      const grouped = this.groupEventsByTimeline(events);
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayCount = events.filter((e) => e.date === todayStr).length;

      return {
        events,
        grouped,
        todayCount,
        upcomingThisWeekCount: grouped.today.length + grouped.tomorrow.length + grouped.thisWeek.length,
      };
    } catch {
      return this.getFallbackSummary(userId);
    }
  },

  /**
   * Create a new event
   */
  async createEvent(userId: string, data: EventFormData): Promise<CalendarEvent> {
    const now = new Date().toISOString();
    const event: Omit<CalendarEvent, 'id'> = {
      userId,
      title: data.title.trim(),
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location?.trim() || '',
      type: data.type,
      notes: data.notes?.trim() || '',
      reminderMinutesBefore: data.reminderMinutesBefore || 30,
      color: data.color || EVENT_TYPE_COLORS[data.type]?.color || '#6366F1',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'events'), event);
    return { id: docRef.id, ...event };
  },

  /**
   * Update an existing event
   */
  async updateEvent(
    userId: string,
    eventId: string,
    data: Partial<EventFormData>,
  ): Promise<void> {
    const docRef = doc(db, 'users', userId, 'events', eventId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete an event
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'events', eventId);
    await deleteDoc(docRef);
  },

  /**
   * Group events into Today, Tomorrow, This Week, and Later
   */
  groupEventsByTimeline(events: CalendarEvent[]): GroupedEvents {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

    const grouped: GroupedEvents = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
    };

    events.forEach((event) => {
      try {
        if (event.date === todayStr) {
          grouped.today.push(event);
        } else if (event.date === tomorrowStr) {
          grouped.tomorrow.push(event);
        } else {
          const eventDate = parseISO(event.date);
          const daysDiff = differenceInDays(eventDate, today);

          if (daysDiff > 0 && daysDiff <= 7) {
            grouped.thisWeek.push(event);
          } else {
            grouped.later.push(event);
          }
        }
      } catch {
        grouped.later.push(event);
      }
    });

    return grouped;
  },

  /**
   * Generate multi-dot markers for react-native-calendars
   */
  getMarkedDates(events: CalendarEvent[], selectedDate: string): Record<string, any> {
    const marked: Record<string, any> = {};

    events.forEach((event) => {
      const color = event.color || EVENT_TYPE_COLORS[event.type]?.color || '#6366F1';

      if (!marked[event.date]) {
        marked[event.date] = {
          dots: [{ key: event.id, color, selectedDotColor: '#FFFFFF' }],
        };
      } else {
        // Prevent dot duplication for same type up to 3 dots per day
        if (marked[event.date].dots.length < 3) {
          marked[event.date].dots.push({
            key: event.id,
            color,
            selectedDotColor: '#FFFFFF',
          });
        }
      }
    });

    // Mark currently selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#6366F1',
      };
    }

    return marked;
  },

  getSeedEvents(userId: string): CalendarEvent[] {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
    const in3Days = format(addDays(today, 3), 'yyyy-MM-dd');
    const in5Days = format(addDays(today, 5), 'yyyy-MM-dd');
    const in10Days = format(addDays(today, 10), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    return [
      {
        id: 'ev-1',
        userId,
        title: 'Tech Career & Internship Fair 2026',
        date: todayStr,
        startTime: '13:00',
        endTime: '16:30',
        location: 'Student Union Grand Ballroom',
        type: 'work',
        notes: 'Bring 10 printed copies of resume and portfolio QR code.',
        reminderMinutesBefore: 30,
        color: EVENT_TYPE_COLORS.work.color,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ev-2',
        userId,
        title: 'Gym: Upper Body Strength & Cardio',
        date: todayStr,
        startTime: '18:00',
        endTime: '19:15',
        location: 'Campus Recreation Center',
        type: 'health',
        notes: 'Bench press progression + 20 min HIIT cooldown.',
        reminderMinutesBefore: 15,
        color: EVENT_TYPE_COLORS.health.color,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ev-3',
        userId,
        title: 'ACM Hackathon Strategy Meeting',
        date: tomorrowStr,
        startTime: '15:30',
        endTime: '17:00',
        location: 'Engineering Lab 204 & Discord',
        type: 'academic',
        notes: 'Finalize project scope, API endpoints, and UI prototype.',
        reminderMinutesBefore: 30,
        color: EVENT_TYPE_COLORS.academic.color,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ev-4',
        userId,
        title: 'Dinner & Board Games Night with Friends',
        date: in3Days,
        startTime: '19:30',
        endTime: '22:00',
        location: 'The Bistro Downtown',
        type: 'social',
        notes: 'Settlers of Catan and pizza party!',
        reminderMinutesBefore: 60,
        color: EVENT_TYPE_COLORS.social.color,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ev-5',
        userId,
        title: 'Algorithms Project Final Milestone Due',
        date: in5Days,
        startTime: '23:59',
        endTime: '23:59',
        location: 'Online LMS Submission',
        type: 'deadline',
        notes: 'Zip codebase and submit PDF report.',
        reminderMinutesBefore: 120,
        color: EVENT_TYPE_COLORS.deadline.color,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'ev-6',
        userId,
        title: 'Quarterly Financial & Budget Review',
        date: in10Days,
        startTime: '10:00',
        endTime: '11:00',
        location: 'Personal Desk',
        type: 'personal',
        notes: 'Review savings rate, subscriptions, and investment allocations.',
        reminderMinutesBefore: 30,
        color: EVENT_TYPE_COLORS.personal.color,
        createdAt: now,
        updatedAt: now,
      },
    ];
  },

  getFallbackSummary(userId: string): EventsSummaryData {
    const events = this.getSeedEvents(userId);
    const grouped = this.groupEventsByTimeline(events);
    return {
      events,
      grouped,
      todayCount: 2,
      upcomingThisWeekCount: 4,
    };
  },
};
