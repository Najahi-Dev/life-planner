import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Sparkles,
  Palette,
  ArrowRight,
  LogIn,
  Compass,
  LayoutDashboard,
} from 'lucide-react-native';
import { Button, Card, Skeleton } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function IndexScreen() {
  const theme = useTheme();
  const { user, profile, isAuthenticated, isLoading, demoLoginMutation } = useAuth();

  const handleEnterDashboard = () => {
    router.push('/(tabs)' as any);
  };

  const handleDemoLogin = async () => {
    try {
      await demoLoginMutation.mutateAsync();
      router.push('/(tabs)' as any);
    } catch {
      // Handled in mutation
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.content, { paddingHorizontal: theme.spacing.screenPadding }]}>
          <Skeleton variant="circle" width={64} height={64} style={{ marginBottom: 16 }} />
          <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton variant="card" width="100%" height={120} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
            ]}
          >
            <Sparkles size={16} color={theme.accent.primary} />
            <Text
              style={[
                styles.badgeText,
                theme.typography.captionBold,
                { color: theme.accent.primary },
              ]}
            >
              Phase 4: Navigation Shell & Dashboard Active
            </Text>
          </View>

          <Text style={[styles.title, theme.typography.display, { color: theme.colors.text }]}>
            Personal Life Planner
          </Text>

          <Text
            style={[
              styles.subtitle,
              theme.typography.body,
              { color: theme.colors.textSecondary },
            ]}
          >
            Manage plans, work shifts, learning progress with spaced repetition, and university goals in one place.
          </Text>
        </View>

        {/* Primary Dashboard Launch Card */}
        <Card variant="accent" style={{ marginBottom: 16 }}>
          <View style={styles.userRow}>
            <View
              style={[
                styles.userAvatar,
                { backgroundColor: theme.accent.primary, borderRadius: theme.radius.full },
              ]}
            >
              <LayoutDashboard size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                {isAuthenticated ? (profile?.displayName || user?.displayName || 'Alex Rivers') : 'Life Planner Mobile'}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {isAuthenticated ? user?.email : 'Explore Home Dashboard & 5 Core Tabs'}
              </Text>
            </View>
          </View>

          <Button
            title="Open Planner Dashboard"
            onPress={handleEnterDashboard}
            variant="primary"
            size="primary"
            leftIcon={<LayoutDashboard size={18} color="#FFFFFF" />}
            rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
            style={{ marginTop: 14 }}
          />
        </Card>

        {/* Auth / Onboarding Card */}
        {!isAuthenticated && (
          <Card variant="elevated" style={{ marginBottom: 16 }}>
            <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 8 }]}>
              🔐 Authentication & Onboarding
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary, marginBottom: 16 },
              ]}
            >
              Experience the animated 3-slide walkthrough, sign in, or explore instantly with the 1-tap demo account.
            </Text>

            <Button
              title="Start Onboarding Walkthrough"
              onPress={() => router.push('/(auth)/onboarding' as any)}
              variant="secondary"
              size="primary"
              leftIcon={<Compass size={18} color={theme.colors.text} />}
              style={{ marginBottom: 10 }}
            />

            <Button
              title="Sign In with Email"
              onPress={() => router.push('/(auth)/login' as any)}
              variant="secondary"
              size="secondary"
              leftIcon={<LogIn size={18} color={theme.colors.text} />}
              style={{ marginBottom: 10 }}
            />

            <Button
              title="Instant Demo Login (1-Tap)"
              onPress={handleDemoLogin}
              loading={demoLoginMutation.isPending}
              variant="outline"
              size="secondary"
              leftIcon={<Sparkles size={16} color={theme.accent.primary} />}
            />
          </Card>
        )}

        {/* UI Component Gallery Card */}
        <Card variant="outlined" style={{ marginBottom: 24 }}>
          <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 8 }]}>
            🎨 UI Component Gallery
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textSecondary, marginBottom: 16 },
            ]}
          >
            Preview all theme modes (Light/Dark/System), 5 accent colors, buttons, inputs, dropdowns, and progress rings.
          </Text>

          <Button
            title="Open UI Gallery Preview"
            onPress={() => router.push('/gallery' as any)}
            variant="secondary"
            size="primary"
            leftIcon={<Palette size={18} color={theme.colors.text} />}
            rightIcon={<ArrowRight size={18} color={theme.colors.text} />}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  badgeText: {
    marginLeft: 6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 320,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
