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
import { WorkShift } from '@/types';
import { ShiftFormData } from '../schemas/shiftSchemas';
import { ShiftConflict, WeeklyShiftSummary } from '../types';
import { format, startOfWeek, endOfWeek, addDays, isWithinInterval, parseISO } from 'date-fns';

export const shiftService = {
  /**
   * Fetch user shifts ordered by date and start time
   */
  async fetchShifts(userId: string): Promise<WorkShift[]> {
    try {
      const shiftsRef = collection(db, 'users', userId, 'shifts');
      const q = query(shiftsRef, orderBy('date', 'asc'), orderBy('startTime', 'asc'));
      const snap = await getDocs(q);

      let shifts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkShift));
      if (shifts.length === 0) {
        shifts = this.getSeedShifts(userId);
      }
      return shifts;
    } catch {
      return this.getSeedShifts(userId);
    }
  },

  /**
   * Create a new work shift
   */
  async createShift(userId: string, data: ShiftFormData): Promise<WorkShift> {
    const now = new Date().toISOString();
    const newShift: Omit<WorkShift, 'id'> = {
      userId,
      title: data.title.trim(),
      companyOrRole: data.companyOrRole?.trim() || '',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      breakMinutes: data.breakMinutes || 0,
      hourlyRate: data.hourlyRate || 0,
      location: data.location?.trim() || '',
      notes: data.notes?.trim() || '',
      repeatRule: data.repeatRule || 'none',
      color: data.color || '#3B82F6',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'shifts'), newShift);
    return { id: docRef.id, ...newShift };
  },

  /**
   * Update an existing shift
   */
  async updateShift(userId: string, shiftId: string, data: Partial<ShiftFormData>): Promise<void> {
    const now = new Date().toISOString();
    const docRef = doc(db, 'users', userId, 'shifts', shiftId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: now,
    });
  },

  /**
   * Delete a shift
   */
  async deleteShift(userId: string, shiftId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'shifts', shiftId);
    await deleteDoc(docRef);
  },

  /**
   * Detect overlapping shifts on the same date
   */
  detectConflicts(shifts: WorkShift[]): ShiftConflict[] {
    const conflicts: ShiftConflict[] = [];
    const dateMap: Record<string, WorkShift[]> = {};

    shifts.forEach((shift) => {
      if (!dateMap[shift.date]) {
        dateMap[shift.date] = [];
      }
      dateMap[shift.date].push(shift);
    });

    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    Object.entries(dateMap).forEach(([date, dayShifts]) => {
      if (dayShifts.length < 2) return;

      for (let i = 0; i < dayShifts.length; i++) {
        for (let j = i + 1; j < dayShifts.length; j++) {
          const a = dayShifts[i];
          const b = dayShifts[j];

          const startA = timeToMinutes(a.startTime);
          const endA = timeToMinutes(a.endTime);
          const startB = timeToMinutes(b.startTime);
          const endB = timeToMinutes(b.endTime);

          // Check overlap interval: startA < endB && startB < endA
          if (startA < endB && startB < endA) {
            conflicts.push({
              shiftA: a,
              shiftB: b,
              date,
              description: `"${a.title}" (${a.startTime}-${a.endTime}) overlaps with "${b.title}" (${b.startTime}-${b.endTime})`,
            });
          }
        }
      }
    });

    return conflicts;
  },

  /**
   * Calculate total weekly hours and earnings
   */
  calculateWeeklySummary(shifts: WorkShift[], referenceDate: Date = new Date()): WeeklyShiftSummary {
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });

    const weekShifts = shifts.filter((s) => {
      try {
        const d = parseISO(s.date);
        return isWithinInterval(d, { start: weekStart, end: weekEnd });
      } catch {
        return false;
      }
    });

    let totalHours = 0;
    let totalEarnings = 0;

    weekShifts.forEach((s) => {
      const [startH, startM] = s.startTime.split(':').map(Number);
      const [endH, endM] = s.endTime.split(':').map(Number);
      const duration = Math.max(0, (endH * 60 + endM - (startH * 60 + startM) - (s.breakMinutes || 0)) / 60);

      totalHours += duration;
      if (s.hourlyRate) {
        totalEarnings += duration * s.hourlyRate;
      }
    });

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalEarnings: Math.round(totalEarnings),
      shiftCount: weekShifts.length,
      weekStart: format(weekStart, 'MMM d'),
      weekEnd: format(weekEnd, 'MMM d'),
    };
  },

  getSeedShifts(userId: string): WorkShift[] {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const day3 = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    const day5 = format(addDays(new Date(), 5), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    return [
      {
        id: 'shift-101',
        userId,
        title: 'Frontend Developer Intern',
        companyOrRole: 'TechNova Solutions',
        date: today,
        startTime: '13:00',
        endTime: '17:00',
        breakMinutes: 15,
        hourlyRate: 28,
        location: 'Innovation Hub, Floor 4',
        repeatRule: 'weekly',
        notes: 'Sprint demo and code review session with lead engineer',
        color: '#3B82F6',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'shift-102',
        userId,
        title: 'Computer Lab Teaching Assistant',
        companyOrRole: 'University CS Dept',
        date: tomorrow,
        startTime: '09:00',
        endTime: '12:00',
        breakMinutes: 0,
        hourlyRate: 22,
        location: 'Turing Hall, Lab 102',
        repeatRule: 'weekly',
        notes: 'Help freshmen students with data structures lab assignments',
        color: '#8B5CF6',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'shift-103',
        userId,
        title: 'Frontend Developer Intern',
        companyOrRole: 'TechNova Solutions',
        date: day3,
        startTime: '13:00',
        endTime: '18:00',
        breakMinutes: 30,
        hourlyRate: 28,
        location: 'Innovation Hub, Floor 4',
        repeatRule: 'weekly',
        notes: 'Feature development and unit test writing',
        color: '#3B82F6',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'shift-104',
        userId,
        title: 'Campus IT Helpdesk Shift',
        companyOrRole: 'Student Tech Services',
        date: day5,
        startTime: '10:00',
        endTime: '14:00',
        breakMinutes: 15,
        hourlyRate: 20,
        location: 'Student Union Room 110',
        repeatRule: 'biweekly',
        notes: 'Network troubleshooting and device setup',
        color: '#10B981',
        createdAt: now,
        updatedAt: now,
      },
    ];
  },
};
