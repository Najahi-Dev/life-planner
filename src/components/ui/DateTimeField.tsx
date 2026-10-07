import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ViewStyle,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar as CalendarIcon, Clock } from 'lucide-react-native';
import { format, parseISO, isValid } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export type DateTimeMode = 'date' | 'time' | 'datetime';

export interface DateTimeFieldProps {
  label?: string;
  value?: Date | string | null;
  onChange: (date: Date) => void;
  mode?: DateTimeMode;
  placeholder?: string;
  error?: string;
  helperText?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder,
  error,
  helperText,
  minimumDate,
  maximumDate,
  disabled = false,
  required = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);

  const hasError = !!error;

  const parsedDate = (() => {
    if (!value) return null;
    if (value instanceof Date) return isValid(value) ? value : null;
    try {
      const parsed = parseISO(value);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  })();

  const formatDisplayValue = () => {
    if (!parsedDate) return null;
    if (mode === 'date') {
      return format(parsedDate, 'EEE, MMM d, yyyy');
    }
    if (mode === 'time') {
      return format(parsedDate, 'h:mm a');
    }
    return format(parsedDate, 'MMM d, yyyy · h:mm a');
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (mode === 'date') return 'Select date...';
    if (mode === 'time') return 'Select time...';
    return 'Select date and time...';
  };

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    hapticFeedback.light();
    onChange(date);
  };

  const handleCancel = () => {
    setPickerVisible(false);
  };

  const displayString = formatDisplayValue();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              theme.typography.captionBold,
              { color: hasError ? '#EF4444' : theme.colors.textSecondary },
            ]}
          >
            {label}
            {required && <Text style={{ color: '#EF4444' }}> *</Text>}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => {
          if (disabled) return;
          hapticFeedback.light();
          setPickerVisible(true);
        }}
        style={[
          styles.trigger,
          {
            height: theme.sizes.inputHeight, // 52
            borderRadius: theme.radius.input, // 12
            backgroundColor: theme.colors.inputBackground,
            borderColor: hasError ? '#EF4444' : theme.colors.inputBorder,
            paddingHorizontal: theme.spacing.lg,
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        <View style={styles.iconWrapper}>
          {mode === 'time' ? (
            <Clock size={18} color={theme.colors.textSecondary} />
          ) : (
            <CalendarIcon size={18} color={theme.colors.textSecondary} />
          )}
        </View>

        <Text
          style={[
            theme.typography.body,
            {
              color: displayString ? theme.colors.text : theme.colors.textMuted,
              flex: 1,
            },
          ]}
          numberOfLines={1}
        >
          {displayString || getPlaceholder()}
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode={mode}
        date={parsedDate || new Date()}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        isDarkModeEnabled={theme.isDark}
      />

      {hasError ? (
        <Text style={[styles.feedbackText, theme.typography.caption, { color: '#EF4444' }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.feedbackText,
            theme.typography.caption,
            { color: theme.colors.textMuted },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelRow: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWrapper: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    marginTop: 4,
    marginLeft: 2,
  },
});
