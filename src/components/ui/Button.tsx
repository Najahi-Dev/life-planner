import React from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'primary' | 'secondary' | 'sm' | 'icon';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = true,
  haptic = true,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    if (haptic) {
      if (variant === 'danger') {
        hapticFeedback.heavy();
      } else {
        hapticFeedback.light();
      }
    }
    scale.value = withTiming(theme.animation.scalePress, {
      duration: theme.animation.instant,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Resolve Height and Padding based on Size
  const getHeight = () => {
    switch (size) {
      case 'primary':
        return theme.sizes.buttonPrimaryHeight; // 52
      case 'secondary':
        return theme.sizes.buttonSecondaryHeight; // 44
      case 'sm':
        return 36;
      case 'icon':
        return theme.sizes.minTouchTarget; // 44
    }
  };

  const getPaddingHorizontal = () => {
    if (size === 'icon') return 0;
    switch (size) {
      case 'primary':
        return theme.spacing.xl; // 24
      case 'secondary':
        return theme.spacing.lg; // 16
      case 'sm':
        return theme.spacing.md; // 12
    }
  };

  // Resolve Colors based on Variant
  const getBackgroundColor = () => {
    if (disabled) {
      return theme.colors.surfaceSubtle;
    }
    switch (variant) {
      case 'primary':
        return theme.accent.primary;
      case 'secondary':
        return theme.colors.surfaceSubtle;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return '#EF4444';
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.borderSubtle;
    if (variant === 'outline') return theme.colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    switch (variant) {
      case 'primary':
        return theme.accent.onPrimary;
      case 'secondary':
        return theme.colors.text;
      case 'outline':
      case 'ghost':
        return theme.accent.primary;
      case 'danger':
        return '#FFFFFF';
    }
  };

  const textColor = getTextColor();

  return (
    <Animated.View
      style={[
        {
          width: size === 'icon' ? theme.sizes.minTouchTarget : fullWidth ? '100%' : 'auto',
          minWidth: size === 'icon' ? theme.sizes.minTouchTarget : undefined,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          {
            height: getHeight(),
            paddingHorizontal: getPaddingHorizontal(),
            borderRadius: theme.radius.button,
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' ? 1.5 : 0,
            width: '100%',
            opacity: disabled ? 0.6 : 1,
          },
          variant === 'primary' && !disabled ? theme.shadows.sm : undefined,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            {title ? (
              <Text
                style={[
                  styles.text,
                  size === 'sm' ? theme.typography.captionBold : theme.typography.bodyBold,
                  { color: textColor },
                  textStyle,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
