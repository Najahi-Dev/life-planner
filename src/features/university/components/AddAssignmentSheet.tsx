import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CheckSquare, Plus, Trash2 } from 'lucide-react-native';
import { Sheet, Button, Input, Select, DateTimeField, Chip, SelectOption } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { UniCourse } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { UniAssignmentFormData } from '../schemas/uniSchemas';
import { format } from 'date-fns';

export interface AddAssignmentSheetProps {
  courses: UniCourse[];
  onSave: (data: UniAssignmentFormData) => Promise<void>;
}

export const AddAssignmentSheet = forwardRef<BottomSheet, AddAssignmentSheetProps>(
  ({ courses, onSave }, ref) => {
    const theme = useTheme();

    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c1');
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)); // in 3 days
    const [dueTime, setDueTime] = useState<Date>(new Date());
    const [weightPercent, setWeightPercent] = useState('15');
    const [notes, setNotes] = useState('');
    const [newStepText, setNewStepText] = useState('');
    const [checklistItems, setChecklistItems] = useState<{ id: string; title: string; completed: boolean }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const weights = [5, 10, 15, 20, 25, 30];

    const handleAddStep = () => {
      if (!newStepText.trim()) return;
      hapticFeedback.light();
      setChecklistItems((prev) => [
        ...prev,
        { id: `chk-${Date.now()}`, title: newStepText.trim(), completed: false },
      ]);
      setNewStepText('');
    };

    const handleRemoveStep = (id: string) => {
      hapticFeedback.light();
      setChecklistItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleSave = async () => {
      if (!title.trim()) {
        hapticFeedback.warning();
        return;
      }

      const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

      setIsSubmitting(true);
      try {
        await onSave({
          courseId: activeCourse?.id || 'c1',
          courseCode: activeCourse?.code || 'CS301',
          title: title.trim(),
          dueDate: format(dueDate, 'yyyy-MM-dd'),
          dueTime: format(dueTime, 'HH:mm'),
          weightPercent: Number(weightPercent) || 15,
          notes: notes.trim(),
          checklist: checklistItems,
        });

        hapticFeedback.success();
        (ref as any)?.current?.close();

        // Reset form
        setTitle('');
        setNotes('');
        setChecklistItems([]);
      } catch {
        hapticFeedback.error();
      } finally {
        setIsSubmitting(false);
      }
    };

    const courseOptions: SelectOption<string>[] = courses.map((c) => ({
      label: `${c.code} - ${c.name}`,
      value: c.id,
      subtitle: `${c.credits} credits`,
    }));

    return (
      <Sheet ref={ref} snapPoints={['85%', '95%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            New Course Assignment
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Create an assignment with due date, weight %, and milestone checklist
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Course Selector */}
          <Select<string>
            label="Select Course"
            data={courseOptions}
            value={selectedCourseId}
            onChange={(item) => setSelectedCourseId(item.value)}
            placeholder="Select course..."
          />

          {/* Title */}
          <Input
            label="Assignment Title"
            placeholder="e.g. Dijkstra Algorithm Project"
            value={title}
            onChangeText={setTitle}
            required
          />

          {/* Due Date & Time */}
          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <DateTimeField label="Due Date" mode="date" value={dueDate} onChange={setDueDate} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <DateTimeField label="Due Time" mode="time" value={dueTime} onChange={setDueTime} />
            </View>
          </View>

          {/* Weight Chips */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Grade Weight Percent
          </Text>
          <View style={styles.chipsRow}>
            {weights.map((w) => (
              <Chip
                key={w}
                label={`${w}%`}
                selected={Number(weightPercent) === w}
                onPress={() => {
                  setWeightPercent(String(w));
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Milestone Checklist Builder */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 8 }]}>
            Milestones & Sub-tasks
          </Text>

          {checklistItems.map((item) => (
            <View key={item.id} style={styles.stepRow}>
              <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
                • {item.title}
              </Text>
              <Pressable onPress={() => handleRemoveStep(item.id)} hitSlop={6}>
                <Trash2 size={16} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          ))}

          <View style={styles.addStepRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                placeholder="Add sub-task or milestone..."
                value={newStepText}
                onChangeText={setNewStepText}
              />
            </View>
            <Button
              title="Add"
              onPress={handleAddStep}
              variant="secondary"
              size="secondary"
              fullWidth={false}
              leftIcon={<Plus size={16} color={theme.colors.text} />}
            />
          </View>

          {/* Notes */}
          <Input
            label="Instructions & Submission Notes"
            placeholder="e.g. Upload PDF and source zip to LMS..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <Button
            title="Create Assignment"
            onPress={handleSave}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<CheckSquare size={20} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

AddAssignmentSheet.displayName = 'AddAssignmentSheet';

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  formContent: {
    paddingTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    width: '100%',
  },
  fieldLabel: {
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  addStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
