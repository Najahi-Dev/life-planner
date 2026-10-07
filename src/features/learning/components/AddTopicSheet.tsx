import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BookOpen, Plus, Tag, Target } from 'lucide-react-native';
import { Sheet, Button, Input, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';
import { LearningTopicFormData, learningTopicSchema } from '../schemas/learningSchemas';

export interface AddTopicSheetProps {
  onSave: (data: LearningTopicFormData) => Promise<void>;
}

export const AddTopicSheet = forwardRef<BottomSheet, AddTopicSheetProps>(
  ({ onSave }, ref) => {
    const theme = useTheme();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Computer Science');
    const [targetHours, setTargetHours] = useState('20');
    const [resourceTitle, setResourceTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = [
      'Computer Science',
      'Mobile Dev',
      'Backend Architecture',
      'Algorithms',
      'AI & Data',
      'Languages',
      'Design',
    ];

    const handleSave = async () => {
      console.log('[Tap] AddTopic submit clicked');
      setErrors({});

      const resources = resourceTitle.trim()
        ? [
            {
              id: `res-${Date.now()}`,
              title: resourceTitle.trim(),
              type: 'article' as const,
            },
          ]
        : [];

      const parsed = learningTopicSchema.safeParse({
        title: title.trim(),
        category: category.trim(),
        targetHours: Number(targetHours) || 15,
        completedHours: 0,
        resources,
      });

      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((e: any) => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        hapticFeedback.warning();
        return;
      }

      setIsSubmitting(true);
      try {
        await onSave({
          title: title.trim(),
          category: category.trim(),
          targetHours: Number(targetHours) || 15,
          completedHours: 0,
          resources,
        });

        hapticFeedback.success();
        (ref as any)?.current?.close();

        // Reset form
        setTitle('');
        setResourceTitle('');
        setTargetHours('20');
        setErrors({});
      } catch (err: any) {
        console.error('[AddTopic] Error creating topic:', err);
        hapticFeedback.error();
        Alert.alert('Error', err?.message || 'Failed to save topic');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Sheet ref={ref} snapPoints={['75%', '90%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            New Learning Topic
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Create a topic with automated 1-3-7-14-30 spaced repetition
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Topic Title */}
          <Input
            label="Topic Title"
            placeholder="e.g. Kotlin Coroutines & Flow"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            required
          />

          {/* Category Chips */}
          <Text
            style={[
              styles.fieldLabel,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary, marginTop: 8 },
            ]}
          >
            Category
          </Text>
          <View style={styles.chipsRow}>
            {categories.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                onPress={() => {
                  setCategory(c);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Target Hours */}
          <Input
            label="Target Mastery Hours"
            placeholder="20"
            keyboardType="numeric"
            value={targetHours}
            onChangeText={(th) => {
              setTargetHours(th);
              if (errors.targetHours) setErrors((prev) => ({ ...prev, targetHours: '' }));
            }}
            error={errors.targetHours}
            required
          />

          {/* Primary Reference / Resource */}
          <Input
            label="Primary Reference / Doc (Optional)"
            placeholder="e.g. Official Documentation or Textbook chapter"
            value={resourceTitle}
            onChangeText={setResourceTitle}
          />

          {/* Submit Button */}
          <Button
            title="Create Learning Topic"
            onPress={handleSave}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

AddTopicSheet.displayName = 'AddTopicSheet';

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
    marginBottom: 16,
  },
});
