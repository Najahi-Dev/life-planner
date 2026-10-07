import React, { useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { QuickCreateSheet, CreateType } from '@/components/create/QuickCreateSheet';
import { ConfettiCelebration } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function TabsLayout() {
  const theme = useTheme();
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
    <>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} onOpenCreate={handleOpenCreate} />
        )}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="plans" options={{ title: 'Plans' }} />
        <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
        <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
        <Tabs.Screen name="uni" options={{ title: 'Uni' }} />
      </Tabs>

      {/* Global Quick Create Bottom Sheet */}
      <QuickCreateSheet ref={createSheetRef} onSuccess={handleCreateSuccess} />

      {/* Global Creation Celebration Modal */}
      <ConfettiCelebration
        visible={celebrationVisible}
        message={celebrationMsg}
        onFinish={() => setCelebrationVisible(false)}
      />
    </>
  );
}
