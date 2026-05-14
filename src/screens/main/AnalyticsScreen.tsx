import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {analyticsService, PerformanceStats} from '../../services/analytics';

const CHART_W = Dimensions.get('window').width - Spacing.lg * 4;

const chartConfig = {
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
  color: (opacity = 1) => `rgba(255, 153, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: {r: '4'},
};

const AnalyticsScreen = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const s = await analyticsService.performance();
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const trend = stats?.recent_trend ?? [];
  const categoryPerf = stats?.category_performance ?? [];

  return (
    <ScreenContainer padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}>
        <Text style={styles.title}>Analytics</Text>

        <Card style={{marginBottom: Spacing.lg}}>
          <Text style={styles.cardTitle}>Recent performance</Text>
          {trend.length > 0 ? (
            <LineChart
              data={{
                labels: trend.map((p, i) => (i % 2 === 0 ? p.date.slice(5) : '')),
                datasets: [{data: trend.map(p => p.score)}],
              }}
              width={CHART_W}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{borderRadius: 12}}
            />
          ) : (
            <Text style={styles.muted}>Not enough sessions yet.</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>By category</Text>
          {categoryPerf.length > 0 ? (
            <View style={{alignItems: 'center'}}>
              <ProgressChart
                data={{
                  labels: categoryPerf.slice(0, 5).map(c => c.category.slice(0, 8)),
                  data: categoryPerf.slice(0, 5).map(c => Math.min(1, (c.accuracy || 0) / 100)),
                }}
                width={CHART_W}
                height={200}
                strokeWidth={10}
                radius={28}
                chartConfig={chartConfig}
                hideLegend={false}
              />
            </View>
          ) : (
            <Text style={styles.muted}>Run a few sessions to see category-wise performance.</Text>
          )}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingBottom: Spacing.xxl},
  title: {...Typography.h1, color: Colors.text, marginBottom: Spacing.lg},
  cardTitle: {...Typography.h3, color: Colors.text, marginBottom: Spacing.sm},
  muted: {color: Colors.textMuted, padding: Spacing.md, textAlign: 'center'},
});
