import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckSquare } from 'lucide-react-native';
import { Header, EmptyState } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function PlansTabScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header title="Plans & Tasks" subtitle="Daily, Weekly & Monthly Agendas" />
      <View style={styles.content}>
        <EmptyState
          title="Plans Module"
          description="Daily, Weekly, and Monthly task boards with drag-to-reorder, repeat rules, and categories."
          icon={<CheckSquare size={36} color={theme.accent.primary} />}
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
