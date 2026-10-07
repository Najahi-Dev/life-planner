import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  variant?: 'text' | 'circle' | 'card' | 'button' | 'custom';
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  variant = 'text',
  style,
}) => {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 900 }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getDimensions = () => {
    switch (variant) {
      case 'circle': {
        const size = typeof width === 'number' ? width : height;
        return {
          width: size,
          height: size,
          borderRadius: theme.radius.full,
        };
      }
      case 'card':
        return {
          width: width as any,
          height: height || 110,
          borderRadius: borderRadius ?? theme.radius.card,
        };
      case 'button':
        return {
          width: width as any,
          height: theme.sizes.buttonPrimaryHeight,
          borderRadius: borderRadius ?? theme.radius.button,
        };
      case 'text':
      default:
        return {
          width: width as any,
          height: height || 16,
          borderRadius: borderRadius ?? theme.radius.xs,
        };
    }
  };

  const dims = getDimensions();

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          backgroundColor: theme.colors.surfaceHover,
          ...dims,
        },
        style,
        animatedStyle,
      ]}
    />
  );
};

export interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  style?: ViewStyle;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 4,
  itemHeight = 84,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.listContainer, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.listItem,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.card,
              padding: theme.spacing.cardPadding,
              marginBottom: theme.spacing.md,
              height: itemHeight,
            },
          ]}
        >
          <View style={styles.listItemRow}>
            <Skeleton variant="circle" width={40} height={40} />
            <View style={styles.listItemTextCol}>
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton variant="text" width="45%" height={12} style={{ marginTop: 8 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  listContainer: {
    width: '100%',
  },
  listItem: {
    width: '100%',
    justifyContent: 'center',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemTextCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});
