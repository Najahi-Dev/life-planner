import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, UserPlus } from 'lucide-react-native';
import { Button, Input, Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/authSchemas';
import { hapticFeedback } from '@/utils/haptics';

export default function RegisterScreen() {
  const theme = useTheme();
  const { registerMutation } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerMutation.mutateAsync(data);
      router.replace('/');
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email address already exists.');
      } else if (error?.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please choose a stronger password.');
      } else {
        setErrorMessage(error?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: theme.spacing.screenPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
              ]}
            >
              <UserPlus size={28} color={theme.accent.primary} />
            </View>

            <Text style={[styles.title, theme.typography.display, { color: theme.colors.text }]}>
              Create Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              Start organizing your plans, courses, and schedules in one place.
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <Card
              variant="outlined"
              style={{
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                marginBottom: 16,
              }}
            >
              <Text style={[theme.typography.captionBold, { color: '#EF4444' }]}>
                {errorMessage}
              </Text>
            </Card>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Rivers"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.displayName?.message}
                  leftIcon={<User size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Minimum 6 characters"
                  isPassword
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Lock size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Re-type your password"
                  isPassword
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  leftIcon={<Lock size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="primary"
              loading={registerMutation.isPending}
              style={{ marginTop: 8 }}
            />
          </View>

          {/* Footer Login Link */}
          <View style={styles.footer}>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Pressable
              onPress={() => {
                hapticFeedback.light();
                router.push('/(auth)/login');
              }}
              hitSlop={8}
            >
              <Text
                style={[
                  theme.typography.bodyBold,
                  { color: theme.accent.primary },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
});
