import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  CheckSquare,
  Calendar,
  BookOpen,
  GraduationCap,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export interface CustomTabBarProps extends BottomTabBarProps {
  onOpenCreate: () => void;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  onOpenCreate,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? theme.accent.primary : theme.colors.textSecondary;
    const size = 22;

    switch (routeName) {
      case 'index':
      case 'home':
        return <Home size={size} color={color} />;
      case 'plans':
        return <CheckSquare size={size} color={color} />;
      case 'schedule':
        return <Calendar size={size} color={color} />;
      case 'learn':
        return <BookOpen size={size} color={color} />;
      case 'uni':
        return <GraduationCap size={size} color={color} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
      case 'home':
        return 'Home';
      case 'plans':
        return 'Plans';
      case 'schedule':
        return 'Schedule';
      case 'learn':
        return 'Learn';
      case 'uni':
        return 'Uni';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 8),
          height: theme.sizes.tabBarHeight + Math.max(insets.bottom, 8),
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        // Insert Floating Add button in the middle
        const isMiddle = index === 2;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            hapticFeedback.selection();
            navigation.navigate(route.name);
          }
        };

        return (
          <React.Fragment key={route.key}>
            {isMiddle && (
              <View style={styles.floatingButtonWrapper}>
                <Pressable
                  onPress={() => {
                    hapticFeedback.medium();
                    onOpenCreate();
                  }}
                  hitSlop={6}
                  style={[
                    styles.floatingButton,
                    {
                      backgroundColor: theme.accent.primary,
                      ...theme.shadows.glow(theme.accent.primary),
                    },
                  ]}
                >
                  <Plus size={26} color="#FFFFFF" />
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={styles.iconContainer}>
                {getTabIcon(route.name, isFocused)}
                {isFocused && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: theme.accent.primary },
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? theme.typography.captionBold : theme.typography.caption,
                  { color: isFocused ? theme.accent.primary : theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {getTabLabel(route.name)}
              </Text>
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
  },
  floatingButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginTop: -22,
  },
  floatingButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
