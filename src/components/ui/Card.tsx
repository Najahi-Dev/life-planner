import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export type CardVariant = 'elevated' | 'outlined' | 'glass' | 'accent' | 'flat';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
  contentStyle,
  disabled = false,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const isPressable = !!onPress;

  const handlePressIn = () => {
    if (disabled || !isPressable) return;
    hapticFeedback.light();
    scale.value = withTiming(0.98, { duration: theme.animation.instant });
  };

  const handlePressOut = () => {
    if (!isPressable) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return theme.colors.card;
      case 'outlined':
        return theme.colors.surface;
      case 'glass':
        return theme.isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)';
      case 'accent':
        return theme.accent.primarySoft;
      case 'flat':
        return theme.colors.surfaceSubtle;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'outlined':
        return theme.colors.cardBorder;
      case 'accent':
        return theme.accent.primary;
      case 'glass':
        return theme.colors.borderSubtle;
      default:
        return 'transparent';
    }
  };

  const cardStyle: ViewStyle = {
    padding: theme.spacing.cardPadding, // 16
    borderRadius: theme.radius.card, // 16
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outlined' || variant === 'accent' || variant === 'glass' ? 1 : 0,
    ...(variant === 'elevated' ? (theme.isDark ? theme.shadows.md : theme.shadows.sm) : {}),
  };

  if (isPressable) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.base, cardStyle, style, animatedStyle]}
      >
        <View style={contentStyle}>{children}</View>
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles.base, cardStyle, style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    overflow: 'hidden',
  },
});
