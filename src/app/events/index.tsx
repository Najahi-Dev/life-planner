import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Calendar, Plus, Sparkles, Filter, Clock } from 'lucide-react-native';
import {
  Header,
  SegmentedControl,
  Skeleton,
  SkeletonList,
  EmptyState,
  Button,
  Chip,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useEvents } from '@/features/events/hooks/useEvents';
import {
  EventCard,
  EventMonthCalendar,
  GroupedEventsList,
  AddEventSheet,
} from '@/features/events/components';
import { EventViewMode, EVENT_TYPE_COLORS } from '@/features/events/types';
import { EventType, CalendarEvent } from '@/types';
import { hapticFeedback } from '@/utils/haptics';
import { format } from 'date-fns';

export default function EventsScreen() {
  const theme = useTheme();
  const {
    events,
    grouped,
    todayCount,
    upcomingThisWeekCount,
    isLoading,
    isRefetching,
    refetch,
    createEvent,
    deleteEvent,
  } = useEvents();

  const [viewMode, setViewMode] = useState<EventViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const addEventSheetRef = useRef<BottomSheet>(null);

  const handleOpenAdd = () => {
    hapticFeedback.selection();
    addEventSheetRef.current?.expand();
  };

  // Filter events by selected category
  const filteredEvents =
    selectedTypeFilter === 'all'
      ? events
      : events.filter((e) => e.type === selectedTypeFilter);

  // Events for selected calendar day
  const dayEvents = filteredEvents.filter((e) => e.date === selectedDate);

  // Events for today
  const todayEvents = filteredEvents.filter((e) => e.date === format(new Date(), 'yyyy-MM-dd'));

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* App Header */}
      <Header
        title="Events & Activities"
        subtitle="Schedule, Meetups & Deadlines"
        showBack
        rightAction={
          <Pressable
            onPress={handleOpenAdd}
            hitSlop={8}
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
        {/* View Mode Switcher */}
        <SegmentedControl<EventViewMode>
          options={[
            { label: 'Calendar', value: 'calendar' },
            { label: 'Timeline Agenda', value: 'agenda' },
            { label: 'Today', value: 'today' },
          ]}
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
          style={{ marginBottom: 12 }}
        />

        {/* Category Filter Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Chip
            label="ALL CATEGORIES"
            selected={selectedTypeFilter === 'all'}
            onPress={() => setSelectedTypeFilter('all')}
          />
          {(['academic', 'work', 'social', 'health', 'personal', 'deadline'] as EventType[]).map((t) => (
            <Chip
              key={t}
              label={EVENT_TYPE_COLORS[t].label.toUpperCase()}
              selected={selectedTypeFilter === t}
              onPress={() => setSelectedTypeFilter(t)}
            />
          ))}
        </ScrollView>

        {/* Loading State */}
        {isLoading && events.length === 0 ? (
          <View style={{ marginTop: 8 }}>
            <Skeleton height={260} borderRadius={16} style={{ marginBottom: 16 }} />
            <SkeletonList count={3} />
          </View>
        ) : (
          <>
            {/* 1. CALENDAR VIEW */}
            {viewMode === 'calendar' && (
              <View>
                <EventMonthCalendar
                  events={filteredEvents}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                />

                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Clock size={16} color={theme.accent.primary} style={{ marginRight: 6 }} />
                    <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                      Events on {selectedDate}
                    </Text>
                  </View>
                  <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
                    {dayEvents.length} Scheduled
                  </Text>
                </View>

                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={(id) => deleteEvent(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No events on this day"
                    description="Tap '+ New' to schedule an activity or meeting on this date."
                    icon={<Calendar size={36} color={theme.accent.primary} />}
                    actionTitle="Add Event"
                    onAction={handleOpenAdd}
                  />
                )}
              </View>
            )}

            {/* 2. TIMELINE AGEDA VIEW */}
            {viewMode === 'agenda' && (
              <GroupedEventsList
                grouped={grouped}
                onDeleteEvent={(id) => deleteEvent(id)}
              />
            )}

            {/* 3. TODAY VIEW */}
            {viewMode === 'today' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                    {"Today's Schedule"} ({todayEvents.length})
                  </Text>
                </View>

                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={(id) => deleteEvent(id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No events today"
                    description="Enjoy your free time or schedule a study group, workout, or meetup."
                    icon={<Sparkles size={36} color={theme.accent.primary} />}
                    actionTitle="Schedule Event"
                    onAction={handleOpenAdd}
                  />
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Add Event Bottom Sheet */}
      <AddEventSheet
        ref={addEventSheetRef}
        initialDate={selectedDate}
        onSave={async (data) => {
          await createEvent(data);
        }}
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
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
