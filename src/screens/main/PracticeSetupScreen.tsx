import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../App';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Button} from '../../components/Button';
import {Colors} from '../../theme/colors';
import {Radius, Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {questionsService} from '../../services/questions';
import {sessionsService} from '../../services/sessions';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeSetup'>;

const SIZES = [10, 20, 50];
type Mode = 'practice' | 'test';

const PracticeSetupScreen = ({navigation}: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [tests, setTests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [count, setCount] = useState<number>(10);
  const [mode, setMode] = useState<Mode>('practice');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cats, ts] = await Promise.all([
          questionsService.categories().catch(() => []),
          questionsService.tests().catch(() => []),
        ]);
        setCategories(cats);
        setTests(ts);
      } catch (err) {
        Alert.alert('Could not load options', extractErrorMessage(err));
      }
    })();
  }, []);

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));
  };

  const start = async () => {
    setBusy(true);
    try {
      const config = {
        categories: selectedCategories,
        test: selectedTest,
        questionCount: count,
        mode,
      };
      const session = await sessionsService.create(config);
      navigation.replace('QuestionPractice', {sessionId: session.id, config});
    } catch (err) {
      Alert.alert('Could not start practice', extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Practice setup</Text>
          <View style={{width: 22}} />
        </View>

        <Card style={{marginBottom: Spacing.lg}}>
          <Text style={styles.label}>Mode</Text>
          <View style={styles.row}>
            {(['practice', 'test'] as Mode[]).map(m => (
              <Pressable key={m} onPress={() => setMode(m)} style={[styles.chip, mode === m && styles.chipActive]}>
                <Text style={[styles.chipText, mode === m && styles.chipTextActive]}>{m === 'practice' ? 'Practice' : 'Test'}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={{marginBottom: Spacing.lg}}>
          <Text style={styles.label}>Categories</Text>
          {categories.length === 0 ? (
            <Text style={styles.muted}>Loading categories…</Text>
          ) : (
            <View style={[styles.row, styles.wrap]}>
              {categories.map(c => {
                const active = selectedCategories.includes(c);
                return (
                  <Pressable key={c} onPress={() => toggleCategory(c)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Card>

        {tests.length > 0 ? (
          <Card style={{marginBottom: Spacing.lg}}>
            <Text style={styles.label}>Test (optional)</Text>
            <View style={[styles.row, styles.wrap]}>
              <Pressable onPress={() => setSelectedTest(null)} style={[styles.chip, !selectedTest && styles.chipActive]}>
                <Text style={[styles.chipText, !selectedTest && styles.chipTextActive]}>Any</Text>
              </Pressable>
              {tests.map(t => {
                const active = selectedTest === t;
                return (
                  <Pressable key={t} onPress={() => setSelectedTest(t)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        ) : null}

        <Card style={{marginBottom: Spacing.xl}}>
          <Text style={styles.label}>Question count</Text>
          <View style={styles.row}>
            {SIZES.map(n => (
              <Pressable key={n} onPress={() => setCount(n)} style={[styles.chip, count === n && styles.chipActive]}>
                <Text style={[styles.chipText, count === n && styles.chipTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Button title="Start practice" onPress={start} loading={busy} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default PracticeSetupScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingBottom: Spacing.xxl},
  headerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg},
  title: {...Typography.h2, color: Colors.text},
  label: {...Typography.bodyBold, color: Colors.text, marginBottom: Spacing.sm},
  muted: {color: Colors.textMuted},
  row: {flexDirection: 'row', gap: Spacing.sm},
  wrap: {flexWrap: 'wrap'},
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {color: Colors.text, fontWeight: '600'},
  chipTextActive: {color: '#FFF'},
});
