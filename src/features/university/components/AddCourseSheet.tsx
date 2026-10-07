import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GraduationCap, Plus } from 'lucide-react-native';
import { Sheet, Button, Input, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';
import { UniCourseFormData, uniCourseSchema } from '../schemas/uniSchemas';

export interface AddCourseSheetProps {
  onSave: (data: UniCourseFormData) => Promise<void>;
}

export const AddCourseSheet = forwardRef<BottomSheet, AddCourseSheetProps>(
  ({ onSave }, ref) => {
    const theme = useTheme();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [lecturer, setLecturer] = useState('');
    const [credits, setCredits] = useState('4');
    const [semester, setSemester] = useState('Fall 2026');
    const [targetGrade, setTargetGrade] = useState('A');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+'];
    const semesters = ['Fall 2026', 'Spring 2027', 'Summer 2027', 'Fall 2027'];

    const handleSave = async () => {
      console.log('[Tap] AddCourse submit clicked');
      setErrors({});

      const parsed = uniCourseSchema.safeParse({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        lecturer: lecturer.trim(),
        credits: Number(credits) || 3,
        semester: semester.trim(),
        color: theme.accent.primary,
        targetGrade,
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
          code: code.trim().toUpperCase(),
          name: name.trim(),
          lecturer: lecturer.trim(),
          credits: Number(credits) || 3,
          semester: semester.trim(),
          color: theme.accent.primary,
          targetGrade,
        });

        hapticFeedback.success();
        (ref as any)?.current?.close();

        // Reset form
        setCode('');
        setName('');
        setLecturer('');
        setCredits('4');
        setErrors({});
      } catch (err: any) {
        console.error('[AddCourse] Error creating course:', err);
        hapticFeedback.error();
        Alert.alert('Error', err?.message || 'Failed to save course');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Sheet ref={ref} snapPoints={['80%', '95%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            New University Course
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Enroll course code, credits, target grade, and instructor
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Course Code"
            placeholder="e.g. CS301"
            value={code}
            onChangeText={(c) => {
              setCode(c);
              if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
            }}
            error={errors.code}
            required
          />

          <Input
            label="Course Name"
            placeholder="e.g. Data Structures & Algorithms"
            value={name}
            onChangeText={(n) => {
              setName(n);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            required
          />

          <Input
            label="Instructor / Lecturer (Optional)"
            placeholder="e.g. Prof. Alan Turing"
            value={lecturer}
            onChangeText={setLecturer}
            error={errors.lecturer}
          />

          {/* Credits Input */}
          <Input
            label="Credit Hours"
            placeholder="4"
            keyboardType="numeric"
            value={credits}
            onChangeText={(cr) => {
              setCredits(cr);
              if (errors.credits) setErrors((prev) => ({ ...prev, credits: '' }));
            }}
            error={errors.credits}
            required
          />

          {/* Target Grade Selector */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Target Grade
          </Text>
          <View style={styles.chipsRow}>
            {grades.map((g) => (
              <Chip
                key={g}
                label={g}
                selected={targetGrade === g}
                onPress={() => {
                  setTargetGrade(g);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Semester Selector */}
          <Text
            style={[
              styles.fieldLabel,
              theme.typography.captionBold,
              { color: theme.colors.textSecondary, marginTop: 8 },
            ]}
          >
            Academic Semester
          </Text>
          <View style={styles.chipsRow}>
            {semesters.map((s) => (
              <Chip
                key={s}
                label={s}
                selected={semester === s}
                onPress={() => {
                  setSemester(s);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          <Button
            title="Enroll Course"
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

AddCourseSheet.displayName = 'AddCourseSheet';

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
});
