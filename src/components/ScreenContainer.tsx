import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../theme/colors';
import {Spacing} from '../theme/spacing';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export const ScreenContainer = ({children, style, padded = true, edges = ['top', 'left', 'right']}: Props) => (
  <SafeAreaView style={styles.safe} edges={edges}>
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  inner: {flex: 1},
  padded: {paddingHorizontal: Spacing.lg},
});
