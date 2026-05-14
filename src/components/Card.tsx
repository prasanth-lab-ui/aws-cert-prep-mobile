import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '../theme/colors';
import {Radius, Spacing} from '../theme/spacing';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const Card = ({children, style}: Props) => <View style={[styles.card, style]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
