import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Sun,
  Moon,
  Smartphone,
  Check,
  Bell,
  MessageSquare,
  Palette,
  Calendar,
  LogOut,
  ChevronRight,
  Shield,
  User,
} from 'lucide-react-native';
import { Header, Card, Button, SegmentedControl } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ACCENT_PALETTES } from '@/theme/colors';
import { AccentColor, ThemeMode, WeekStartDay } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, profile, logout } = useAuth();

  const accentOptions: { key: AccentColor; label: string; color: string }[] = [
    { key: 'indigo', label: 'Indigo', color: ACCENT_PALETTES.indigo.primary },
    { key: 'emerald', label: 'Emerald', color: ACCENT_PALETTES.emerald.primary },
    { key: 'rose', label: 'Rose', color: ACCENT_PALETTES.rose.primary },
    { key: 'amber', label: 'Amber', color: ACCENT_PALETTES.amber.primary },
    { key: 'sky', label: 'Sky', color: ACCENT_PALETTES.sky.primary },
  ];

  const handleLogout = async () => {
    hapticFeedback.heavy();
    try {
      await logout();
      router.replace('/');
    } catch {
      // Logout error
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header
        title="Settings & Preferences"
        subtitle="Customization & Account"
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
        {/* User Profile Card */}
        <Card variant="elevated" style={styles.sectionCard}>
          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatarBadge,
                { backgroundColor: theme.accent.primary, borderRadius: theme.radius.full },
              ]}
            >
              <User size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                {profile?.displayName || user?.displayName || 'Alex Rivers'}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {user?.email || 'demo@lifeplanner.app'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Theme Engine */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          APPEARANCE & THEME
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginBottom: 8 }]}>
            Theme Mode
          </Text>
          <SegmentedControl<ThemeMode>
            options={[
              { label: 'System', value: 'system', icon: <Smartphone size={14} color={theme.colors.text} /> },
              { label: 'Light', value: 'light', icon: <Sun size={14} color={theme.colors.text} /> },
              { label: 'Dark', value: 'dark', icon: <Moon size={14} color={theme.colors.text} /> },
            ]}
            value={theme.themeMode}
            onChange={(mode) => theme.setThemeMode(mode)}
            style={{ marginBottom: 16 }}
          />

          <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginBottom: 8 }]}>
            Accent Color ({theme.accentName.toUpperCase()})
          </Text>
          <View style={styles.accentRow}>
            {accentOptions.map((opt) => {
              const isSelected = theme.accentName === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => theme.setAccentColor(opt.key)}
                  style={[
                    styles.accentSwatch,
                    { backgroundColor: opt.color },
                    isSelected && {
                      borderColor: theme.colors.text,
                      borderWidth: 3,
                      transform: [{ scale: 1.1 }],
                    },
                  ]}
                >
                  {isSelected && <Check size={18} color="#FFFFFF" />}
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Shortcuts & UI Gallery */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          DEVELOPER & PREVIEW
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          <Pressable
            onPress={() => {
              hapticFeedback.light();
              router.push('/gallery');
            }}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Palette size={20} color={theme.accent.primary} style={{ marginRight: 12 }} />
              <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                UI Component Gallery
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textSecondary} />
          </Pressable>
        </Card>

        {/* Logout Button */}
        <Button
          title="Sign Out of Account"
          onPress={handleLogout}
          variant="danger"
          size="primary"
          leftIcon={<LogOut size={18} color="#FFFFFF" />}
          style={{ marginTop: 12 }}
        />

        <View style={{ height: 40 }} />
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
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  accentSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
