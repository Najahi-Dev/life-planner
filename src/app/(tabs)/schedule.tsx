import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { Header, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function ScheduleTabScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header title="Work Schedule" subtitle="Shifts, Overlap Checks & Hours" />
      <View style={styles.content}>
        <EmptyState
          title="Work Schedule Module"
          description="Track work shifts, calculate weekly earnings, and prevent overlapping schedules."
          icon={<Calendar size={36} color={theme.accent.primary} />}
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
