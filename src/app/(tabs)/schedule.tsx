import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Plus } from 'lucide-react-native';
import {
  Header,
  SegmentedControl,
  SkeletonList,
  Button,
  ConfettiCelebration,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useShifts } from '@/features/schedule/hooks/useShifts';
import {
  WeeklyHoursSummaryCard,
  OverlapWarningBanner,
  ShiftCalendarView,
  ShiftListView,
} from '@/features/schedule/components';
import { QuickCreateSheet, CreateType } from '@/components/create/QuickCreateSheet';
import { ScheduleViewMode } from '@/features/schedule/types';

export default function ScheduleTabScreen() {
  const theme = useTheme();
  const {
    shifts,
    conflicts,
    weeklySummary,
    hasConflicts,
    isLoading,
    isRefetching,
    refetch,
    deleteShift,
  } = useShifts();

  const [viewMode, setViewMode] = useState<ScheduleViewMode>('calendar');
  const createSheetRef = useRef<BottomSheet>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  const handleOpenCreate = () => {
    createSheetRef.current?.expand();
  };

  const handleCreateSuccess = (_type: CreateType, msg: string) => {
    setCelebrationMsg(msg);
    setCelebrationVisible(true);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Screen Header */}
      <Header
        title="Work Schedule"
        subtitle="Shifts, Hours & Earnings"
        rightAction={
          <Button
            title="New"
            onPress={handleOpenCreate}
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} color="#FFFFFF" />}
            fullWidth={false}
          />
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
        {/* Weekly Hours & Earnings Summary */}
        <WeeklyHoursSummaryCard summary={weeklySummary} />

        {/* Overlap Conflict Warning Banner */}
        {hasConflicts && <OverlapWarningBanner conflicts={conflicts} />}

        {/* View Mode Switcher (Calendar vs List) */}
        <SegmentedControl<ScheduleViewMode>
          options={[
            { label: 'Calendar View', value: 'calendar' },
            { label: 'List View', value: 'list' },
          ]}
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
          style={{ marginBottom: 16 }}
        />

        {/* Active Schedule View */}
        {isLoading && shifts.length === 0 ? (
          <SkeletonList count={3} itemHeight={100} />
        ) : viewMode === 'calendar' ? (
          <ShiftCalendarView
            shifts={shifts}
            conflicts={conflicts}
            onDeleteShift={deleteShift}
            onAddShift={handleOpenCreate}
          />
        ) : (
          <ShiftListView
            shifts={shifts}
            conflicts={conflicts}
            onDeleteShift={deleteShift}
            onAddShift={handleOpenCreate}
          />
        )}

        {/* Bottom tab bar spacer */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Shift Quick Create Bottom Sheet */}
      <QuickCreateSheet ref={createSheetRef} onSuccess={handleCreateSuccess} />

      {/* Creation Celebration */}
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
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
});
