import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export interface SegmentOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T = string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value),
  );

  const itemWidth = containerWidth > 0 ? (containerWidth - 8) / options.length : 0;
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (itemWidth > 0) {
      translateX.value = withSpring(selectedIndex * itemWidth + 4, {
        damping: 18,
        stiffness: 220,
      });
    }
  }, [selectedIndex, itemWidth, translateX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: itemWidth,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceSubtle,
          borderRadius: theme.radius.button,
          borderColor: theme.colors.borderSubtle,
        },
        style,
      ]}
    >
      {itemWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              borderRadius: theme.radius.button - 2,
              backgroundColor: theme.colors.card,
              ...theme.shadows.sm,
            },
            animatedIndicatorStyle,
          ]}
        />
      )}

      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => {
              if (!isSelected) {
                hapticFeedback.selection();
                onChange(option.value);
              }
            }}
            style={styles.segmentButton}
          >
            {option.icon && (
              <View style={[styles.iconWrapper, { marginRight: 6 }]}>
                {option.icon}
              </View>
            )}
            <Text
              style={[
                styles.segmentText,
                isSelected ? theme.typography.captionBold : theme.typography.captionMedium,
                {
                  color: isSelected ? theme.accent.primary : theme.colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    padding: 4,
    borderWidth: 1,
    position: 'relative',
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    textAlign: 'center',
  },
});
