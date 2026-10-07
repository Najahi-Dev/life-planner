import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  GraduationCap,
  Plus,
  BookOpen,
  CheckSquare,
  Award,
  Layers,
  Calendar,
  Sparkles,
} from 'lucide-react-native';
import {
  Header,
  SegmentedControl,
  Skeleton,
  SkeletonList,
  EmptyState,
  Button,
  ConfettiCelebration,
  Chip,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useUniversity } from '@/features/university/hooks/useUniversity';
import {
  CourseCard,
  AssignmentCard,
  ExamCard,
  GPACalculatorCard,
  AddCourseSheet,
  AddAssignmentSheet,
  AddExamSheet,
} from '@/features/university/components';
import { UniViewMode } from '@/features/university/types';
import { hapticFeedback } from '@/utils/haptics';

export default function UniTabScreen() {
  const theme = useTheme();
  const {
    data,
    courses,
    assignments,
    exams,
    gpaSummary,
    isLoading,
    isRefetching,
    refetch,
    createCourse,
    deleteCourse,
    createAssignment,
    toggleChecklistItem,
    updateAssignmentStatus,
    deleteAssignment,
    createExam,
    updateExamProgress,
    deleteExam,
  } = useUniversity();

  const [viewMode, setViewMode] = useState<UniViewMode>('overview');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  // Bottom Sheet References
  const addCourseSheetRef = useRef<BottomSheet>(null);
  const addAssignmentSheetRef = useRef<BottomSheet>(null);
  const addExamSheetRef = useRef<BottomSheet>(null);

  const handleOpenAddCourse = () => {
    hapticFeedback.selection();
    addCourseSheetRef.current?.expand();
  };

  const handleOpenAddAssignment = () => {
    hapticFeedback.selection();
    addAssignmentSheetRef.current?.expand();
  };

  const handleOpenAddExam = () => {
    hapticFeedback.selection();
    addExamSheetRef.current?.expand();
  };

  const handleAssignmentSubmit = async (assignmentId: string, status: any) => {
    await updateAssignmentStatus({ assignmentId, status });
    setCelebrationMsg('Assignment Submitted! Great work! 🎉');
    setCelebrationVisible(true);
  };

  const handleToggleChecklist = async (assignmentId: string, itemId: string) => {
    await toggleChecklistItem({ assignmentId, itemId });
  };

  // Filter assignments & exams by selected course
  const filteredAssignments =
    selectedCourseFilter === 'all'
      ? assignments
      : assignments.filter((a) => a.courseId === selectedCourseFilter || a.courseCode === selectedCourseFilter);

  const filteredExams =
    selectedCourseFilter === 'all'
      ? exams
      : exams.filter((e) => e.courseId === selectedCourseFilter || e.courseCode === selectedCourseFilter);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* App Header */}
      <Header
        title="University Hub"
        subtitle="Courses, Assignments, Exams & GPA"
        rightAction={
          <Pressable
            onPress={
              viewMode === 'courses'
                ? handleOpenAddCourse
                : viewMode === 'exams'
                ? handleOpenAddExam
                : handleOpenAddAssignment
            }
            hitSlop={8}
            style={[
              styles.headerIconBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderRadius: theme.radius.button,
              },
            ]}
          >
            <Plus size={22} color={theme.accent.primary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.accent.primary}
            colors={[theme.accent.primary]}
          />
        }
      >
        {/* View Mode Switcher */}
        <SegmentedControl<UniViewMode>
          options={[
            { label: 'Overview', value: 'overview' },
            { label: 'Assignments', value: 'assignments' },
            { label: 'Exams', value: 'exams' },
            { label: 'Courses', value: 'courses' },
            { label: 'GPA', value: 'gpa' },
          ]}
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
          style={{ marginBottom: 14 }}
        />

        {/* Course Filter Bar (for Assignments, Exams, Courses) */}
        {courses.length > 0 && viewMode !== 'gpa' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <Chip
              label="ALL COURSES"
              selected={selectedCourseFilter === 'all'}
              onPress={() => setSelectedCourseFilter('all')}
            />
            {courses.map((c) => (
              <Chip
                key={c.id}
                label={c.code}
                selected={selectedCourseFilter === c.id || selectedCourseFilter === c.code}
                onPress={() => setSelectedCourseFilter(c.id)}
              />
            ))}
          </ScrollView>
        )}

        {/* Loading State */}
        {isLoading && !data ? (
          <View style={{ marginTop: 8 }}>
            <Skeleton height={140} borderRadius={16} style={{ marginBottom: 16 }} />
            <SkeletonList count={3} />
          </View>
        ) : (
          <>
            {/* 1. OVERVIEW VIEW */}
            {viewMode === 'overview' && (
              <View>
                {/* GPA Hero Card */}
                <GPACalculatorCard summary={gpaSummary} />

                {/* Upcoming Exams Preview */}
                {exams.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Calendar size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
                      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                        Upcoming Exams
                      </Text>
                    </View>
                    <Pressable onPress={handleOpenAddExam} hitSlop={6}>
                      <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                        + Add Exam
                      </Text>
                    </Pressable>
                  </View>
                )}

                {exams.slice(0, 2).map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onUpdateProgress={(id, prog) => updateExamProgress({ examId: id, progress: prog })}
                    onDelete={(id) => deleteExam(id)}
                  />
                ))}

                {/* Active Assignments Section */}
                <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                  <View style={styles.sectionTitleRow}>
                    <CheckSquare size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
                    <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                      Active Course Assignments
                    </Text>
                  </View>
                  <Pressable onPress={handleOpenAddAssignment} hitSlop={6}>
                    <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                      + New
                    </Text>
                  </Pressable>
                </View>

                {assignments.length > 0 ? (
                  assignments.slice(0, 3).map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onToggleChecklist={handleToggleChecklist}
                      onUpdateStatus={(id, status) => handleAssignmentSubmit(id, status)}
                      onDelete={(id) => deleteAssignment(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No assignments due"
                    description="You are all caught up on course deliverables!"
                    icon={<CheckSquare size={36} color={theme.accent.primary} />}
                    actionTitle="Add Assignment"
                    onAction={handleOpenAddAssignment}
                  />
                )}

                {/* Enrolled Courses Preview */}
                <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                  <View style={styles.sectionTitleRow}>
                    <GraduationCap size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
                    <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                      Enrolled Courses ({courses.length})
                    </Text>
                  </View>
                  <Pressable onPress={handleOpenAddCourse} hitSlop={6}>
                    <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                      + Enroll
                    </Text>
                  </Pressable>
                </View>

                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={(id) => deleteCourse(id)}
                  />
                ))}
              </View>
            )}

            {/* 2. ASSIGNMENTS VIEW */}
            {viewMode === 'assignments' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
                    {filteredAssignments.length} Assignments Found
                  </Text>
                  <Button
                    title="New Assignment"
                    onPress={handleOpenAddAssignment}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                    leftIcon={<Plus size={15} color="#FFFFFF" />}
                  />
                </View>

                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onToggleChecklist={handleToggleChecklist}
                      onUpdateStatus={(id, status) => handleAssignmentSubmit(id, status)}
                      onDelete={(id) => deleteAssignment(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No assignments found"
                    description="Add an assignment with milestone checklist items."
                    icon={<CheckSquare size={36} color={theme.accent.primary} />}
                    actionTitle="Add Assignment"
                    onAction={handleOpenAddAssignment}
                  />
                )}
              </View>
            )}

            {/* 3. EXAMS VIEW */}
            {viewMode === 'exams' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
                    {filteredExams.length} Scheduled Exams
                  </Text>
                  <Button
                    title="Schedule Exam"
                    onPress={handleOpenAddExam}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                    leftIcon={<Plus size={15} color="#FFFFFF" />}
                  />
                </View>

                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onUpdateProgress={(id, prog) => updateExamProgress({ examId: id, progress: prog })}
                      onDelete={(id) => deleteExam(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No upcoming exams"
                    description="Schedule midterm and final exams with venues and key revision topics."
                    icon={<GraduationCap size={36} color={theme.accent.primary} />}
                    actionTitle="Schedule Exam"
                    onAction={handleOpenAddExam}
                  />
                )}
              </View>
            )}

            {/* 4. COURSES VIEW */}
            {viewMode === 'courses' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
                    {courses.length} Active Courses
                  </Text>
                  <Button
                    title="Enroll Course"
                    onPress={handleOpenAddCourse}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                    leftIcon={<Plus size={15} color="#FFFFFF" />}
                  />
                </View>

                {courses.length > 0 ? (
                  courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onDelete={(id) => deleteCourse(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No courses enrolled"
                    description="Add your semester courses, credits, and target grades."
                    icon={<BookOpen size={36} color={theme.accent.primary} />}
                    actionTitle="Enroll Course"
                    onAction={handleOpenAddCourse}
                  />
                )}
              </View>
            )}

            {/* 5. GPA CALCULATOR VIEW */}
            {viewMode === 'gpa' && (
              <View>
                <GPACalculatorCard summary={gpaSummary} />

                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Award size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
                    <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                      Semester Course Weights & Grades
                    </Text>
                  </View>
                </View>

                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={(id) => deleteCourse(id)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Bottom tab bar spacer */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Add Course Bottom Sheet */}
      <AddCourseSheet
        ref={addCourseSheetRef}
        onSave={async (data) => {
          await createCourse(data);
        }}
      />

      {/* Add Assignment Bottom Sheet */}
      <AddAssignmentSheet
        ref={addAssignmentSheetRef}
        courses={courses}
        onSave={async (data) => {
          await createAssignment(data);
        }}
      />

      {/* Add Exam Bottom Sheet */}
      <AddExamSheet
        ref={addExamSheetRef}
        courses={courses}
        onSave={async (data) => {
          await createExam(data);
        }}
      />

      {/* Confetti Celebration Modal */}
      <ConfettiCelebration
        visible={celebrationVisible}
        message={celebrationMsg}
        onFinish={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
