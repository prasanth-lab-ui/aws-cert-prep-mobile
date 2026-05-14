import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../App';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Button} from '../../components/Button';
import {OptionButton} from '../../components/OptionButton';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {Question} from '../../services/questions';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const toEntries = (options: Question['options']): Array<{key: string; text: string}> => {
  if (Array.isArray(options)) return options.map((text, i) => ({key: String.fromCharCode(65 + i), text}));
  return Object.entries(options || {}).map(([key, text]) => ({key, text: String(text)}));
};

const ResultsScreen = ({navigation, route}: Props) => {
  const {score, correctCount, total, questions, userAnswers} = route.params;
  const passed = score >= 70;

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={[styles.scoreCard, {borderColor: passed ? Colors.success : Colors.danger}]}>
          <Icon name={passed ? 'check-circle' : 'alert-circle'} size={32} color={passed ? Colors.success : Colors.danger} />
          <Text style={styles.score}>{score}%</Text>
          <Text style={styles.scoreLabel}>{correctCount} of {total} correct</Text>
          <Text style={[styles.verdict, {color: passed ? Colors.success : Colors.danger}]}>{passed ? 'Passed!' : 'Keep practicing'}</Text>
        </Card>

        <Text style={styles.section}>Question review</Text>
        {questions.map((q: Question, idx: number) => {
          const userKey = userAnswers?.[q.id];
          const isCorrect = userKey === q.correct_answer;
          return (
            <Card key={q.id} style={{marginBottom: Spacing.md}}>
              <Text style={styles.qIndex}>Question {idx + 1} {isCorrect ? '✓' : '✗'}</Text>
              <Text style={styles.qText}>{q.question_text}</Text>
              <View style={{height: Spacing.sm}} />
              {toEntries(q.options).map(({key, text}) => {
                let state: 'idle' | 'selected' | 'correct' | 'incorrect' = 'idle';
                if (key === q.correct_answer) state = 'correct';
                else if (key === userKey) state = 'incorrect';
                return <OptionButton key={key} letter={key} text={text} state={state} onPress={() => {}} disabled />;
              })}
            </Card>
          );
        })}

        <View style={{height: Spacing.lg}} />
        <Button title="Back to dashboard" onPress={() => navigation.popToTop()} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingBottom: Spacing.xxl},
  scoreCard: {alignItems: 'center', borderWidth: 2, marginBottom: Spacing.lg},
  score: {fontSize: 48, fontWeight: '800', color: Colors.text, marginTop: Spacing.sm},
  scoreLabel: {...Typography.body, color: Colors.textMuted},
  verdict: {marginTop: Spacing.sm, fontWeight: '700', fontSize: 16},
  section: {...Typography.h3, color: Colors.text, marginBottom: Spacing.md},
  qIndex: {...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase'},
  qText: {...Typography.bodyBold, color: Colors.text, marginTop: 4},
});
