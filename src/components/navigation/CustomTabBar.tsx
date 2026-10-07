import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
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
    const color = isFocused ? theme.accent.primary : theme.colors.textMuted;
    const size = 20;

    switch (routeName) {
      case 'index':
      case 'home':
        return <Home size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'plans':
        return <CheckSquare size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'schedule':
        return <Calendar size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'learn':
        return <BookOpen size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'uni':
        return <GraduationCap size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      default:
        return <Home size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
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

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 8);

  return (
    <>
      {/* Floating Quick Action Button */}
      <Pressable
        onPress={() => {
          console.log('[Tap] Floating FAB clicked');
          hapticFeedback.medium();
          onOpenCreate();
        }}
        hitSlop={8}
        accessibilityLabel="Create Plan or Schedule"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.floatingFab,
          {
            backgroundColor: theme.accent.primary,
            bottom: bottomInset + 66,
            ...theme.shadows.glow(theme.accent.primary),
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.92 : 1 }],
          },
        ]}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>

      {/* Main 5-Tab Bar Container */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.tabBarBackground,
            borderTopColor: theme.colors.tabBarBorder,
            paddingBottom: bottomInset,
            height: 60 + bottomInset,
            ...theme.shadows.md,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            console.log('[Tap] Tab clicked:', route.name);
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
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                {
                  opacity: pressed ? 0.75 : 1,
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || getTabLabel(route.name)}
            >
              <View
                style={[
                  styles.iconCircle,
                  isFocused && {
                    backgroundColor: theme.accent.primarySoft,
                  },
                ]}
              >
                {getTabIcon(route.name, isFocused)}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? theme.typography.captionBold : theme.typography.captionMedium,
                  {
                    color: isFocused ? theme.accent.primary : theme.colors.textMuted,
                  },
                ]}
                numberOfLines={1}
              >
                {getTabLabel(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
  },
  floatingFab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 110,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
