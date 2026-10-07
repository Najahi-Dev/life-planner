import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, BookOpen, BellRing, ArrowRight, Check } from 'lucide-react-native';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hapticFeedback } from '@/utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const { setOnboardingCompleted } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Plan Your Life & Daily Goals',
      subtitle: 'TASKS & HABITS',
      description:
        'Structure your day, week, and month with smart priority tags, recurring habits, and drag-and-drop ordering.',
      icon: <Calendar size={56} color={theme.accent.primary} />,
    },
    {
      id: '2',
      title: 'Track Work Shifts & Academics',
      subtitle: 'SCHEDULE & UNI',
      description:
        'Stay ahead of university assignments, exams, and work shifts with automatic conflict warnings and countdowns.',
      icon: <BookOpen size={56} color={theme.accent.primary} />,
    },
    {
      id: '3',
      title: 'Spaced Repetition & Reminders',
      subtitle: 'SMART RETENTION',
      description:
        'Master new skills with 1-3-7-14-30 day review intervals and never miss a beat with push notifications & SMS.',
      icon: <BellRing size={56} color={theme.accent.primary} />,
    },
  ];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleNext = async () => {
    hapticFeedback.light();
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    hapticFeedback.success();
    await setOnboardingCompleted(true);
    router.replace('/(auth)/login');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Header Skip Button */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.screenPadding }]}>
        {!isLastSlide ? (
          <Button
            title="Skip"
            onPress={handleComplete}
            variant="ghost"
            size="sm"
            fullWidth={false}
          />
        ) : (
          <View style={{ height: 36 }} />
        )}
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH, paddingHorizontal: theme.spacing.xl }]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.accent.primarySoft,
                  borderRadius: theme.radius.full,
                  marginBottom: theme.spacing.xxl,
                },
              ]}
            >
              {item.icon}
            </View>

            <Text
              style={[
                styles.subtitle,
                theme.typography.badge,
                { color: theme.accent.primary, marginBottom: theme.spacing.xs },
              ]}
            >
              {item.subtitle}
            </Text>

            <Text
              style={[
                styles.title,
                theme.typography.display,
                { color: theme.colors.text, marginBottom: theme.spacing.md },
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.description,
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Footer with Pagination & Action Button */}
      <View style={[styles.footer, { paddingHorizontal: theme.spacing.screenPadding }]}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: isActive ? 24 : 8,
                    backgroundColor: isActive ? theme.accent.primary : theme.colors.border,
                    borderRadius: theme.radius.full,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <Button
          title={isLastSlide ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="primary"
          rightIcon={
            isLastSlide ? (
              <Check size={20} color="#FFFFFF" />
            ) : (
              <ArrowRight size={20} color="#FFFFFF" />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 48,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 12,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
  },
});
