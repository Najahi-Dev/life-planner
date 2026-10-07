import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export interface ConfettiCelebrationProps {
  visible: boolean;
  message?: string;
  onFinish?: () => void;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  visible,
  message = 'Great job!',
  onFinish,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      hapticFeedback.success();
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 250 }),
      );

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 250 });
        scale.value = withTiming(0.8, { duration: 250 });
        onFinish?.();
      }, 1400);

      return () => clearTimeout(timer);
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible, scale, opacity, onFinish]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.badge,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.card,
            padding: theme.spacing.lg,
            borderColor: theme.accent.primary,
            borderWidth: 2,
            ...theme.shadows.lg,
          },
          animatedStyle,
        ]}
      >
        <CheckCircle2 size={44} color={theme.accent.primary} />
        <Text
          style={[
            theme.typography.heading,
            { color: theme.colors.text, marginTop: theme.spacing.sm, textAlign: 'center' },
          ]}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
});
