import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService } from '../services/authService';
import { LoginFormData, RegisterFormData, ForgotPasswordFormData, ProfileUpdateFormData } from '../schemas/authSchemas';
import { hapticFeedback } from '@/utils/haptics';

export function useAuth() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const settings = useAuthStore((s) => s.settings);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const logout = useAuthStore((s) => s.logout);
  const setProfile = useAuthStore((s) => s.setProfile);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.loginWithEmail(data),
    onSuccess: (res) => {
      hapticFeedback.success();
      setProfile(res.profile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.registerWithEmail(data),
    onSuccess: (res) => {
      hapticFeedback.success();
      setProfile(res.profile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const demoLoginMutation = useMutation({
    mutationFn: () => authService.loginWithDemoAccount(),
    onSuccess: (res) => {
      hapticFeedback.success();
      setProfile(res.profile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.sendPasswordReset(data.email),
    onSuccess: () => {
      hapticFeedback.success();
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateFormData) => {
      if (!user) throw new Error('Not authenticated');
      await authService.updateUserProfile(user.uid, data);
      const updated = await authService.getUserProfile(user.uid);
      setProfile(updated);
      return updated;
    },
    onSuccess: () => {
      hapticFeedback.success();
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      hapticFeedback.error();
    },
  });

  return {
    user,
    profile,
    settings,
    isAuthenticated,
    isLoading,
    isInitialized,
    onboardingCompleted,
    setOnboardingCompleted,
    loginMutation,
    registerMutation,
    demoLoginMutation,
    forgotPasswordMutation,
    updateProfileMutation,
    logout,
  };
}
