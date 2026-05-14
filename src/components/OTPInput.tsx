import React, {useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Colors} from '../theme/colors';
import {Radius, Spacing} from '../theme/spacing';

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
};

export const OTPInput = ({value, onChange, length = 6}: Props) => {
  const refs = useRef<Array<TextInput | null>>([]);
  const chars = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (text: string, idx: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = chars.slice();
    next[idx] = digit;
    onChange(next.join(''));
    if (digit && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKey = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !chars[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({length}).map((_, idx) => (
        <TextInput
          key={idx}
          ref={r => (refs.current[idx] = r)}
          value={chars[idx]}
          onChangeText={t => handleChange(t, idx)}
          onKeyPress={e => handleKey(e, idx)}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.box}
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg},
  box: {
    width: 46,
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
});
