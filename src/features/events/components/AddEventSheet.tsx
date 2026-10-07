import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Calendar } from 'lucide-react-native';
import { Sheet, Button, Input, DateTimeField, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { EventType } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { EventFormData, eventSchema } from '../schemas/eventSchemas';
import { EVENT_TYPE_COLORS } from '../types';
import { format } from 'date-fns';

export interface AddEventSheetProps {
  onSave: (data: EventFormData) => Promise<void>;
  initialDate?: string;
}

export const AddEventSheet = forwardRef<BottomSheet, AddEventSheetProps>(
  ({ onSave, initialDate }, ref) => {
    const theme = useTheme();

    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('personal');
    const [eventDate, setEventDate] = useState<Date>(
      initialDate ? new Date(initialDate) : new Date(),
    );
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 1.5)); // 1.5 hrs later
    const [location, setLocation] = useState('');
    const [reminderMinutes, setReminderMinutes] = useState<number>(30);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const eventTypes: EventType[] = [
      'academic',
      'work',
      'social',
      'health',
      'personal',
      'deadline',
    ];
    const reminderOptions = [
      { label: '5m before', val: 5 },
      { label: '15m before', val: 15 },
      { label: '30m before', val: 30 },
      { label: '1h before', val: 60 },
      { label: '1 day before', val: 1440 },
    ];

    const handleSave = async () => {
      console.log('[Tap] AddEvent submit clicked');
      setErrors({});

      const dateStr = format(eventDate, 'yyyy-MM-dd');
      const startStr = format(startTime, 'HH:mm');
      const endStr = format(endTime, 'HH:mm');

      const validation = eventSchema.safeParse({
        title: title.trim(),
        type,
        date: dateStr,
        startTime: startStr,
        endTime: endStr,
        location: location.trim(),
        reminderMinutesBefore: reminderMinutes,
        notes: notes.trim(),
        color: EVENT_TYPE_COLORS[type]?.color,
      });

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((e: any) => {
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
          type,
          date: dateStr,
          startTime: startStr,
          endTime: endStr,
          location: location.trim(),
          reminderMinutesBefore: reminderMinutes,
          notes: notes.trim(),
          color: EVENT_TYPE_COLORS[type]?.color,
        });

        hapticFeedback.success();
        (ref as any)?.current?.close();

        // Reset form
        setTitle('');
        setLocation('');
        setNotes('');
        setErrors({});
      } catch (err: any) {
        console.error('[AddEvent] Error saving event:', err);
        hapticFeedback.error();
        Alert.alert('Error', err?.message || 'Failed to save event');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Sheet ref={ref} snapPoints={['85%', '95%']}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            New Calendar Event
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            Schedule an activity with start & end times, location, and reminder
          </Text>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Input
            label="Event Name"
            placeholder="e.g. Career Fair & Networking"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            required
          />

          {/* Category Chips */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Category
          </Text>
          <View style={styles.chipsRow}>
            {eventTypes.map((t) => (
              <Chip
                key={t}
                label={t.toUpperCase()}
                selected={type === t}
                onPress={() => {
                  setType(t);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Date Picker */}
          <DateTimeField
            label="Event Date"
            mode="date"
            value={eventDate}
            onChange={setEventDate}
            error={errors.date}
          />

          {/* Times */}
          <View style={styles.timeRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <DateTimeField
                label="Start Time"
                mode="time"
                value={startTime}
                onChange={setStartTime}
                error={errors.startTime}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <DateTimeField
                label="End Time"
                mode="time"
                value={endTime}
                onChange={setEndTime}
                error={errors.endTime}
              />
            </View>
          </View>

          {/* Location */}
          <Input
            label="Location / Venue (Optional)"
            placeholder="e.g. Student Center Room 101 or Zoom link"
            value={location}
            onChangeText={(l) => {
              setLocation(l);
              if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
            }}
            error={errors.location}
          />

          {/* Reminder lead time */}
          <Text style={[styles.fieldLabel, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 8 }]}>
            Notification Reminder
          </Text>
          <View style={styles.chipsRow}>
            {reminderOptions.map((opt) => (
              <Chip
                key={opt.val}
                label={opt.label}
                selected={reminderMinutes === opt.val}
                onPress={() => {
                  setReminderMinutes(opt.val);
                  hapticFeedback.selection();
                }}
              />
            ))}
          </View>

          {/* Notes */}
          <Input
            label="Details & Notes"
            placeholder="Add any extra preparation or materials needed..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <Button
            title="Create Event"
            onPress={handleSave}
            variant="primary"
            size="primary"
            loading={isSubmitting}
            leftIcon={<Calendar size={20} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />

          <View style={{ height: 40 }} />
        </BottomSheetScrollView>
      </Sheet>
    );
  },
);

AddEventSheet.displayName = 'AddEventSheet';

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
  timeRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
