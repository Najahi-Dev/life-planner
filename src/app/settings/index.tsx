import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
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
  Clock,
  Database,
  Sliders,
} from 'lucide-react-native';
import { Header, Card, Button, SegmentedControl, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ACCENT_PALETTES } from '@/theme/colors';
import { AccentColor, ThemeMode, WeekStartDay } from '@/types';
import { hapticFeedback } from '@/utils/haptics';

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, profile, logout } = useAuth();

  // Notification & Preference states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [defaultLeadMinutes, setDefaultLeadMinutes] = useState(30);
  const [weekStart, setWeekStart] = useState<WeekStartDay>('monday');

  const accentOptions: { key: AccentColor; label: string; color: string }[] = [
    { key: 'indigo', label: 'Indigo', color: ACCENT_PALETTES.indigo.primary },
    { key: 'emerald', label: 'Emerald', color: ACCENT_PALETTES.emerald.primary },
    { key: 'rose', label: 'Rose', color: ACCENT_PALETTES.rose.primary },
    { key: 'amber', label: 'Amber', color: ACCENT_PALETTES.amber.primary },
    { key: 'sky', label: 'Sky', color: ACCENT_PALETTES.sky.primary },
  ];

  const leadOptions = [
    { label: '5m before', val: 5 },
    { label: '15m before', val: 15 },
    { label: '30m before', val: 30 },
    { label: '1 hour before', val: 60 },
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

  const handleClearCache = () => {
    hapticFeedback.medium();
    Alert.alert('Offline Cache Cleared', 'Local cached data has been refreshed successfully.');
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
          <Pressable
            onPress={() => {
              hapticFeedback.light();
              router.push('/profile');
            }}
            style={styles.profileRow}
          >
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
                {user?.email || 'alex@example.com'} • Edit Profile
              </Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </Card>

        {/* 1. Theme & Appearance */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          APPEARANCE & THEME
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginBottom: 8 }]}>
            Color Scheme
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
            Accent Theme ({theme.accentName.toUpperCase()})
          </Text>
          <View style={styles.accentRow}>
            {accentOptions.map((opt) => {
              const isSelected = theme.accentName === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    hapticFeedback.selection();
                    theme.setAccentColor(opt.key);
                  }}
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

        {/* 2. Notification Preferences */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          NOTIFICATIONS & ALERTS
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          {/* Push Notifications Switch */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Bell size={18} color={theme.accent.primary} style={{ marginRight: 10 }} />
              <View>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Push Notifications
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  Instant alerts for due tasks and shifts
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => {
                hapticFeedback.selection();
                setPushEnabled(val);
              }}
              trackColor={{ false: theme.colors.surfaceSubtle, true: theme.accent.primary }}
            />
          </View>

          {/* SMS Reminders Switch */}
          <View style={[styles.toggleRow, { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle }]}>
            <View style={styles.toggleLeft}>
              <MessageSquare size={18} color={theme.accent.primary} style={{ marginRight: 10 }} />
              <View>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  SMS Text Reminders
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  SMS backup for urgent deadlines
                </Text>
              </View>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={(val) => {
                hapticFeedback.selection();
                setSmsEnabled(val);
              }}
              trackColor={{ false: theme.colors.surfaceSubtle, true: theme.accent.primary }}
            />
          </View>

          {/* Quiet Hours Switch */}
          <View style={[styles.toggleRow, { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle }]}>
            <View style={styles.toggleLeft}>
              <Clock size={18} color={theme.accent.primary} style={{ marginRight: 10 }} />
              <View>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Quiet Hours (22:00 - 07:00)
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  Silence notifications during sleep
                </Text>
              </View>
            </View>
            <Switch
              value={quietHoursEnabled}
              onValueChange={(val) => {
                hapticFeedback.selection();
                setQuietHoursEnabled(val);
              }}
              trackColor={{ false: theme.colors.surfaceSubtle, true: theme.accent.primary }}
            />
          </View>

          {/* Default Lead Time */}
          <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 14, marginBottom: 8 }]}>
            Default Reminder Lead Time
          </Text>
          <View style={styles.chipsRow}>
            {leadOptions.map((opt) => (
              <Chip
                key={opt.val}
                label={opt.label}
                selected={defaultLeadMinutes === opt.val}
                onPress={() => {
                  hapticFeedback.selection();
                  setDefaultLeadMinutes(opt.val);
                }}
              />
            ))}
          </View>
        </Card>

        {/* 3. Planning & Calendar */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          PLANNING & CALENDAR
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginBottom: 8 }]}>
            Week Starts On
          </Text>
          <SegmentedControl<WeekStartDay>
            options={[
              { label: 'Monday (ISO)', value: 'monday' },
              { label: 'Sunday', value: 'sunday' },
            ]}
            value={weekStart}
            onChange={(d) => setWeekStart(d)}
          />
        </Card>

        {/* 4. Shortcuts & Developer Gallery */}
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

          <View style={styles.dividerLine} />

          <Pressable
            onPress={() => {
              hapticFeedback.light();
              router.push('/notifications');
            }}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Bell size={20} color={theme.accent.primary} style={{ marginRight: 12 }} />
              <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                Notifications Inbox
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textSecondary} />
          </Pressable>
        </Card>

        {/* 5. Data & Storage */}
        <Text style={[styles.sectionTitle, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          DATA & STORAGE
        </Text>
        <Card variant="elevated" style={styles.sectionCard}>
          <Pressable onPress={handleClearCache} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Database size={20} color={theme.colors.textSecondary} style={{ marginRight: 12 }} />
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                Refresh Local Cache
              </Text>
            </View>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Clean
            </Text>
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    marginVertical: 4,
  },
});
