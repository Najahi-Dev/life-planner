import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { hapticFeedback } from '@/utils/haptics';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  largeTitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  style,
  largeTitle = false,
}) => {
  const theme = useTheme();

  const handleBack = () => {
    hapticFeedback.light();
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.screenPadding, // 20
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          {showBack && (
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              style={[
                styles.backButton,
                {
                  backgroundColor: theme.colors.surfaceSubtle,
                  borderRadius: theme.radius.button,
                  marginRight: theme.spacing.md,
                },
              ]}
            >
              <ChevronLeft size={22} color={theme.colors.text} />
            </Pressable>
          )}

          {!largeTitle && (
            <View style={styles.titleContainer}>
              <Text
                style={[
                  theme.typography.title,
                  { color: theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textSecondary, marginTop: 2 },
                  ]}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          )}
        </View>

        {rightAction && <View style={styles.rightCol}>{rightAction}</View>}
      </View>

      {largeTitle && (
        <View style={{ marginTop: theme.spacing.sm }}>
          <Text
            style={[
              theme.typography.display,
              { color: theme.colors.text },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary, marginTop: 4 },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});
