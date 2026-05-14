import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {leaderboardService, LeaderboardEntry} from '../../services/leaderboard';

type Scope = 'global' | 'weekly';

const CommunityScreen = () => {
  const [scope, setScope] = useState<Scope>('global');
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (s: Scope) => {
    try {
      const list = s === 'global' ? await leaderboardService.global() : await leaderboardService.weekly();
      setRows(list);
    } catch {
      setRows([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(scope);
  }, [scope, load]);

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <View style={styles.tabs}>
          {(['global', 'weekly'] as Scope[]).map(s => (
            <Pressable key={s} onPress={() => setScope(s)} style={[styles.tab, scope === s && styles.tabActive]}>
              <Text style={[styles.tabText, scope === s && styles.tabTextActive]}>{s === 'global' ? 'All time' : 'This week'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item, i) => `${item.user_id}-${i}`}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(scope); }} tintColor={Colors.primary} />}
        renderItem={({item}) => (
          <Card style={styles.row}>
            <View style={styles.rankBubble}>
              <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.sessions_count} sessions</Text>
            </View>
            <Text style={styles.score}>{item.total_score}</Text>
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text style={styles.empty}>No leaderboard data yet.</Text>
          </Card>
        }
      />
    </ScreenContainer>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  header: {padding: Spacing.lg, paddingBottom: 0},
  title: {...Typography.h1, color: Colors.text, marginBottom: Spacing.md},
  tabs: {flexDirection: 'row', backgroundColor: Colors.surfaceMuted, borderRadius: 999, padding: 4},
  tab: {flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 999},
  tabActive: {backgroundColor: Colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1},
  tabText: {fontWeight: '600', color: Colors.textMuted},
  tabTextActive: {color: Colors.text},
  list: {padding: Spacing.lg, paddingTop: Spacing.md},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm},
  rankBubble: {width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md},
  rankText: {fontWeight: '700', color: Colors.primary},
  name: {...Typography.bodyBold, color: Colors.text},
  meta: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  score: {...Typography.h3, color: Colors.text},
  empty: {color: Colors.textMuted, textAlign: 'center'},
});
