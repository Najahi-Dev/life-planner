import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Eye, EyeOff, XCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SEMANTIC_COLORS } from '@/theme/colors';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  isPassword = false,
  clearable = false,
  onClear,
  required = false,
  disabled = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;

  const getBorderColor = () => {
    if (hasError) return SEMANTIC_COLORS.error;
    if (isFocused) return theme.accent.primary;
    return theme.colors.inputBorder;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              theme.typography.captionBold,
              { color: hasError ? SEMANTIC_COLORS.error : theme.colors.textSecondary },
            ]}
          >
            {label}
            {required && <Text style={{ color: SEMANTIC_COLORS.error }}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            height: theme.sizes.inputHeight, // 52
            borderRadius: theme.radius.input, // 12
            backgroundColor: theme.colors.inputBackground,
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 1.5 : 1,
            paddingHorizontal: theme.spacing.lg,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            theme.typography.body,
            { color: theme.colors.text },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {clearable && !!value && !disabled && (
          <Pressable
            hitSlop={8}
            onPress={() => {
              onChangeText?.('');
              onClear?.();
            }}
            style={styles.actionIcon}
          >
            <XCircle size={18} color={theme.colors.textMuted} />
          </Pressable>
        )}

        {isPassword && (
          <Pressable
            hitSlop={8}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.actionIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </Pressable>
        )}

        {!isPassword && rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {hasError ? (
        <Text style={[styles.feedbackText, theme.typography.caption, { color: SEMANTIC_COLORS.error }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.feedbackText,
            theme.typography.caption,
            { color: theme.colors.textMuted },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelRow: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    padding: 4,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    marginTop: 4,
    marginLeft: 2,
  },
});
