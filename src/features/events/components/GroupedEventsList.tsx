import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar, Sparkles, Clock, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { GroupedEvents } from '../types';
import { CalendarEvent } from '@/types';
import { EventCard } from './EventCard';

export interface GroupedEventsListProps {
  grouped?: GroupedEvents;
  onSelectEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const GroupedEventsList: React.FC<GroupedEventsListProps> = ({
  grouped,
  onSelectEvent,
  onDeleteEvent,
}) => {
  const theme = useTheme();

  const sections: { title: string; subtitle: string; events: CalendarEvent[]; icon: any }[] = [
    {
      title: 'Today',
      subtitle: "Scheduled for today's agenda",
      events: grouped?.today || [],
      icon: <Sparkles size={16} color={theme.accent.primary} />,
    },
    {
      title: 'Tomorrow',
      subtitle: 'Coming up tomorrow',
      events: grouped?.tomorrow || [],
      icon: <Clock size={16} color={theme.accent.primary} />,
    },
    {
      title: 'This Week',
      subtitle: 'Next 2 to 7 days',
      events: grouped?.thisWeek || [],
      icon: <Calendar size={16} color={theme.accent.primary} />,
    },
    {
      title: 'Upcoming Later',
      subtitle: 'Future scheduled events',
      events: grouped?.later || [],
      icon: <CheckCircle2 size={16} color={theme.colors.textSecondary} />,
    },
  ];

  return (
    <View style={styles.container}>
      {sections.map((sec) => {
        if (sec.events.length === 0) return null;

        return (
          <View key={sec.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                {sec.icon}
                <Text style={[styles.sectionTitle, theme.typography.heading, { color: theme.colors.text }]}>
                  {sec.title}
                </Text>
              </View>
              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
                ]}
              >
                <Text style={[theme.typography.captionBold, { color: theme.accent.primary }]}>
                  {sec.events.length}
                </Text>
              </View>
            </View>

            {sec.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={onSelectEvent}
                onDelete={onDeleteEvent}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    marginLeft: 2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
