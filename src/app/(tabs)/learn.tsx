import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { Header, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function LearnTabScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header title="Learning & Mastery" subtitle="Spaced Repetition & Study Tracker" />
      <View style={styles.content}>
        <EmptyState
          title="Learning Module"
          description="Log study sessions, review topics with 1-3-7-14-30 day spaced repetition, and build learning streaks."
          icon={<BookOpen size={36} color={theme.accent.primary} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
