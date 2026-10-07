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
import { User, Phone, FileText, CheckCircle, Flame, Clock } from 'lucide-react-native';
import { Header, Card, Input, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileUpdateSchema, ProfileUpdateFormData } from '@/features/auth/schemas/authSchemas';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, profile, updateProfileMutation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: profile?.displayName || user?.displayName || 'Alex Rivers',
      phoneNumber: profile?.phoneNumber || '',
      bio: profile?.bio || 'Computer Science & Software Engineering Student',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      setIsEditing(false);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Profile & Bio"
        subtitle="Manage Personal Information"
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: theme.spacing.screenPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Banner */}
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: theme.accent.primary, borderRadius: theme.radius.full },
              ]}
            >
              <User size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.userName, theme.typography.title, { color: theme.colors.text }]}>
              {profile?.displayName || user?.displayName || 'Alex Rivers'}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              {user?.email || 'alex@example.com'}
            </Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statCard}>
              <CheckCircle size={20} color={theme.accent.primary} />
              <Text style={[styles.statValue, theme.typography.heading, { color: theme.colors.text }]}>
                48
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                Completed Tasks
              </Text>
            </Card>

            <Card variant="elevated" style={styles.statCard}>
              <Flame size={20} color="#F59E0B" />
              <Text style={[styles.statValue, theme.typography.heading, { color: theme.colors.text }]}>
                5 Days
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                Study Streak
              </Text>
            </Card>

            <Card variant="elevated" style={styles.statCard}>
              <Clock size={20} color="#10B981" />
              <Text style={[styles.statValue, theme.typography.heading, { color: theme.colors.text }]}>
                12.5h
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                Study Hours
              </Text>
            </Card>
          </View>

          {/* Profile Form / View */}
          <Card variant="elevated" style={styles.formCard}>
            <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 16 }]}>
              {isEditing ? 'Edit Profile' : 'Personal Details'}
            </Text>

            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Display Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={!isEditing}
                  error={errors.displayName?.message}
                  leftIcon={<User size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-1234"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={!isEditing}
                  keyboardType="phone-pad"
                  leftIcon={<Phone size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio / Major"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={!isEditing}
                  multiline
                  numberOfLines={2}
                  leftIcon={<FileText size={18} color={theme.colors.textSecondary} />}
                />
              )}
            />

            {isEditing ? (
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={() => setIsEditing(false)}
                  variant="ghost"
                  size="secondary"
                  fullWidth={false}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Save Changes"
                  onPress={handleSubmit(onSubmit)}
                  variant="primary"
                  size="secondary"
                  loading={updateProfileMutation.isPending}
                  fullWidth={false}
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            ) : (
              <Button
                title="Edit Details"
                onPress={() => setIsEditing(true)}
                variant="secondary"
                size="primary"
              />
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: {
    marginBottom: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 12,
  },
  statValue: {
    marginTop: 6,
    marginBottom: 2,
  },
  formCard: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
