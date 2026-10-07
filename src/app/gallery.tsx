import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  Sparkles,
  Search,
  Mail,
  Calendar,
  Layers,
  Check,
  Moon,
  Sun,
  Smartphone,
  Tag,
  Clock,
  Heart,
  BookOpen,
  Briefcase,
  GraduationCap,
} from 'lucide-react-native';
import {
  Button,
  Input,
  Select,
  AppMultiSelect,
  DateTimeField,
  Card,
  Chip,
  Sheet,
  EmptyState,
  Skeleton,
  SkeletonList,
  Header,
  ProgressRing,
  ProgressBar,
  SegmentedControl,
  ConfettiCelebration,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { ACCENT_PALETTES } from '@/theme/colors';
import { AccentColor, ThemeMode, Priority, TaskCategory } from '@/types';

export default function UIGalleryScreen() {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Gallery state
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [selectedSingle, setSelectedSingle] = useState('study');
  const [selectedMulti, setSelectedMulti] = useState<string[]>(['react', 'expo']);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSegment, setSelectedSegment] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [ringProgress, setRingProgress] = useState(68);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedFilterChip, setSelectedFilterChip] = useState('All');

  const accentOptions: { key: AccentColor; label: string; color: string }[] = [
    { key: 'indigo', label: 'Indigo', color: ACCENT_PALETTES.indigo.primary },
    { key: 'emerald', label: 'Emerald', color: ACCENT_PALETTES.emerald.primary },
    { key: 'rose', label: 'Rose', color: ACCENT_PALETTES.rose.primary },
    { key: 'amber', label: 'Amber', color: ACCENT_PALETTES.amber.primary },
    { key: 'sky', label: 'Sky', color: ACCENT_PALETTES.sky.primary },
  ];

  const categoryOptions = [
    { label: 'Work', value: 'work', icon: <Briefcase size={16} color={theme.colors.text} /> },
    { label: 'Study', value: 'study', icon: <BookOpen size={16} color={theme.colors.text} /> },
    { label: 'University', value: 'uni', icon: <GraduationCap size={16} color={theme.colors.text} /> },
    { label: 'Personal', value: 'personal', icon: <Heart size={16} color={theme.colors.text} /> },
  ];

  const skillOptions = [
    { label: 'React Native', value: 'react' },
    { label: 'Expo Router', value: 'expo' },
    { label: 'Firebase Firestore', value: 'firebase' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Zustand', value: 'zustand' },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <Header
        title="UI Component Gallery"
        subtitle="Design Tokens & Component Preview"
        showBack
        largeTitle
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Theme & Accent Engine */}
        <Section title="Theme Engine & Accent Colors">
          <Text style={[styles.subheading, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
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

          <Text style={[styles.subheading, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Accent Palette (Active: {theme.accentName.toUpperCase()})
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
        </Section>

        {/* Section 2: Typography Tokens */}
        <Section title="Typography Scale (Inter)">
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text style={[theme.typography.display, { color: theme.colors.text, marginBottom: 8 }]}>
              Display 28 Bold
            </Text>
            <Text style={[theme.typography.title, { color: theme.colors.text, marginBottom: 8 }]}>
              Title 22 Bold
            </Text>
            <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 8 }]}>
              Heading 18 SemiBold
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text, marginBottom: 8 }]}>
              Body 16 Regular — Clean and readable typography.
            </Text>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.text, marginBottom: 8 }]}>
              Body 16 Medium — High emphasis body text.
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 4 }]}>
              Caption 13 Regular — Metadata and timestamps.
            </Text>
            <Text style={[theme.typography.badge, { color: theme.accent.primary }]}>
              BADGE 11 SEMIBOLD
            </Text>
          </Card>
        </Section>

        {/* Section 3: Buttons */}
        <Section title="Buttons & Actions">
          <Button
            title="Primary Action (52px)"
            onPress={() => setShowCelebration(true)}
            variant="primary"
            size="primary"
            leftIcon={<Sparkles size={18} color="#FFFFFF" />}
            style={{ marginBottom: 12 }}
          />

          <Button
            title="Secondary Button (44px)"
            onPress={() => {}}
            variant="secondary"
            size="secondary"
            style={{ marginBottom: 12 }}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Outline"
              onPress={() => {}}
              variant="outline"
              size="secondary"
              fullWidth={false}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Danger"
              onPress={() => {}}
              variant="danger"
              size="secondary"
              fullWidth={false}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>

          <View style={[styles.buttonRow, { marginTop: 12 }]}>
            <Button
              title="Small Chip Button"
              onPress={() => {}}
              variant="primary"
              size="sm"
              fullWidth={false}
              style={{ marginRight: 8 }}
            />
            <Button
              title="Loading State"
              onPress={() => {}}
              loading
              size="sm"
              fullWidth={false}
            />
          </View>
        </Section>

        {/* Section 4: Form Inputs */}
        <Section title="Form Fields & Inputs">
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={inputValue}
            onChangeText={setInputValue}
            leftIcon={<Mail size={18} color={theme.colors.textSecondary} />}
            clearable
            helperText="We will never share your email."
          />

          <Input
            label="Password"
            placeholder="Enter password..."
            value={passwordValue}
            onChangeText={setPasswordValue}
            isPassword
            required
          />

          <Input
            label="Validation Error State"
            value="invalid-input"
            error="This field contains an invalid format."
          />
        </Section>

        {/* Section 5: Dropdowns & Selects */}
        <Section title="Dropdowns & Selectors">
          <Select
            label="Category (Single Select with Search)"
            data={categoryOptions}
            value={selectedSingle}
            onChange={(item) => setSelectedSingle(item.value)}
            searchable
          />

          <AppMultiSelect
            label="Skills & Topics (Multi Select Tags)"
            data={skillOptions}
            value={selectedMulti}
            onChange={(items) => setSelectedMulti(items)}
            searchable
          />
        </Section>

        {/* Section 6: Date & Time Picker */}
        <Section title="Date & Time Pickers">
          <DateTimeField
            label="Scheduled Date"
            mode="date"
            value={selectedDate}
            onChange={(d) => setSelectedDate(d)}
          />

          <DateTimeField
            label="Shift Start Time"
            mode="time"
            value={selectedDate}
            onChange={(d) => setSelectedDate(d)}
          />
        </Section>

        {/* Section 7: Cards & Surfaces */}
        <Section title="Cards (16px Padding & Radius)">
          <Card variant="elevated" onPress={() => {}} style={{ marginBottom: 12 }}>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
              Elevated Interactive Card
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              Tap for press feedback (scale 0.98 + light haptic).
            </Text>
          </Card>

          <Card variant="outlined" style={{ marginBottom: 12 }}>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
              Outlined Card
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              Clean crisp borders conforming to theme tokens.
            </Text>
          </Card>

          <Card variant="accent">
            <Text style={[theme.typography.heading, { color: theme.accent.primary }]}>
              Accent Filled Card
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text, marginTop: 4 }]}>
              Highlighted banner card for goals and streaks.
            </Text>
          </Card>
        </Section>

        {/* Section 8: Chips, Priorities & Categories */}
        <Section title="Chips, Priorities & Category Badges">
          <Text style={[styles.subheading, theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
            Priority Pills
          </Text>
          <View style={styles.chipRow}>
            {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
              <Chip key={p} label={p.toUpperCase()} variant="priority" priority={p} />
            ))}
          </View>

          <Text style={[styles.subheading, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 12 }]}>
            Category Tags
          </Text>
          <View style={styles.chipRow}>
            {(['work', 'study', 'uni', 'personal', 'health', 'finance'] as TaskCategory[]).map((c) => (
              <Chip key={c} label={c.toUpperCase()} variant="category" category={c} />
            ))}
          </View>

          <Text style={[styles.subheading, theme.typography.captionBold, { color: theme.colors.textSecondary, marginTop: 12 }]}>
            Interactive Filter Chips
          </Text>
          <View style={styles.chipRow}>
            {['All', 'Today', 'Upcoming', 'Completed'].map((f) => (
              <Chip
                key={f}
                label={f}
                selected={selectedFilterChip === f}
                onPress={() => setSelectedFilterChip(f)}
              />
            ))}
          </View>
        </Section>

        {/* Section 9: Progress Indicators */}
        <Section title="Progress Indicators (Rings & Bars)">
          <View style={styles.progressRow}>
            <ProgressRing progress={ringProgress} size={110} strokeWidth={10} />
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                Study Goal Progress
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginVertical: 6 }]}>
                {ringProgress}% completed this week
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Button
                  title="-10%"
                  onPress={() => setRingProgress((p) => Math.max(0, p - 10))}
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                  style={{ marginRight: 8, minWidth: 60 }}
                />
                <Button
                  title="+10%"
                  onPress={() => setRingProgress((p) => Math.min(100, p + 10))}
                  variant="primary"
                  size="sm"
                  fullWidth={false}
                  style={{ minWidth: 60 }}
                />
              </View>
            </View>
          </View>

          <ProgressBar
            progress={ringProgress}
            label="Weekly Milestone"
            showLabel
            style={{ marginTop: 16 }}
          />
        </Section>

        {/* Section 10: Segmented Control */}
        <Section title="Segmented Controls">
          <SegmentedControl<'daily' | 'weekly' | 'monthly'>
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
            value={selectedSegment}
            onChange={(s) => setSelectedSegment(s)}
          />
        </Section>

        {/* Section 11: Loading Skeletons */}
        <Section title="Shimmer Loading Skeletons">
          <SkeletonList count={2} />
        </Section>

        {/* Section 12: Empty State */}
        <Section title="Empty State Component">
          <Card variant="outlined">
            <EmptyState
              title="No Tasks Scheduled"
              description="Your planner is clean for today. Tap below to create your first task or habit."
              actionTitle="Add New Task"
              onAction={() => setShowCelebration(true)}
            />
          </Card>
        </Section>

        {/* Section 13: Bottom Sheet Trigger */}
        <Section title="Interactive Bottom Sheet">
          <Button
            title="Open Bottom Sheet Demo"
            onPress={() => bottomSheetRef.current?.expand()}
            variant="secondary"
            size="primary"
            leftIcon={<Layers size={18} color={theme.colors.text} />}
          />
        </Section>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Bottom Sheet Demo Modal */}
      <Sheet ref={bottomSheetRef} snapPoints={['45%']}>
        <Text style={[theme.typography.title, { color: theme.colors.text, marginBottom: 8 }]}>
          Create Quick Plan
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 20 }]}>
          Select what you want to add to your schedule or study plan.
        </Text>

        <Button
          title="Create New Task"
          onPress={() => {
            bottomSheetRef.current?.close();
            setShowCelebration(true);
          }}
          variant="primary"
          size="primary"
          style={{ marginBottom: 12 }}
        />

        <Button
          title="Dismiss"
          onPress={() => bottomSheetRef.current?.close()}
          variant="ghost"
          size="secondary"
        />
      </Sheet>

      {/* Confetti Celebration Overlay */}
      <ConfettiCelebration
        visible={showCelebration}
        message="Action Completed!"
        onFinish={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, theme.typography.heading, { color: theme.colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 14,
  },
  subheading: {
    marginBottom: 8,
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  accentSwatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
