import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { History, Star, Clock } from 'lucide-react-native';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { StudySession } from '@/types';

export interface RecentStudySessionsListProps {
  sessions: StudySession[];
}

export const RecentStudySessionsList: React.FC<RecentStudySessionsListProps> = ({ sessions }) => {
  const theme = useTheme();

  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <History size={18} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Recent Study Sessions
          </Text>
        </View>
        <Text style={[theme.typography.captionBold, { color: theme.colors.textSecondary }]}>
          {sessions.length} Logged
        </Text>
      </View>

      <View style={styles.list}>
        {sessions.map((session, index) => {
          const isLast = index === sessions.length - 1;

          return (
            <View
              key={session.id}
              style={[
                styles.sessionRow,
                !isLast && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.leftCol}>
                <Text
                  style={[theme.typography.bodyBold, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {session.topicTitle}
                </Text>

                {session.notes ? (
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.textSecondary, marginTop: 2 },
                    ]}
                    numberOfLines={2}
                  >
                    {session.notes}
                  </Text>
                ) : null}

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
                    <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                      {session.durationMinutes} mins • {session.date}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Star Rating Display */}
              {session.rating && session.rating > 0 ? (
                <View style={styles.ratingRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      color={i < session.rating! ? '#F59E0B' : theme.colors.borderSubtle}
                      fill={i < session.rating! ? '#F59E0B' : 'transparent'}
                      style={{ marginLeft: 2 }}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  leftCol: {
    flex: 1,
    paddingRight: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
});
