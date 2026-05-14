import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {Colors} from '../theme/colors';
import {Radius, Spacing} from '../theme/spacing';
import {Typography} from '../theme/typography';

type Props = TextInputProps & {
  label?: string;
  error?: string | null;
};

export const TextField = ({label, error, style, ...rest}: Props) => (
  <View style={styles.wrapper}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      placeholderTextColor={Colors.textMuted}
      style={[styles.input, !!error && styles.inputError, style]}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {marginBottom: Spacing.md},
  label: {...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.xs, textTransform: 'uppercase'},
  input: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    color: Colors.text,
    fontSize: 15,
  },
  inputError: {borderColor: Colors.danger},
  errorText: {color: Colors.danger, fontSize: 12, marginTop: 4},
});
