import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Card} from './Card';
import {Colors} from '../theme/colors';
import {Spacing} from '../theme/spacing';
import {Typography} from '../theme/typography';
import {SessionRecord} from '../services/sessions';

type Props = {
  session: SessionRecord;
  onPress?: () => void;
};

export const SessionCard = ({session, onPress}: Props) => {
  const date = session.completed_at || session.started_at;
  const score = session.score ?? 0;
  const ok = score >= 70;
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Practice Session</Text>
            <Text style={styles.meta}>
              {new Date(date).toLocaleDateString()} · {session.total_questions ?? 0} questions
            </Text>
          </View>
          <View style={[styles.scoreBubble, {backgroundColor: ok ? Colors.successMuted : Colors.dangerMuted}]}>
            <Text style={[styles.scoreText, {color: ok ? Colors.success : Colors.danger}]}>{score}%</Text>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.textMuted} style={{marginLeft: Spacing.sm}} />
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {marginBottom: Spacing.sm},
  row: {flexDirection: 'row', alignItems: 'center'},
  title: {...Typography.bodyBold, color: Colors.text},
  meta: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  scoreBubble: {paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: 999},
  scoreText: {fontSize: 13, fontWeight: '700'},
});
