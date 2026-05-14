import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Colors} from '../theme/colors';
import {Radius, Spacing} from '../theme/spacing';

type State = 'idle' | 'selected' | 'correct' | 'incorrect';

type Props = {
  letter: string;
  text: string;
  state: State;
  onPress: () => void;
  disabled?: boolean;
};

export const OptionButton = ({letter, text, state, onPress, disabled}: Props) => {
  const variant = stateStyles[state];
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.row, variant.container]}>
      <View style={[styles.letterBubble, variant.bubble]}>
        <Text style={[styles.letter, variant.letter]}>{letter}</Text>
      </View>
      <Text style={[styles.text, variant.text]}>{text}</Text>
      {state === 'correct' ? (
        <Icon name="check-circle" size={20} color={Colors.success} style={styles.trailing} />
      ) : null}
      {state === 'incorrect' ? (
        <Icon name="x-circle" size={20} color={Colors.danger} style={styles.trailing} />
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    minHeight: 56,
  },
  letterBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  letter: {fontSize: 14, fontWeight: '700'},
  text: {flex: 1, fontSize: 15, color: Colors.text, lineHeight: 21},
  trailing: {marginLeft: Spacing.sm},
});

const stateStyles: Record<State, {container: any; bubble: any; letter: any; text: any}> = {
  idle: {
    container: {backgroundColor: Colors.surface, borderColor: Colors.border},
    bubble: {backgroundColor: Colors.surfaceMuted},
    letter: {color: Colors.textMuted},
    text: {color: Colors.text},
  },
  selected: {
    container: {backgroundColor: Colors.primaryMuted, borderColor: Colors.primary},
    bubble: {backgroundColor: Colors.primary},
    letter: {color: '#FFF'},
    text: {color: Colors.text},
  },
  correct: {
    container: {backgroundColor: Colors.successMuted, borderColor: Colors.success},
    bubble: {backgroundColor: Colors.success},
    letter: {color: '#FFF'},
    text: {color: Colors.text},
  },
  incorrect: {
    container: {backgroundColor: Colors.dangerMuted, borderColor: Colors.danger},
    bubble: {backgroundColor: Colors.danger},
    letter: {color: '#FFF'},
    text: {color: Colors.text},
  },
};
