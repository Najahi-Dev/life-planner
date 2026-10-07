import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
  subtitle?: string;
}

export interface SelectProps<T = string> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  data: SelectOption<T>[];
  value?: T;
  onChange: (item: SelectOption<T>) => void;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export interface MultiSelectProps<T = string> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  data: SelectOption<T>[];
  value?: T[];
  onChange: (items: T[]) => void;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export function Select<T = string>({
  label,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  data,
  value,
  onChange,
  error,
  helperText,
  searchable = false,
  disabled = false,
  required = false,
  containerStyle,
}: SelectProps<T>) {
  const theme = useTheme();
  const hasError = !!error;

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

      <Dropdown
        style={[
          styles.dropdown,
          {
            height: theme.sizes.inputHeight,
            borderRadius: theme.radius.input,
            backgroundColor: theme.colors.inputBackground,
            borderColor: hasError ? '#EF4444' : theme.colors.inputBorder,
            paddingHorizontal: theme.spacing.lg,
          },
          disabled && { opacity: 0.5 },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          theme.typography.body,
          { color: theme.colors.textMuted },
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          theme.typography.body,
          { color: theme.colors.text },
        ]}
        inputSearchStyle={[
          styles.inputSearchStyle,
          theme.typography.body,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surfaceSubtle,
            borderRadius: theme.radius.sm,
            borderColor: theme.colors.border,
          },
        ]}
        containerStyle={[
          styles.menuContainer,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.card,
            borderColor: theme.colors.border,
            ...theme.shadows.lg,
          },
        ]}
        itemContainerStyle={{
          backgroundColor: theme.colors.surface,
        }}
        itemTextStyle={[theme.typography.body, { color: theme.colors.text }]}
        activeColor={theme.accent.primarySoft}
        data={data as any}
        search={searchable}
        maxHeight={280}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value as any}
        disable={disabled}
        onChange={(item: any) => {
          hapticFeedback.selection();
          onChange(item);
        }}
        renderRightIcon={() => (
          <ChevronDown size={18} color={theme.colors.textSecondary} />
        )}
        renderItem={(item: any, selected?: boolean) => (
          <View
            style={[
              styles.item,
              {
                borderBottomColor: theme.colors.borderSubtle,
                backgroundColor: selected ? theme.accent.primarySoft : 'transparent',
              },
            ]}
          >
            {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.body,
                  { color: selected ? theme.accent.primary : theme.colors.text },
                ]}
              >
                {item.label}
              </Text>
              {item.subtitle && (
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 2 },
                  ]}
                >
                  {item.subtitle}
                </Text>
              )}
            </View>
            {selected && <Check size={18} color={theme.accent.primary} />}
          </View>
        )}
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
}

export function AppMultiSelect<T = string>({
  label,
  placeholder = 'Select multiple...',
  searchPlaceholder = 'Search...',
  data,
  value = [],
  onChange,
  error,
  helperText,
  searchable = false,
  disabled = false,
  required = false,
  containerStyle,
}: MultiSelectProps<T>) {
  const theme = useTheme();
  const hasError = !!error;

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

      <MultiSelect
        style={[
          styles.dropdown,
          {
            minHeight: theme.sizes.inputHeight,
            borderRadius: theme.radius.input,
            backgroundColor: theme.colors.inputBackground,
            borderColor: hasError ? '#EF4444' : theme.colors.inputBorder,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: 6,
          },
          disabled && { opacity: 0.5 },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          theme.typography.body,
          { color: theme.colors.textMuted },
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          theme.typography.body,
          { color: theme.colors.text },
        ]}
        inputSearchStyle={[
          styles.inputSearchStyle,
          theme.typography.body,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surfaceSubtle,
            borderRadius: theme.radius.sm,
            borderColor: theme.colors.border,
          },
        ]}
        containerStyle={[
          styles.menuContainer,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.card,
            borderColor: theme.colors.border,
            ...theme.shadows.lg,
          },
        ]}
        activeColor={theme.accent.primarySoft}
        data={data as any}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search={searchable}
        searchPlaceholder={searchPlaceholder}
        value={value as any}
        disable={disabled}
        onChange={(items: any) => {
          hapticFeedback.selection();
          onChange(items);
        }}
        renderSelectedItem={(item: any, unSelect?: (item: any) => void) => (
          <View
            style={[
              styles.selectedChip,
              {
                backgroundColor: theme.accent.primarySoft,
                borderColor: theme.accent.primary,
                borderRadius: theme.radius.sm,
              },
            ]}
          >
            <Text
              style={[
                theme.typography.captionBold,
                { color: theme.accent.primary, marginRight: 4 },
              ]}
            >
              {item.label}
            </Text>
            {unSelect && (
              <X
                size={14}
                color={theme.accent.primary}
                onPress={() => {
                  hapticFeedback.light();
                  unSelect(item);
                }}
              />
            )}
          </View>
        )}
        renderRightIcon={() => (
          <ChevronDown size={18} color={theme.colors.textSecondary} />
        )}
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
}

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
  dropdown: {
    borderWidth: 1,
    justifyContent: 'center',
  },
  placeholderStyle: {},
  selectedTextStyle: {},
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    marginHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
  },
  menuContainer: {
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemIcon: {
    marginRight: 10,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginVertical: 4,
    borderWidth: 1,
  },
  feedbackText: {
    marginTop: 4,
    marginLeft: 2,
  },
});
