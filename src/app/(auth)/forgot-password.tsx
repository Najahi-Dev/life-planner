import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react-native';
import { Button, Input, Card, Header } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/schemas/authSchemas';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const { forgotPasswordMutation } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSuccess(true);
    } catch (error: any) {
      if (error?.code === 'auth/user-not-found') {
        setErrorMessage('No user account found with this email address.');
      } else {
        setErrorMessage(error?.message || 'Failed to send reset email. Please check the address.');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Header title="Reset Password" showBack onBack={() => router.back()} />

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
        >
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: 'rgba(16, 185, 129, 0.14)', borderRadius: theme.radius.full },
                ]}
              >
                <CheckCircle2 size={36} color="#10B981" />
              </View>

              <Text style={[styles.title, theme.typography.title, { color: theme.colors.text }]}>
                Password Reset Email Sent
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  theme.typography.body,
                  { color: theme.colors.textSecondary, marginBottom: 24 },
                ]}
              >
                We have dispatched password reset instructions to{' '}
                <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                  {getValues('email')}
                </Text>
                . Please check your inbox and follow the link.
              </Text>

              <Button
                title="Back to Sign In"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                size="primary"
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: theme.accent.primarySoft, borderRadius: theme.radius.full },
                ]}
              >
                <KeyRound size={28} color={theme.accent.primary} />
              </View>

              <Text style={[styles.title, theme.typography.title, { color: theme.colors.text }]}>
                Forgot Password?
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  theme.typography.body,
                  { color: theme.colors.textSecondary, marginBottom: 24 },
                ]}
              >
                Enter your registered email address and we will send you a link to reset your account password.
              </Text>

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

              <Button
                title="Send Reset Link"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                size="primary"
                loading={forgotPasswordMutation.isPending}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
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
    paddingVertical: 20,
    justifyContent: 'center',
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
    maxWidth: 320,
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
