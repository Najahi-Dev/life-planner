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
import { Mail, Lock, Sparkles, LogIn } from 'lucide-react-native';
import { Button, Input, Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/authSchemas';
import { hapticFeedback } from '@/utils/haptics';

export default function LoginScreen() {
  const theme = useTheme();
  const { loginMutation, demoLoginMutation } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(data);
      router.replace('/');
    } catch (error: any) {
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found') {
        setErrorMessage('Invalid email or password. Please try again.');
      } else if (error?.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please try again later.');
      } else {
        setErrorMessage(error?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    try {
      await demoLoginMutation.mutateAsync();
      router.replace('/');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to sign in to demo account.');
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
          {/* Header Title */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
              ]}
            >
              <Sparkles size={28} color={theme.accent.primary} />
            </View>

            <Text style={[styles.title, theme.typography.display, { color: theme.colors.text }]}>
              Welcome Back
            </Text>
            <Text
              style={[
                styles.subtitle,
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              Sign in to sync your plans, work shifts, and academic goals.
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
                  placeholder="Enter your password"
                  isPassword
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Lock size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordRow}>
              <Pressable
                onPress={() => {
                  hapticFeedback.light();
                  router.push('/(auth)/forgot-password');
                }}
                hitSlop={8}
              >
                <Text
                  style={[
                    theme.typography.captionBold,
                    { color: theme.accent.primary },
                  ]}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Primary Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="primary"
              loading={loginMutation.isPending}
              leftIcon={<LogIn size={20} color="#FFFFFF" />}
              style={{ marginTop: 8 }}
            />

            {/* Instant Demo Account Quick Login */}
            <Button
              title="Explore Demo Account (1-Tap)"
              onPress={handleDemoLogin}
              variant="secondary"
              size="secondary"
              loading={demoLoginMutation.isPending}
              leftIcon={<Sparkles size={18} color={theme.accent.primary} />}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Footer Register Link */}
          <View style={styles.footer}>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable
              onPress={() => {
                hapticFeedback.light();
                router.push('/(auth)/register');
              }}
              hitSlop={8}
            >
              <Text
                style={[
                  theme.typography.bodyBold,
                  { color: theme.accent.primary },
                ]}
              >
                Sign Up
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
    marginBottom: 28,
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
  forgotPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginTop: -4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
});
