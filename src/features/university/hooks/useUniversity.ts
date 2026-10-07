import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { uniService } from '../services/uniService';
import {
  UniCourseFormData,
  UniAssignmentFormData,
  UniExamFormData,
} from '../schemas/uniSchemas';
import { UniversityData } from '../types';
import { AssignmentStatus } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export function useUniversity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'guest-user';

  const uniQuery = useQuery<UniversityData>({
    queryKey: ['universityData', userId],
    queryFn: () => uniService.fetchUniversityData(userId),
    staleTime: 1000 * 60 * 2,
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: UniCourseFormData) => uniService.createCourse(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: Partial<UniCourseFormData> }) =>
      uniService.updateCourse(userId, courseId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => uniService.deleteCourse(userId, courseId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const createAssignmentMutation = useMutation({
    mutationFn: (data: UniAssignmentFormData) => uniService.createAssignment(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: ({ assignmentId, itemId }: { assignmentId: string; itemId: string }) =>
      uniService.toggleChecklistItem(userId, assignmentId, itemId),
    onMutate: async ({ assignmentId, itemId }) => {
      await queryClient.cancelQueries({ queryKey: ['universityData', userId] });
      const previous = queryClient.getQueryData<UniversityData>(['universityData', userId]);

      if (previous) {
        queryClient.setQueryData<UniversityData>(['universityData', userId], {
          ...previous,
          assignments: previous.assignments.map((a) => {
            if (a.id !== assignmentId) return a;
            const updatedChecklist = a.checklist.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item,
            );
            const completedCount = updatedChecklist.filter((i) => i.completed).length;
            const progress = Math.round((completedCount / updatedChecklist.length) * 100);
            return {
              ...a,
              checklist: updatedChecklist,
              progressPercent: progress,
              status: progress === 100 ? 'submitted' : progress > 0 ? 'in_progress' : 'not_started',
            };
          }),
        });
      }

      hapticFeedback.light();
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['universityData', userId], context.previous);
      }
      hapticFeedback.error();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
  });

  const updateAssignmentStatusMutation = useMutation({
    mutationFn: ({ assignmentId, status }: { assignmentId: string; status: AssignmentStatus }) =>
      uniService.updateAssignmentStatus(userId, assignmentId, status),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignmentId: string) => uniService.deleteAssignment(userId, assignmentId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const createExamMutation = useMutation({
    mutationFn: (data: UniExamFormData) => uniService.createExam(userId, data),
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const updateExamProgressMutation = useMutation({
    mutationFn: ({ examId, progress }: { examId: string; progress: number }) =>
      uniService.updateExamProgress(userId, examId, progress),
    onSuccess: () => {
      hapticFeedback.selection();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  const deleteExamMutation = useMutation({
    mutationFn: (examId: string) => uniService.deleteExam(userId, examId),
    onSuccess: () => {
      hapticFeedback.heavy();
      queryClient.invalidateQueries({ queryKey: ['universityData', userId] });
    },
    onError: () => hapticFeedback.error(),
  });

  return {
    data: uniQuery.data,
    courses: uniQuery.data?.courses || [],
    assignments: uniQuery.data?.assignments || [],
    exams: uniQuery.data?.exams || [],
    gpaSummary: uniQuery.data?.gpaSummary,
    isLoading: uniQuery.isLoading,
    isRefetching: uniQuery.isRefetching,
    refetch: uniQuery.refetch,
    createCourse: createCourseMutation.mutateAsync,
    updateCourse: updateCourseMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,
    createAssignment: createAssignmentMutation.mutateAsync,
    toggleChecklistItem: toggleChecklistMutation.mutateAsync,
    updateAssignmentStatus: updateAssignmentStatusMutation.mutateAsync,
    deleteAssignment: deleteAssignmentMutation.mutateAsync,
    createExam: createExamMutation.mutateAsync,
    updateExamProgress: updateExamProgressMutation.mutateAsync,
    deleteExam: deleteExamMutation.mutateAsync,
  };
}
