import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PRIORITY_COLORS, CATEGORY_COLORS } from '@/theme/colors';
import { Priority, TaskCategory } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export type ChipVariant = 'filter' | 'priority' | 'category' | 'status' | 'custom';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  variant?: ChipVariant;
  priority?: Priority;
  category?: TaskCategory;
  color?: string;
  backgroundColor?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onRemove,
  variant = 'filter',
  priority,
  category,
  color: customColor,
  backgroundColor: customBg,
  icon,
  size = 'md',
  style,
  textStyle,
  disabled = false,
}) => {
  const theme = useTheme();

  const isPressable = !!onPress;

  // Compute colors based on variant
  const getStyleProps = () => {
    if (variant === 'priority' && priority) {
      const cfg = PRIORITY_COLORS[priority];
      return {
        text: cfg.color,
        bg: cfg.background,
        border: 'transparent',
      };
    }

    if (variant === 'category' && category) {
      const cfg = CATEGORY_COLORS[category];
      return {
        text: cfg.color,
        bg: cfg.background,
        border: 'transparent',
      };
    }

    if (variant === 'custom' && customColor) {
      return {
        text: customColor,
        bg: customBg || `${customColor}20`,
        border: 'transparent',
      };
    }

    // Default 'filter' variant
    if (selected) {
      return {
        text: theme.accent.primary,
        bg: theme.accent.primarySoft,
        border: theme.accent.primary,
      };
    }

    return {
      text: theme.colors.textSecondary,
      bg: theme.colors.surfaceSubtle,
      border: theme.colors.border,
    };
  };

  const { text: textColor, bg: bgColor, border: borderColor } = getStyleProps();

  const isSmall = size === 'sm';

  const content = (
    <View
      style={[
        styles.container,
        {
          height: isSmall ? 28 : 36,
          paddingHorizontal: isSmall ? 8 : 12,
          borderRadius: theme.radius.full,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: variant === 'filter' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && <View style={[styles.icon, { marginRight: isSmall ? 4 : 6 }]}>{icon}</View>}

      <Text
        style={[
          isSmall ? theme.typography.badge : theme.typography.captionBold,
          { color: textColor },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {onRemove && (
        <Pressable
          hitSlop={6}
          onPress={() => {
            hapticFeedback.light();
            onRemove();
          }}
          style={styles.removeButton}
        >
          <X size={14} color={textColor} />
        </Pressable>
      )}
    </View>
  );

  if (isPressable) {
    return (
      <Pressable
        onPress={() => {
          if (disabled) return;
          hapticFeedback.selection();
          onPress();
        }}
        hitSlop={4}
        disabled={disabled}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginVertical: 4,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
