import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GraduationCap, Plus, Trash2 } from 'lucide-react-native';
import { Sheet, Button, Input, Select, DateTimeField, Chip, SelectOption } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { UniCourse } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { UniExamFormData } from '../schemas/uniSchemas';
import { format } from 'date-fns';

export interface AddExamSheetProps {
  courses: UniCourse[];
  onSave: (data: UniExamFormData) => Promise<void>;
}

export const AddExamSheet = forwardRef<BottomSheet, AddExamSheetProps>(
  ({ courses, onSave }, ref) => {
    const theme = useTheme();

    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c1');
    const [title, setTitle] = useState('');
    const [examDate, setExamDate] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)); // in 7 days
    const [timeText, setTimeText] = useState('10:00 - 12:00');
    const [venue, setVenue] = useState('');
    const [weightPercent, setWeightPercent] = useState('30');
    const [topicInput, setTopicInput] = useState('');
    const [topicsList, setTopicsList] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const weights = [20, 25, 30, 35, 40, 50];

    const handleAddTopic = () => {
      if (!topicInput.trim()) return;
      hapticFeedback.light();
      setTopicsList((prev) => [...prev, topicInput.trim()]);
      setTopicInput('');
    };

    const handleRemoveTopic = (idx: number) => {
      hapticFeedback.light();
      setTopicsList((prev) => prev.filter((_, i) => i !== idx));
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
          date: format(examDate, 'yyyy-MM-dd'),
          time: timeText.trim() || '09:00 - 11:00',
          venue: venue.trim() || 'Main Campus',
          weightPercent: Number(weightPercent) || 30,
          topicsToCover: topicsList,
          notes: notes.trim(),
        });

        hapticFeedback.success();
        (ref as any)?.current?.close();

        // Reset form
        setTitle('');
        setVenue('');
        setTopicsList([]);
        setNotes('');
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
            Schedule New Exam
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Register exam date, venue, time window, weight %, and revision topics
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

          {/* Exam Title */}
          <Input
            label="Exam Title"
            placeholder="e.g. Midterm: Algorithms & Complexity"
            value={title}
            onChangeText={setTitle}
            required
          />

          {/* Date & Time */}
          <DateTimeField label="Exam Date" mode="date" value={examDate} onChange={setExamDate} />

          <Input
            label="Exam Time Window"
            placeholder="e.g. 10:00 - 12:00"
            value={timeText}
            onChangeText={setTimeText}
            required
          />

          {/* Venue */}
          <Input
            label="Exam Venue / Room"
            placeholder="e.g. Turing Science Hall Room 302"
            value={venue}
            onChangeText={setVenue}
          />

          {/* Weight */}
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

          {/* Topics to Cover */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 8 }]}>
            Topics to Cover
          </Text>

          {topicsList.map((topic, idx) => (
            <View key={idx} style={styles.topicRow}>
              <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
                • {topic}
              </Text>
              <Pressable onPress={() => handleRemoveTopic(idx)} hitSlop={6}>
                <Trash2 size={16} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          ))}

          <View style={styles.addTopicRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                placeholder="Add core topic (e.g. Dynamic Programming)..."
                value={topicInput}
                onChangeText={setTopicInput}
              />
            </View>
            <Button
              title="Add"
              onPress={handleAddTopic}
              variant="secondary"
              size="secondary"
              fullWidth={false}
              leftIcon={<Plus size={16} color={theme.colors.text} />}
            />
          </View>

          {/* Notes */}
          <Input
            label="Notes & Allowed Materials (Optional)"
            placeholder="e.g. 1 page cheat sheet permitted..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <Button
            title="Schedule Exam"
            onPress={handleSave}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<GraduationCap size={20} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

AddExamSheet.displayName = 'AddExamSheet';

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
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
    gap: 8,
    marginBottom: 12,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  addTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
