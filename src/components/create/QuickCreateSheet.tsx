import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  CheckSquare,
  Briefcase,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Plus,
} from 'lucide-react-native';
import {
  Sheet,
  Button,
  Input,
  Select,
  DateTimeField,
  Chip,
  SegmentedControl,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { format } from 'date-fns';
import { Priority, TaskCategory, TaskRepeat, EventType } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export type CreateType = 'task' | 'shift' | 'assignment' | 'exam' | 'study' | 'event';

export interface QuickCreateSheetProps {
  onSuccess?: (type: CreateType, message: string) => void;
}

export const QuickCreateSheet = forwardRef<BottomSheet, QuickCreateSheetProps>(
  ({ onSuccess }, ref) => {
    const theme = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [selectedType, setSelectedType] = useState<CreateType>('task');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<TaskCategory>('study');
    const [repeat, setRepeat] = useState<TaskRepeat>('none');
    const [date, setDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 2)); // 2 hrs later
    const [location, setLocation] = useState('');
    const [courseCode, setCourseCode] = useState('CS301');
    const [durationMinutes, setDurationMinutes] = useState('45');
    const [hourlyRate, setHourlyRate] = useState('25');
    const [eventType, setEventType] = useState<EventType>('academic');

    const handleCreate = async () => {
      if (!title.trim()) {
        hapticFeedback.warning();
        return;
      }

      const userId = user?.uid || 'guest-user';
      const now = new Date().toISOString();
      const dateStr = format(date, 'yyyy-MM-dd');
      const startTimeStr = format(startTime, 'HH:mm');
      const endTimeStr = format(endTime, 'HH:mm');

      setIsSubmitting(true);
      try {
        if (selectedType === 'task') {
          await addDoc(collection(db, 'users', userId, 'tasks'), {
            title: title.trim(),
            notes: notes.trim(),
            priority,
            category,
            dueDate: dateStr,
            dueTime: startTimeStr,
            repeat,
            status: 'pending',
            orderIndex: Date.now(),
            createdAt: now,
            updatedAt: now,
            userId,
          });
        } else if (selectedType === 'shift') {
          await addDoc(collection(db, 'users', userId, 'shifts'), {
            title: title.trim(),
            companyOrRole: notes.trim() || 'Tech Internship',
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            location: location.trim(),
            hourlyRate: parseFloat(hourlyRate) || 25,
            createdAt: now,
            updatedAt: now,
            userId,
          });
        } else if (selectedType === 'assignment') {
          await addDoc(collection(db, 'users', userId, 'assignments'), {
            courseCode: courseCode.trim().toUpperCase(),
            courseId: 'course-1',
            title: title.trim(),
            dueDate: dateStr,
            dueTime: startTimeStr,
            weightPercent: 15,
            status: 'in_progress',
            progressPercent: 0,
            checklist: [],
            notes: notes.trim(),
            createdAt: now,
            updatedAt: now,
            userId,
          });
        } else if (selectedType === 'exam') {
          await addDoc(collection(db, 'users', userId, 'exams'), {
            courseCode: courseCode.trim().toUpperCase(),
            courseId: 'course-1',
            title: title.trim(),
            date: dateStr,
            time: startTimeStr,
            venue: location.trim() || 'Main Hall 101',
            topicsToCover: [],
            revisionProgressPercent: 0,
            notes: notes.trim(),
            createdAt: now,
            updatedAt: now,
            userId,
          });
        } else if (selectedType === 'study') {
          await addDoc(collection(db, 'users', userId, 'studySessions'), {
            topicId: 'topic-1',
            topicTitle: title.trim(),
            durationMinutes: parseInt(durationMinutes, 10) || 45,
            notes: notes.trim(),
            date: dateStr,
            createdAt: now,
            updatedAt: now,
            userId,
          });
        } else if (selectedType === 'event') {
          await addDoc(collection(db, 'users', userId, 'events'), {
            title: title.trim(),
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            location: location.trim(),
            type: eventType,
            notes: notes.trim(),
            createdAt: now,
            updatedAt: now,
            userId,
          });
        }

        hapticFeedback.success();
        queryClient.invalidateQueries();

        // Reset inputs
        setTitle('');
        setNotes('');
        setLocation('');

        // Close sheet
        (ref as any)?.current?.close();

        onSuccess?.(selectedType, `New ${selectedType} added to your plan!`);
      } catch {
        hapticFeedback.error();
      } finally {
        setIsSubmitting(false);
      }
    };

    const typeIcons: Record<CreateType, React.ReactNode> = {
      task: <CheckSquare size={16} color={selectedType === 'task' ? theme.accent.primary : theme.colors.text} />,
      shift: <Briefcase size={16} color={selectedType === 'shift' ? theme.accent.primary : theme.colors.text} />,
      assignment: <Layers size={16} color={selectedType === 'assignment' ? theme.accent.primary : theme.colors.text} />,
      exam: <GraduationCap size={16} color={selectedType === 'exam' ? theme.accent.primary : theme.colors.text} />,
      study: <BookOpen size={16} color={selectedType === 'study' ? theme.accent.primary : theme.colors.text} />,
      event: <Calendar size={16} color={selectedType === 'event' ? theme.accent.primary : theme.colors.text} />,
    };

    return (
      <Sheet ref={ref} snapPoints={['75%', '92%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            Quick Create
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Add a task, shift, assignment, exam, or study session
          </Text>
        </View>

        {/* Type Selector Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScroll}
        >
          {(['task', 'shift', 'assignment', 'exam', 'study', 'event'] as CreateType[]).map((t) => (
            <Chip
              key={t}
              label={t.toUpperCase()}
              icon={typeIcons[t]}
              selected={selectedType === t}
              onPress={() => setSelectedType(t)}
            />
          ))}
        </ScrollView>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Common Title */}
          <Input
            label={
              selectedType === 'task'
                ? 'Task Title'
                : selectedType === 'shift'
                ? 'Shift Role / Title'
                : selectedType === 'assignment'
                ? 'Assignment Title'
                : selectedType === 'exam'
                ? 'Exam Title'
                : selectedType === 'study'
                ? 'Study Topic'
                : 'Event Name'
            }
            placeholder="e.g. Finish Algorithms Homework"
            value={title}
            onChangeText={setTitle}
            required
          />

          {/* Conditional Fields: Course Code for Uni / Exam */}
          {(selectedType === 'assignment' || selectedType === 'exam') && (
            <Input
              label="Course Code"
              placeholder="e.g. CS301"
              value={courseCode}
              onChangeText={setCourseCode}
              required
            />
          )}

          {/* Priority & Category for Task */}
          {selectedType === 'task' && (
            <>
              <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
                Priority Level
              </Text>
              <View style={styles.chipsRow}>
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                  <Chip
                    key={p}
                    label={p.toUpperCase()}
                    variant="priority"
                    priority={p}
                    selected={priority === p}
                    onPress={() => setPriority(p)}
                  />
                ))}
              </View>

              <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 12 }]}>
                Category
              </Text>
              <View style={styles.chipsRow}>
                {(['work', 'study', 'uni', 'personal', 'health', 'finance'] as TaskCategory[]).map((c) => (
                  <Chip
                    key={c}
                    label={c.toUpperCase()}
                    variant="category"
                    category={c}
                    selected={category === c}
                    onPress={() => setCategory(c)}
                  />
                ))}
              </View>
            </>
          )}

          {/* Date Picker */}
          <DateTimeField
            label="Scheduled Date"
            mode="date"
            value={date}
            onChange={setDate}
          />

          {/* Times */}
          <View style={styles.timeRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <DateTimeField
                label="Start Time"
                mode="time"
                value={startTime}
                onChange={setStartTime}
              />
            </View>

            {(selectedType === 'shift' || selectedType === 'event') && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <DateTimeField
                  label="End Time"
                  mode="time"
                  value={endTime}
                  onChange={setEndTime}
                />
              </View>
            )}
          </View>

          {/* Duration for Study */}
          {selectedType === 'study' && (
            <Input
              label="Duration (Minutes)"
              placeholder="45"
              keyboardType="numeric"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
            />
          )}

          {/* Location for Shift / Exam / Event */}
          {(selectedType === 'shift' || selectedType === 'exam' || selectedType === 'event') && (
            <Input
              label="Location / Venue"
              placeholder="e.g. Science Complex Room 204"
              value={location}
              onChangeText={setLocation}
            />
          )}

          {/* Notes */}
          <Input
            label="Notes & Details (Optional)"
            placeholder="Add any extra notes or preparation links..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          {/* Action Buttons */}
          <Button
            title={`Create ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
            onPress={handleCreate}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
            style={{ marginTop: 12 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

QuickCreateSheet.displayName = 'QuickCreateSheet';

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  typeScroll: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  formContent: {
    paddingTop: 8,
  },
  fieldLabel: {
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
