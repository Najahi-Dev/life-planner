import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientColors?: [string, string];
  trackColor?: string;
  showText?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color,
  gradientColors,
  trackColor,
  showText = true,
  children,
  style,
}) => {
  const theme = useTheme();
  const animatedProgress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 100);
    animatedProgress.value = withTiming(clamped, { duration: 600 });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset,
    };
  });

  const activeColor = color || theme.accent.primary;
  const activeTrack = trackColor || theme.colors.surfaceSubtle;
  const useGrad = !!gradientColors;
  const grad = gradientColors || theme.accent.gradient;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {useGrad && (
          <Defs>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={grad[0]} />
              <Stop offset="100%" stopColor={grad[1]} />
            </LinearGradient>
          </Defs>
        )}

        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={useGrad ? 'url(#ringGrad)' : activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.content}>
        {children ? (
          children
        ) : showText ? (
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            {Math.round(progress)}%
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
