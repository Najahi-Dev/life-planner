import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GraduationCap } from 'lucide-react-native';
import { Header, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function UniTabScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header title="University Hub" subtitle="Courses, Assignments, Exams & GPA" />
      <View style={styles.content}>
        <EmptyState
          title="University Module"
          description="Track courses, credits, assignment checklists, exam venues, countdowns, and weighted semester GPA."
          icon={<GraduationCap size={36} color={theme.accent.primary} />}
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
