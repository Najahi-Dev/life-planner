import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface OfflineBannerProps {
  isOffline?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline = false }) => {
  const theme = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: '#F59E0B',
          paddingHorizontal: theme.spacing.screenPadding,
          paddingVertical: theme.spacing.xs + 2,
        },
      ]}
    >
      <WifiOff size={14} color="#000000" style={styles.icon} />
      <Text style={[styles.text, theme.typography.captionBold, { color: '#000000' }]}>
        Offline mode — local changes will sync automatically
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 999,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    textAlign: 'center',
  },
});
