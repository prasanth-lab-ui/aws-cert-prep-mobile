import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import {Colors} from '../theme/colors';
import {Radius, Spacing} from '../theme/spacing';
import {Typography} from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export const Button = ({title, onPress, variant = 'primary', loading, disabled, style}: Props) => {
  const isDisabled = !!disabled || !!loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].label.color as string} />
      ) : (
        <Text style={[styles.label, variantStyles[variant].label]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  label: {...Typography.button},
  disabled: {opacity: 0.55},
  pressed: {opacity: 0.85},
});

const variantStyles: Record<Variant, {container: ViewStyle; label: {color: string}}> = {
  primary: {
    container: {backgroundColor: Colors.primary},
    label: {color: '#FFFFFF'},
  },
  secondary: {
    container: {backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1},
    label: {color: Colors.text},
  },
  ghost: {
    container: {backgroundColor: 'transparent'},
    label: {color: Colors.primary},
  },
  danger: {
    container: {backgroundColor: Colors.danger},
    label: {color: '#FFFFFF'},
  },
};
