import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  trackColor,
  showLabel = false,
  label,
  style,
}) => {
  const theme = useTheme();
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 100);
    animatedWidth.value = withTiming(clamped, { duration: 500 });
  }, [progress, animatedWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  const activeColor = color || theme.accent.primary;
  const activeTrack = trackColor || theme.colors.surfaceSubtle;

  return (
    <View style={[styles.container, style]}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
              {label}
            </Text>
          )}
          {showLabel && (
            <Text style={[theme.typography.captionBold, { color: activeColor }]}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: activeTrack,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: activeColor,
              borderRadius: theme.radius.full,
            },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
