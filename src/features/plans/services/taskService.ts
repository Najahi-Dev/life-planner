import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { TaskItem } from '@/types';
import { TaskFormData } from '../schemas/taskSchemas';
import { TaskFilterOptions } from '../types';
import { format, addDays, subDays } from 'date-fns';

export const taskService = {
  /**
   * Fetch user's tasks with optional filters
   */
  async fetchTasks(userId: string, filters?: TaskFilterOptions): Promise<TaskItem[]> {
    try {
      const tasksRef = collection(db, 'users', userId, 'tasks');
      let q = query(tasksRef, orderBy('dueDate', 'asc'));

      const snap = await getDocs(q);
      let tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TaskItem));

      if (tasks.length === 0) {
        tasks = this.getSeedTasks(userId);
      }

      // Apply client-side filters
      if (filters) {
        if (filters.status === 'pending') {
          tasks = tasks.filter((t) => t.status !== 'completed');
        } else if (filters.status === 'completed') {
          tasks = tasks.filter((t) => t.status === 'completed');
        }

        if (filters.priority && filters.priority !== 'all') {
          tasks = tasks.filter((t) => t.priority === filters.priority);
        }

        if (filters.category && filters.category !== 'all') {
          tasks = tasks.filter((t) => t.category === filters.category);
        }

        if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
          const lower = filters.searchQuery.toLowerCase().trim();
          tasks = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(lower) ||
              (t.notes && t.notes.toLowerCase().includes(lower)),
          );
        }

        if (filters.sortBy === 'priority') {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
          tasks.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
        } else if (filters.sortBy === 'title') {
          tasks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filters.sortBy === 'orderIndex') {
          tasks.sort((a, b) => a.orderIndex - b.orderIndex);
        }
      }

      return tasks;
    } catch {
      let fallback = this.getSeedTasks(userId);
      if (filters?.searchQuery) {
        const lower = filters.searchQuery.toLowerCase();
        fallback = fallback.filter((t) => t.title.toLowerCase().includes(lower));
      }
      return fallback;
    }
  },

  /**
   * Create a new task
   */
  async createTask(userId: string, data: TaskFormData): Promise<TaskItem> {
    const now = new Date().toISOString();
    const newTask: Omit<TaskItem, 'id'> = {
      userId,
      title: data.title.trim(),
      notes: data.notes?.trim() || '',
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
      dueTime: data.dueTime || undefined,
      repeat: data.repeat,
      reminderMinutesBefore: data.reminderMinutesBefore,
      status: data.status || 'pending',
      orderIndex: Date.now(),
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'tasks'), newTask);
    return { id: docRef.id, ...newTask };
  },

  /**
   * Update an existing task
   */
  async updateTask(userId: string, taskId: string, data: Partial<TaskFormData>): Promise<void> {
    const now = new Date().toISOString();
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: now,
    });
  },

  /**
   * Delete a task
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(docRef);
  },

  /**
   * Toggle task completed status
   */
  async toggleTaskStatus(userId: string, taskId: string, currentStatus: string): Promise<void> {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const now = new Date().toISOString();
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(docRef, {
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? now : null,
      updatedAt: now,
    });
  },

  /**
   * Reorder tasks and persist new orderIndices
   */
  async reorderTasks(userId: string, taskIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    taskIds.forEach((id, idx) => {
      const docRef = doc(db, 'users', userId, 'tasks', id);
      batch.update(docRef, { orderIndex: idx, updatedAt: now });
    });

    try {
      await batch.commit();
    } catch {
      // Fallback
    }
  },

  getSeedTasks(userId: string): TaskItem[] {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const dayAfter = format(addDays(new Date(), 2), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    return [
      {
        id: 'task-101',
        userId,
        title: 'Review Operating Systems Lecture 4',
        notes: 'Processes, Threads, Context Switching & CPU Scheduling diagrams',
        priority: 'high',
        category: 'uni',
        dueDate: today,
        dueTime: '10:30',
        repeat: 'none',
        status: 'pending',
        orderIndex: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-102',
        userId,
        title: 'Morning 20-min Cardio & Workout',
        notes: 'Stretching and hydration routine',
        priority: 'medium',
        category: 'health',
        dueDate: today,
        dueTime: '08:00',
        repeat: 'daily',
        status: 'completed',
        completedAt: now,
        orderIndex: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-103',
        userId,
        title: 'Complete React Native Navigation Module',
        notes: 'Custom bottom tab bar, Reanimated worklets, and modal screens',
        priority: 'urgent',
        category: 'study',
        dueDate: today,
        dueTime: '15:00',
        repeat: 'none',
        status: 'pending',
        orderIndex: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-104',
        userId,
        title: 'Submit Weekly Timesheet',
        notes: 'Log internship hours (16 hours total this week)',
        priority: 'low',
        category: 'work',
        dueDate: today,
        dueTime: '18:00',
        repeat: 'weekly',
        status: 'pending',
        orderIndex: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-105',
        userId,
        title: 'Algorithms Homework: Graph Traversal',
        notes: 'Implement Dijkstra and BFS solutions in TypeScript',
        priority: 'high',
        category: 'uni',
        dueDate: tomorrow,
        dueTime: '14:00',
        repeat: 'none',
        status: 'pending',
        orderIndex: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-106',
        userId,
        title: 'Monthly Budget & Savings Review',
        notes: 'Categorize expenses and update investment target',
        priority: 'medium',
        category: 'finance',
        dueDate: dayAfter,
        dueTime: '19:30',
        repeat: 'monthly',
        status: 'pending',
        orderIndex: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-107',
        userId,
        title: 'Prepare Presentation Slides for Capstone',
        notes: 'Include architecture diagrams and demo screenshots',
        priority: 'urgent',
        category: 'uni',
        dueDate: yesterday,
        dueTime: '16:00',
        repeat: 'none',
        status: 'completed',
        completedAt: now,
        orderIndex: 6,
        createdAt: now,
        updatedAt: now,
      },
    ];
  },
};
