import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
  secondaryActionTitle?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onAction,
  secondaryActionTitle,
  onSecondaryAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.accent.primarySoft,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        {icon || <Inbox size={36} color={theme.accent.primary} />}
      </View>

      <Text
        style={[
          styles.title,
          theme.typography.heading,
          { color: theme.colors.text, marginTop: theme.spacing.lg },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            theme.typography.body,
            { color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
          ]}
        >
          {description}
        </Text>
      )}

      {actionTitle && onAction && (
        <View style={[styles.actionWrapper, { marginTop: theme.spacing.xl }]}>
          <Button
            title={actionTitle}
            onPress={onAction}
            variant="primary"
            size="primary"
            fullWidth={false}
            style={{ minWidth: 160 }}
          />

          {secondaryActionTitle && onSecondaryAction && (
            <Button
              title={secondaryActionTitle}
              onPress={onSecondaryAction}
              variant="ghost"
              size="secondary"
              fullWidth={false}
              style={{ marginTop: 8 }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
  },
  actionWrapper: {
    alignItems: 'center',
  },
});
