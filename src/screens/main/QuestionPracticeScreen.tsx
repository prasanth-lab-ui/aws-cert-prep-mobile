import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../App';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Button} from '../../components/Button';
import {OptionButton} from '../../components/OptionButton';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {questionsService, Question} from '../../services/questions';
import {sessionsService} from '../../services/sessions';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionPractice'>;

const toOptionEntries = (options: Question['options']): Array<{key: string; text: string}> => {
  if (Array.isArray(options)) {
    return options.map((text, i) => ({key: String.fromCharCode(65 + i), text}));
  }
  return Object.entries(options || {}).map(([key, text]) => ({key, text: String(text)}));
};

const QuestionPracticeScreen = ({navigation, route}: Props) => {
  const {sessionId, config} = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const pagerRef = useRef<PagerView | null>(null);

  const isPracticeMode = config?.mode !== 'test';

  useEffect(() => {
    (async () => {
      try {
        const list = await questionsService.list({
          category: config?.categories?.[0],
          test: config?.test || undefined,
          limit: config?.questionCount || 10,
        });
        setQuestions(list);
      } catch (err) {
        Alert.alert('Could not load questions', extractErrorMessage(err));
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [config, navigation]);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  const onSelect = (q: Question, key: string) => {
    if (answers[q.id] && isPracticeMode) return; // lock once answered in practice mode
    setAnswers(prev => ({...prev, [q.id]: key}));
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      const correctCount = questions.reduce((acc, q) => (answers[q.id] === q.correct_answer ? acc + 1 : acc), 0);
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      await sessionsService.update(sessionId, {
        score,
        correctCount,
        totalQuestions: total,
        answers,
      });
      navigation.replace('Results', {
        sessionId,
        score,
        correctCount,
        total,
        questions,
        userAnswers: answers,
      });
    } catch (err) {
      Alert.alert('Could not save session', extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const progressLabel = useMemo(() => `${page + 1} / ${total}`, [page, total]);

  if (loading) {
    return (
      <ScreenContainer>
        <Text style={styles.muted}>Loading questions…</Text>
      </ScreenContainer>
    );
  }

  if (total === 0) {
    return (
      <ScreenContainer>
        <Text style={styles.muted}>No questions matched your selection.</Text>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.progress}>{progressLabel}</Text>
        <Text style={styles.progress}>{answeredCount}/{total} answered</Text>
      </View>

      <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={e => setPage(e.nativeEvent.position)}>
        {questions.map((q, idx) => {
          const entries = toOptionEntries(q.options);
          const selected = answers[q.id];
          const isAnswered = !!selected;
          return (
            <View key={q.id} style={styles.page}>
              <Card>
                <Text style={styles.qIndex}>Question {idx + 1}</Text>
                <Text style={styles.qText}>{q.question_text}</Text>
              </Card>
              <View style={{height: Spacing.md}} />
              {entries.map(({key, text}) => {
                let state: 'idle' | 'selected' | 'correct' | 'incorrect' = 'idle';
                if (isPracticeMode && isAnswered) {
                  if (key === q.correct_answer) state = 'correct';
                  else if (key === selected) state = 'incorrect';
                } else if (selected === key) {
                  state = 'selected';
                }
                return (
                  <OptionButton
                    key={key}
                    letter={key}
                    text={text}
                    state={state}
                    onPress={() => onSelect(q, key)}
                    disabled={isPracticeMode && isAnswered && state === 'idle'}
                  />
                );
              })}
            </View>
          );
        })}
      </PagerView>

      <View style={styles.footer}>
        <Button
          title={page === total - 1 ? 'Finish' : 'Next'}
          onPress={() => {
            if (page === total - 1) {
              finish();
            } else {
              pagerRef.current?.setPage(page + 1);
            }
          }}
          loading={submitting}
        />
      </View>
    </ScreenContainer>
  );
};

export default QuestionPracticeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  progress: {color: Colors.textMuted, fontWeight: '600'},
  page: {padding: Spacing.lg},
  qIndex: {...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase'},
  qText: {...Typography.h3, color: Colors.text, marginTop: 6, lineHeight: 24},
  footer: {padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface},
  muted: {color: Colors.textMuted, textAlign: 'center', marginVertical: Spacing.lg},
});
