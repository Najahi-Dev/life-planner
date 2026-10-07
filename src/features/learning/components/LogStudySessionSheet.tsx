import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BookOpen, Star } from 'lucide-react-native';
import { Sheet, Button, Input, Select, DateTimeField, Chip, SelectOption } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { LearningTopic } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { format } from 'date-fns';

export interface LogStudySessionSheetProps {
  topics: LearningTopic[];
  onSave: (data: {
    topicId: string;
    topicTitle: string;
    durationMinutes: number;
    notes?: string;
    date: string;
    rating?: 1 | 2 | 3 | 4 | 5;
  }) => Promise<void>;
}

export const LogStudySessionSheet = forwardRef<BottomSheet, LogStudySessionSheetProps>(
  ({ topics, onSave }, ref) => {
    const theme = useTheme();

    const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
    const [durationMinutes, setDurationMinutes] = useState<number>(45);
    const [notes, setNotes] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(4);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const presetDurations = [15, 30, 45, 60, 90, 120];

    const handleSave = async () => {
      const topic = topics.find((t) => t.id === selectedTopicId) || topics[0];
      if (!topic) {
        hapticFeedback.warning();
        return;
      }

      setIsSubmitting(true);
      try {
        await onSave({
          topicId: topic.id,
          topicTitle: topic.title,
          durationMinutes: Number(durationMinutes) || 30,
          notes: notes.trim(),
          date: format(date, 'yyyy-MM-dd'),
          rating,
        });
        hapticFeedback.success();
        // Close sheet
        (ref as any)?.current?.close();
        // Reset form
        setNotes('');
        setDurationMinutes(45);
      } catch {
        hapticFeedback.error();
      } finally {
        setIsSubmitting(false);
      }
    };

    const topicOptions: SelectOption<string>[] = topics.map((t) => ({
      label: t.title,
      value: t.id,
      subtitle: t.category,
    }));

    return (
      <Sheet ref={ref} snapPoints={['75%', '90%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            Log Study Session
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Record your study duration and update spaced repetition
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Topic Selector */}
          <Select<string>
            label="Learning Topic"
            data={topicOptions}
            value={selectedTopicId || topics[0]?.id}
            onChange={(item) => {
              setSelectedTopicId(item.value);
              hapticFeedback.selection();
            }}
            placeholder="Select topic..."
          />

          {/* Preset Duration Chips */}
          <Text
            style={[
              styles.fieldLabel,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary, marginTop: 12 },
            ]}
          >
            Duration
          </Text>
          <View style={styles.chipsRow}>
            {presetDurations.map((mins) => (
              <Chip
                key={mins}
                label={`${mins}m`}
                selected={durationMinutes === mins}
                onPress={() => {
                  setDurationMinutes(mins);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Date Picker */}
          <DateTimeField label="Study Date" mode="date" value={date} onChange={setDate} />

          {/* Comprehension Rating */}
          <Text
            style={[
              styles.fieldLabel,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary, marginTop: 8 },
            ]}
          >
            Comprehension & Focus Rating
          </Text>
          <View style={styles.ratingRow}>
            {([1, 2, 3, 4, 5] as const).map((starVal) => {
              const isFilled = starVal <= rating;
              return (
                <Pressable
                  key={starVal}
                  onPress={() => {
                    setRating(starVal);
                    hapticFeedback.selection();
                  }}
                  hitSlop={6}
                  style={styles.starButton}
                >
                  <Star
                    size={28}
                    color={isFilled ? '#F59E0B' : theme.colors.borderSubtle}
                    fill={isFilled ? '#F59E0B' : 'transparent'}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Notes */}
          <Input
            label="Session Notes & Key Concepts"
            placeholder="Summarize key formulas, algorithms, or insights learned..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          {/* Submit Button */}
          <Button
            title="Save Study Session"
            onPress={handleSave}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<BookOpen size={20} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

LogStudySessionSheet.displayName = 'LogStudySessionSheet';

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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingVertical: 4,
  },
  starButton: {
    padding: 4,
  },
});
