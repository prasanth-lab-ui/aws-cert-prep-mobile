import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Card} from './Card';
import {Colors} from '../theme/colors';
import {Spacing} from '../theme/spacing';
import {Typography} from '../theme/typography';

type Props = {
  icon: string;
  label: string;
  value: string | number;
  tint?: string;
};

export const StatCard = ({icon, label, value, tint = Colors.primary}: Props) => (
  <Card style={styles.card}>
    <View style={[styles.iconWrap, {backgroundColor: tint + '22'}]}>
      <Icon name={icon} size={18} color={tint} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </Card>
);

const styles = StyleSheet.create({
  card: {flex: 1, marginHorizontal: Spacing.xs / 2},
  iconWrap: {width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm},
  value: {...Typography.h2, color: Colors.text},
  label: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
});
