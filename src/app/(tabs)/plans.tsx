import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Plus } from 'lucide-react-native';
import {
  Header,
  SegmentedControl,
  SkeletonList,
  ConfettiCelebration,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useTasks } from '@/features/plans/hooks/useTasks';
import {
  TaskFilterBar,
  DailyView,
  WeeklyView,
  MonthlyView,
} from '@/features/plans/components';
import { QuickCreateSheet, CreateType } from '@/components/create/QuickCreateSheet';
import { PlanViewMode } from '@/features/plans/types';

export default function PlansTabScreen() {
  const theme = useTheme();
  const {
    tasks,
    isLoading,
    isRefetching,
    refetch,
    filters,
    setFilters,
    toggleTaskStatus,
    deleteTask,
  } = useTasks();

  const [viewMode, setViewMode] = useState<PlanViewMode>('daily');
  const createSheetRef = useRef<BottomSheet>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  const handleOpenCreate = () => {
    console.log('[Tap] Plans screen handleOpenCreate clicked');
    createSheetRef.current?.expand();
  };

  const handleCreateSuccess = (_type: CreateType, msg: string) => {
    setCelebrationMsg(msg);
    setCelebrationVisible(true);
  };

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    console.log('[Tap] Plans screen handleToggleTask:', taskId, 'status:', currentStatus);
    toggleTaskStatus(taskId, currentStatus);
    if (currentStatus !== 'completed') {
      setCelebrationMsg('Task completed! Great work.');
      setCelebrationVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Screen Header */}
      <Header
        title="Plans & Agendas"
        subtitle="Manage Tasks, Goals & Habits"
        rightAction={
          <Pressable
            onPress={handleOpenCreate}
            hitSlop={8}
            accessibilityLabel="New Task"
            style={[
              styles.headerIconBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderRadius: theme.radius.button,
              },
            ]}
          >
            <Plus size={22} color={theme.accent.primary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.screenPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.accent.primary}
            colors={[theme.accent.primary]}
          />
        }
      >
        {/* View Mode Segmented Control (Daily / Weekly / Monthly) */}
        <SegmentedControl<PlanViewMode>
          options={[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
          style={{ marginBottom: 12 }}
        />

        {/* Search & Filter Bar */}
        <TaskFilterBar
          filters={filters}
          onChangeFilters={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        />

        {/* Loading State or Active View */}
        {isLoading && tasks.length === 0 ? (
          <SkeletonList count={4} style={{ marginTop: 12 }} />
        ) : viewMode === 'daily' ? (
          <DailyView
            tasks={tasks}
            onToggleStatus={handleToggleTask}
            onDeleteTask={deleteTask}
            onAddTask={handleOpenCreate}
          />
        ) : viewMode === 'weekly' ? (
          <WeeklyView
            tasks={tasks}
            onToggleStatus={handleToggleTask}
            onDeleteTask={deleteTask}
            onAddTask={handleOpenCreate}
          />
        ) : (
          <MonthlyView
            tasks={tasks}
            onToggleStatus={handleToggleTask}
            onDeleteTask={deleteTask}
            onAddTask={handleOpenCreate}
          />
        )}

        {/* Bottom tab bar padding */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Task Quick Create Bottom Sheet */}
      <QuickCreateSheet ref={createSheetRef} onSuccess={handleCreateSuccess} />

      {/* Completion Confetti Celebration */}
      <ConfettiCelebration
        visible={celebrationVisible}
        message={celebrationMsg}
        onFinish={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
});
