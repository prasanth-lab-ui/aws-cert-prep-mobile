import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList, TabParamList} from '../../App';
import {ScreenContainer} from '../../components/ScreenContainer';
import {StatCard} from '../../components/StatCard';
import {SessionCard} from '../../components/SessionCard';
import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {useAuth} from '../../context/AuthContext';
import {sessionsService, SessionRecord} from '../../services/sessions';
import {analyticsService, PerformanceStats} from '../../services/analytics';
import {extractErrorMessage} from '../../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const DashboardScreen = (_: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user, logout} = useAuth();
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [perf, mine] = await Promise.all([
        analyticsService.performance().catch(() => null),
        sessionsService.mine().catch(() => []),
      ]);
      setStats(perf);
      setSessions(mine);
    } catch (err) {
      Alert.alert('Could not load dashboard', extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const header = (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hi {user?.name?.split(' ')[0] || 'there'} 👋</Text>
          <Text style={styles.subtitle}>Ready for some practice?</Text>
        </View>
        <Pressable onPress={logout} hitSlop={10}>
          <Icon name="log-out" size={22} color={Colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard icon="activity" label="Sessions" value={stats?.total_sessions ?? 0} tint={Colors.info} />
        <StatCard icon="target" label="Accuracy" value={`${Math.round(stats?.accuracy ?? 0)}%`} tint={Colors.success} />
        <StatCard icon="award" label="Best" value={`${stats?.best_score ?? 0}%`} tint={Colors.primary} />
      </View>

      <Card style={{marginBottom: Spacing.lg}}>
        <Text style={styles.cardTitle}>Start practicing</Text>
        <Text style={styles.cardBody}>Pick categories, choose practice or test mode, go.</Text>
        <View style={{height: Spacing.md}} />
        <Button title="Start Practice" onPress={() => navigation.navigate('PracticeSetup')} />
      </Card>

      <Text style={styles.sectionTitle}>Recent sessions</Text>
    </View>
  );

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={sessions.slice(0, 10)}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <SessionCard
            session={item}
            onPress={() => {
              // Could navigate to a session detail screen later.
            }}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          !loading ? (
            <Card>
              <Text style={styles.emptyTitle}>No sessions yet</Text>
              <Text style={styles.emptyBody}>Run your first practice to see it here.</Text>
            </Card>
          ) : null
        }
      />
    </ScreenContainer>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  list: {padding: Spacing.lg, paddingBottom: Spacing.xxl},
  headerRow: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.lg},
  greeting: {...Typography.h2, color: Colors.text},
  subtitle: {...Typography.body, color: Colors.textMuted, marginTop: 2},
  statsRow: {flexDirection: 'row', marginBottom: Spacing.lg, marginHorizontal: -Spacing.xs / 2},
  cardTitle: {...Typography.h3, color: Colors.text},
  cardBody: {...Typography.body, color: Colors.textMuted, marginTop: 4},
  sectionTitle: {...Typography.h3, color: Colors.text, marginBottom: Spacing.sm},
  emptyTitle: {...Typography.bodyBold, color: Colors.text},
  emptyBody: {...Typography.body, color: Colors.textMuted, marginTop: 4},
});
