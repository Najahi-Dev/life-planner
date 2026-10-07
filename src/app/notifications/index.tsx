import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Header, Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function NotificationsScreen() {
  const theme = useTheme();

  const sampleNotifications = [
    {
      id: '1',
      title: 'Assignment Deadline Approaching',
      body: 'CS301 Dynamic Programming Assignment is due in 2 days at 23:59.',
      time: '10 mins ago',
      type: 'urgent',
      read: false,
    },
    {
      id: '2',
      title: 'Spaced Review Reminder',
      body: 'Time to review "Operating Systems Processes & Threads" (Interval 3 days).',
      time: '2 hours ago',
      type: 'study',
      read: false,
    },
    {
      id: '3',
      title: 'Upcoming Work Shift',
      body: 'Frontend Developer Intern shift starts today at 13:00 at Innovation Hub.',
      time: 'Yesterday',
      type: 'work',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header
        title="Notifications"
        subtitle="Due Reminders & Alerts"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sampleNotifications.map((n) => {
          const isUnread = !n.read;
          return (
            <Card
              key={n.id}
              variant={isUnread ? 'outlined' : 'elevated'}
              style={{
                marginBottom: 12,
                ...(isUnread ? { borderColor: theme.accent.primary, borderWidth: 1 } : {}),
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor:
                          n.type === 'urgent'
                            ? 'rgba(239, 68, 68, 0.14)'
                            : theme.accent.primarySoft,
                        borderRadius: theme.radius.sm,
                      },
                    ]}
                  >
                    <Bell
                      size={16}
                      color={n.type === 'urgent' ? '#EF4444' : theme.accent.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.title,
                      theme.typography.bodyBold,
                      { color: theme.colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {n.title}
                  </Text>
                </View>

                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  {n.time}
                </Text>
              </View>

              <Text
                style={[
                  styles.body,
                  theme.typography.body,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {n.body}
              </Text>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    flex: 1,
  },
  body: {
    lineHeight: 20,
  },
});
