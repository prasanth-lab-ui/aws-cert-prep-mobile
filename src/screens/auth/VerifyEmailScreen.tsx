import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {AuthStackParamList} from '../../App';
import {useAuth} from '../../context/AuthContext';
import {Button} from '../../components/Button';
import {OTPInput} from '../../components/OTPInput';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen = ({navigation, route}: Props) => {
  const {verifyEmail, resendOtp} = useAuth();
  const email = route.params?.email ?? '';
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid code', 'Enter the 6-digit code from your email.');
      return;
    }
    setSubmitting(true);
    try {
      await verifyEmail(email, code);
      // On success the root navigator swaps to MainTabs because user becomes non-null.
    } catch (err: any) {
      Alert.alert('Verification failed', extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await resendOtp(email);
      Alert.alert('Code sent', 'Check your inbox for the new verification code.');
    } catch (err: any) {
      Alert.alert('Could not resend', extractErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Icon name="mail" size={32} color={Colors.primary} />
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to {email || 'your inbox'}.</Text>

          <View style={{height: Spacing.xl}} />
          <OTPInput value={code} onChange={setCode} />

          <Button title="Verify" onPress={onSubmit} loading={submitting} />

          <Pressable onPress={onResend} style={styles.resend} disabled={resending}>
            <Text style={styles.resendText}>{resending ? 'Sending…' : 'Resend code'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingTop: Spacing.xl},
  back: {marginBottom: Spacing.md},
  title: {...Typography.h1, color: Colors.text, marginTop: Spacing.sm},
  subtitle: {...Typography.body, color: Colors.textMuted, marginTop: 4},
  resend: {marginTop: Spacing.lg, alignItems: 'center'},
  resendText: {color: Colors.primary, fontWeight: '700'},
});
