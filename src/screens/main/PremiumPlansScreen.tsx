import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../App';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Card} from '../../components/Card';
import {Button} from '../../components/Button';
import {TextField} from '../../components/TextField';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {api, extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PremiumPlans'>;

const PLANS = [
  {id: 'monthly', name: 'Monthly', price: '$4.99', tag: 'Most flexible'},
  {id: 'annual', name: 'Annual', price: '$39.99', tag: 'Save 33%'},
  {id: 'lifetime', name: 'Lifetime', price: '$99', tag: 'One-time'},
];

const PremiumPlansScreen = ({navigation}: Props) => {
  const [coupon, setCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      Alert.alert('Enter a coupon code');
      return;
    }
    setApplying(true);
    try {
      const {data} = await api.post('/subscription/apply-coupon', {code: coupon.trim()});
      Alert.alert('Coupon applied', (data as any)?.message || 'Premium activated!');
    } catch (err) {
      Alert.alert('Could not apply coupon', extractErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Go Premium</Text>
          <View style={{width: 22}} />
        </View>

        <Text style={styles.lead}>Unlock unlimited tests, advanced analytics and offline mode.</Text>

        {PLANS.map(p => (
          <Card key={p.id} style={styles.plan}>
            <View style={{flex: 1}}>
              <Text style={styles.planName}>{p.name}</Text>
              <Text style={styles.planTag}>{p.tag}</Text>
            </View>
            <Text style={styles.planPrice}>{p.price}</Text>
          </Card>
        ))}

        <Card style={{marginTop: Spacing.lg}}>
          <Text style={styles.couponLabel}>Have a coupon?</Text>
          <TextField placeholder="Enter coupon code" value={coupon} onChangeText={setCoupon} autoCapitalize="characters" />
          <Button title="Apply coupon" onPress={applyCoupon} loading={applying} variant="secondary" />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

export default PremiumPlansScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingBottom: Spacing.xxl},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg},
  title: {...Typography.h2, color: Colors.text},
  lead: {...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg},
  plan: {flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm},
  planName: {...Typography.h3, color: Colors.text},
  planTag: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  planPrice: {...Typography.h2, color: Colors.primary},
  couponLabel: {...Typography.bodyBold, color: Colors.text, marginBottom: Spacing.sm},
});
