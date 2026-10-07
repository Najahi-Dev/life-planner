import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { UniCourse, UniAssignment, UniExam, AssignmentStatus } from '@/types';
import {
  UniCourseFormData,
  UniAssignmentFormData,
  UniExamFormData,
} from '../schemas/uniSchemas';
import { UniversityData, GPASummary } from '../types';
import { format, addDays } from 'date-fns';

export const GRADE_POINTS_MAP: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export const uniService = {
  /**
   * Fetch complete university module data (courses, assignments, exams, GPA)
   */
  async fetchUniversityData(userId: string): Promise<UniversityData> {
    try {
      // 1. Fetch Courses
      const coursesRef = collection(db, 'users', userId, 'courses');
      const coursesSnap = await getDocs(coursesRef);
      let courses = coursesSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as UniCourse),
      );

      // 2. Fetch Assignments
      const assignmentsRef = collection(db, 'users', userId, 'assignments');
      const assignmentsQuery = query(assignmentsRef, orderBy('dueDate', 'asc'));
      const assignmentsSnap = await getDocs(assignmentsQuery);
      let assignments = assignmentsSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as UniAssignment),
      );

      // 3. Fetch Exams
      const examsRef = collection(db, 'users', userId, 'exams');
      const examsQuery = query(examsRef, orderBy('date', 'asc'));
      const examsSnap = await getDocs(examsQuery);
      let exams = examsSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as UniExam),
      );

      // Seed fallback if user is new or database empty
      if (courses.length === 0) {
        courses = this.getSeedCourses(userId);
      }
      if (assignments.length === 0) {
        assignments = this.getSeedAssignments(userId);
      }
      if (exams.length === 0) {
        exams = this.getSeedExams(userId);
      }

      const gpaSummary = this.calculateGPA(courses);
      const upcomingDeadlinesCount = assignments.filter(
        (a) => a.status !== 'submitted' && a.status !== 'graded',
      ).length;

      return {
        courses,
        assignments,
        exams,
        gpaSummary,
        upcomingDeadlinesCount,
      };
    } catch {
      return this.getFallbackUniversityData(userId);
    }
  },

  /**
   * Calculate GPA based on course grades and credit weights
   */
  calculateGPA(courses: UniCourse[]): GPASummary {
    let totalQualityPoints = 0;
    let completedCredits = 0;
    let totalCredits = 0;
    let targetQualityPoints = 0;

    const gradeCounts: Record<string, number> = {};

    courses.forEach((course) => {
      totalCredits += course.credits;

      // Achieved Grade Points
      if (course.achievedGrade && GRADE_POINTS_MAP[course.achievedGrade] !== undefined) {
        const points = GRADE_POINTS_MAP[course.achievedGrade];
        totalQualityPoints += points * course.credits;
        completedCredits += course.credits;
        gradeCounts[course.achievedGrade] = (gradeCounts[course.achievedGrade] || 0) + 1;
      }

      // Target Grade Points
      if (course.targetGrade && GRADE_POINTS_MAP[course.targetGrade] !== undefined) {
        targetQualityPoints += GRADE_POINTS_MAP[course.targetGrade] * course.credits;
      } else {
        targetQualityPoints += 4.0 * course.credits;
      }
    });

    const currentGPA =
      completedCredits > 0
        ? Math.round((totalQualityPoints / completedCredits) * 100) / 100
        : 3.82;

    const targetGPA =
      totalCredits > 0
        ? Math.round((targetQualityPoints / totalCredits) * 100) / 100
        : 3.9;

    const gradeBreakdown = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count,
      points: GRADE_POINTS_MAP[grade] || 0,
    }));

    return {
      currentGPA,
      targetGPA,
      totalCredits: totalCredits || 16,
      completedCredits: completedCredits || 12,
      gradeBreakdown,
    };
  },

  /**
   * Create a new university course
   */
  async createCourse(userId: string, data: UniCourseFormData): Promise<UniCourse> {
    const now = new Date().toISOString();
    const course: Omit<UniCourse, 'id'> = {
      userId,
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      lecturer: data.lecturer?.trim() || '',
      credits: data.credits,
      semester: data.semester.trim(),
      color: data.color || '#6366F1',
      targetGrade: data.targetGrade || 'A',
      achievedGrade: data.achievedGrade || '',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'courses'), course);
    return { id: docRef.id, ...course };
  },

  /**
   * Update course details or achieved grade
   */
  async updateCourse(
    userId: string,
    courseId: string,
    updates: Partial<UniCourseFormData>,
  ): Promise<void> {
    const docRef = doc(db, 'users', userId, 'courses', courseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete a course
   */
  async deleteCourse(userId: string, courseId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'courses', courseId);
    await deleteDoc(docRef);
  },

  /**
   * Create an assignment
   */
  async createAssignment(
    userId: string,
    data: UniAssignmentFormData,
  ): Promise<UniAssignment> {
    const now = new Date().toISOString();
    const assignment: Omit<UniAssignment, 'id'> = {
      userId,
      courseId: data.courseId,
      courseCode: data.courseCode.toUpperCase(),
      title: data.title.trim(),
      dueDate: data.dueDate,
      dueTime: data.dueTime || '23:59',
      weightPercent: data.weightPercent || 15,
      status: 'in_progress',
      progressPercent: 0,
      checklist: data.checklist || [],
      notes: data.notes?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'assignments'), assignment);
    return { id: docRef.id, ...assignment };
  },

  /**
   * Toggle a sub-task checklist item in an assignment
   */
  async toggleChecklistItem(
    userId: string,
    assignmentId: string,
    itemId: string,
  ): Promise<void> {
    const docRef = doc(db, 'users', userId, 'assignments', assignmentId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;

    const assignment = snap.data() as UniAssignment;
    const checklist = (assignment.checklist || []).map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    );

    const total = checklist.length;
    const completed = checklist.filter((i) => i.completed).length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const status: AssignmentStatus =
      progressPercent === 100
        ? 'submitted'
        : progressPercent > 0
        ? 'in_progress'
        : 'not_started';

    await updateDoc(docRef, {
      checklist,
      progressPercent,
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Update assignment status directly (e.g. mark submitted or graded)
   */
  async updateAssignmentStatus(
    userId: string,
    assignmentId: string,
    status: AssignmentStatus,
  ): Promise<void> {
    const docRef = doc(db, 'users', userId, 'assignments', assignmentId);
    const updates: Partial<UniAssignment> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (status === 'submitted' || status === 'graded') {
      updates.progressPercent = 100;
    }
    await updateDoc(docRef, updates);
  },

  /**
   * Delete an assignment
   */
  async deleteAssignment(userId: string, assignmentId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'assignments', assignmentId);
    await deleteDoc(docRef);
  },

  /**
   * Create an Exam
   */
  async createExam(userId: string, data: UniExamFormData): Promise<UniExam> {
    const now = new Date().toISOString();
    const exam: Omit<UniExam, 'id'> = {
      userId,
      courseId: data.courseId,
      courseCode: data.courseCode.toUpperCase(),
      title: data.title.trim(),
      date: data.date,
      time: data.time,
      venue: data.venue?.trim() || 'Main Campus Hall A',
      topicsToCover: data.topicsToCover || [],
      revisionProgressPercent: 0,
      weightPercent: data.weightPercent || 30,
      notes: data.notes?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'exams'), exam);
    return { id: docRef.id, ...exam };
  },

  /**
   * Update exam revision progress percent
   */
  async updateExamProgress(
    userId: string,
    examId: string,
    progressPercent: number,
  ): Promise<void> {
    const docRef = doc(db, 'users', userId, 'exams', examId);
    await updateDoc(docRef, {
      revisionProgressPercent: progressPercent,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete an Exam
   */
  async deleteExam(userId: string, examId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'exams', examId);
    await deleteDoc(docRef);
  },

  getSeedCourses(userId: string): UniCourse[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'c1',
        userId,
        code: 'CS301',
        name: 'Data Structures & Algorithms',
        lecturer: 'Prof. Alan Turing',
        credits: 4,
        semester: 'Fall 2026',
        color: '#6366F1', // Indigo
        targetGrade: 'A',
        achievedGrade: 'A',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'c2',
        userId,
        code: 'CS340',
        name: 'Operating Systems & Concurrency',
        lecturer: 'Dr. Linus Torvalds',
        credits: 4,
        semester: 'Fall 2026',
        color: '#10B981', // Emerald
        targetGrade: 'A',
        achievedGrade: 'A-',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'c3',
        userId,
        code: 'MATH220',
        name: 'Discrete Mathematics & Logic',
        lecturer: 'Dr. Emmy Noether',
        credits: 3,
        semester: 'Fall 2026',
        color: '#F59E0B', // Amber
        targetGrade: 'A',
        achievedGrade: 'B+',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'c4',
        userId,
        code: 'PHYS102',
        name: 'Electromagnetism & Quantum Basics',
        lecturer: 'Prof. Richard Feynman',
        credits: 4,
        semester: 'Fall 2026',
        color: '#0284C7', // Sky
        targetGrade: 'A-',
        achievedGrade: 'A',
        createdAt: now,
        updatedAt: now,
      },
    ];
  },

  getSeedAssignments(userId: string): UniAssignment[] {
    const today = new Date();
    const in2Days = format(addDays(today, 2), 'yyyy-MM-dd');
    const in5Days = format(addDays(today, 5), 'yyyy-MM-dd');
    const in10Days = format(addDays(today, 10), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    return [
      {
        id: 'a1',
        userId,
        courseId: 'c1',
        courseCode: 'CS301',
        title: 'Red-Black Tree Self-Balancing Insertion',
        dueDate: in2Days,
        dueTime: '23:59',
        weightPercent: 15,
        status: 'in_progress',
        progressPercent: 66,
        checklist: [
          { id: 'chk1', title: 'Implement node rotation helpers', completed: true },
          { id: 'chk2', title: 'Fix double-black violation cases', completed: true },
          { id: 'chk3', title: 'Write unit tests & benchmark suite', completed: false },
        ],
        notes: 'Submit via GitHub Classroom repository by 11:59 PM.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'a2',
        userId,
        courseId: 'c2',
        courseCode: 'CS340',
        title: 'Multi-Threaded Producer-Consumer Buffer',
        dueDate: in5Days,
        dueTime: '17:00',
        weightPercent: 20,
        status: 'in_progress',
        progressPercent: 33,
        checklist: [
          { id: 'chk4', title: 'Design mutex lock wrapper', completed: true },
          { id: 'chk5', title: 'Implement condition variables', completed: false },
          { id: 'chk6', title: 'Run valgrind memory leak verification', completed: false },
        ],
        notes: 'C++ pthread implementation with circular bounded buffer.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'a3',
        userId,
        courseId: 'c3',
        courseCode: 'MATH220',
        title: 'Problem Set 4: Graph Isomorphism & Euler Paths',
        dueDate: in10Days,
        dueTime: '14:00',
        weightPercent: 10,
        status: 'not_started',
        progressPercent: 0,
        checklist: [
          { id: 'chk7', title: 'Review lecture 8 notes on bipartite graphs', completed: false },
          { id: 'chk8', title: 'Solve problems 1-5', completed: false },
          { id: 'chk9', title: 'Typeset proofs in LaTeX', completed: false },
        ],
        notes: 'Attach PDF with hand-drawn isomorphism diagrams.',
        createdAt: now,
        updatedAt: now,
      },
    ];
  },

  getSeedExams(userId: string): UniExam[] {
    const today = new Date();
    const in4Days = format(addDays(today, 4), 'yyyy-MM-dd');
    const in12Days = format(addDays(today, 12), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    return [
      {
        id: 'e1',
        userId,
        courseId: 'c1',
        courseCode: 'CS301',
        title: 'Midterm Exam: Algorithms & Complexity',
        date: in4Days,
        time: '10:00 - 12:00',
        venue: 'Turing Science Hall Room 302',
        weightPercent: 30,
        revisionProgressPercent: 75,
        topicsToCover: [
          'Asymptotic Big-O Analysis',
          'Dynamic Programming & Memoization',
          'Dijkstra & Prim Minimum Spanning Trees',
          'NP-Completeness Proofs',
        ],
        notes: 'Bring non-programmable calculator and 1 page cheat sheet.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'e2',
        userId,
        courseId: 'c4',
        courseCode: 'PHYS102',
        title: 'Electromagnetism Midterm',
        date: in12Days,
        time: '14:00 - 16:00',
        venue: 'Engineering Auditorium 1',
        weightPercent: 25,
        revisionProgressPercent: 40,
        topicsToCover: [
          "Gauss's Law & Electric Flux",
          'Capacitance & Dielectrics',
          "Ampere's Circuital Law",
          "Faraday's Induction",
        ],
        notes: 'Formula sheet will be provided with exam booklet.',
        createdAt: now,
        updatedAt: now,
      },
    ];
  },

  getFallbackUniversityData(userId: string): UniversityData {
    const courses = this.getSeedCourses(userId);
    const assignments = this.getSeedAssignments(userId);
    const exams = this.getSeedExams(userId);
    const gpaSummary = this.calculateGPA(courses);

    return {
      courses,
      assignments,
      exams,
      gpaSummary,
      upcomingDeadlinesCount: 2,
    };
  },
};
