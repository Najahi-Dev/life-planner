import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Bell, Settings, Calendar, Sparkles } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { hapticFeedback } from '@/utils/haptics';

export const GreetingHeader: React.FC = () => {
  const theme = useTheme();
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = profile?.displayName || user?.displayName || 'Najahi';
  const formattedDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <View style={styles.container}>
      {/* Top Utility Bar: Date Chip + Action Buttons */}
      <View style={styles.topBar}>
        <View
          style={[
            styles.dateBadge,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Sparkles size={12} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <Text
            style={[
              styles.dateText,
              theme.typography.captionBold,
              { color: theme.accent.primary },
            ]}
          >
            {formattedDate.toUpperCase()}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => {
              console.log('[Tap] GreetingHeader Events calendar clicked');
              hapticFeedback.light();
              router.push('/events' as any);
            }}
            hitSlop={8}
            accessibilityLabel="Events Calendar"
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.button,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Calendar size={18} color={theme.colors.text} />
          </Pressable>

          <Pressable
            onPress={() => {
              console.log('[Tap] GreetingHeader Notifications clicked');
              hapticFeedback.light();
              router.push('/notifications' as any);
            }}
            hitSlop={8}
            accessibilityLabel="Notifications"
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.button,
                marginLeft: 8,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Bell size={18} color={theme.colors.text} />
            {unreadCount > 0 && (
              <View
                pointerEvents="none"
                style={[
                  styles.unreadBadge,
                  {
                    backgroundColor: theme.accent.primary,
                    borderColor: theme.colors.surfaceSubtle,
                  },
                ]}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              console.log('[Tap] GreetingHeader Settings clicked');
              hapticFeedback.light();
              router.push('/settings' as any);
            }}
            hitSlop={8}
            accessibilityLabel="Settings"
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.button,
                marginLeft: 8,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Settings size={18} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Hero Greeting Section */}
      <View style={styles.heroSection}>
        <Text
          style={[
            styles.greetingHeading,
            theme.typography.display,
            { color: theme.colors.text },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {getGreeting()},{' '}
          <Text style={{ color: theme.accent.primary }}>{displayName}</Text>
        </Text>
        <Text
          style={[
            styles.greetingSubtitle,
            theme.typography.caption,
            { color: theme.colors.textSecondary },
          ]}
        >
          {"Here's your focus schedule and priority tasks for today"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  heroSection: {
    marginTop: 2,
  },
  greetingHeading: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    marginTop: 4,
    lineHeight: 18,
  },
});
