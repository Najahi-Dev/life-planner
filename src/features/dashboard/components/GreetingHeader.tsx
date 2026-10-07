import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Bell, Settings, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hapticFeedback } from '@/utils/haptics';

export const GreetingHeader: React.FC = () => {
  const theme = useTheme();
  const { user, profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = profile?.displayName || user?.displayName || 'Alex';
  const formattedDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <View style={[styles.container, { paddingHorizontal: theme.spacing.screenPadding }]}>
      <View style={styles.leftCol}>
        <Text style={[styles.dateText, theme.typography.captionBold, { color: theme.accent.primary }]}>
          {formattedDate.toUpperCase()}
        </Text>
        <Text style={[styles.greetingText, theme.typography.display, { color: theme.colors.text }]}>
          {getGreeting()},{'\n'}
          <Text style={{ color: theme.accent.primary }}>{displayName}</Text>
        </Text>
      </View>

      <View style={styles.rightActions}>
        <Pressable
          onPress={() => {
            hapticFeedback.light();
            router.push('/events' as any);
          }}
          hitSlop={8}
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surfaceSubtle, borderRadius: theme.radius.button },
          ]}
        >
          <Calendar size={20} color={theme.colors.text} />
        </Pressable>

        <Pressable
          onPress={() => {
            hapticFeedback.light();
            router.push('/notifications' as any);
          }}
          hitSlop={8}
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderRadius: theme.radius.button,
              marginLeft: 8,
            },
          ]}
        >
          <Bell size={20} color={theme.colors.text} />
          <View
            style={[
              styles.unreadDot,
              { backgroundColor: theme.accent.primary, borderColor: theme.colors.surfaceSubtle },
            ]}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            hapticFeedback.light();
            router.push('/settings' as any);
          }}
          hitSlop={8}
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderRadius: theme.radius.button,
              marginLeft: 8,
            },
          ]}
        >
          <Settings size={20} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 16,
  },
  leftCol: {
    flex: 1,
  },
  dateText: {
    marginBottom: 4,
  },
  greetingText: {
    lineHeight: 34,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
});
