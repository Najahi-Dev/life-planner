import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const hapticFeedback = {
  selection: async () => {
    if (isWeb) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Haptics unavailable on simulator or unsupported devices
    }
  },

  light: async () => {
    if (isWeb) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable
    }
  },

  medium: async () => {
    if (isWeb) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics unavailable
    }
  },

  heavy: async () => {
    if (isWeb) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics unavailable
    }
  },

  success: async () => {
    if (isWeb) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics unavailable
    }
  },

  warning: async () => {
    if (isWeb) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Haptics unavailable
    }
  },

  error: async () => {
    if (isWeb) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Haptics unavailable
    }
  },
};
