import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {AuthStackParamList} from '../../App';
import {useAuth} from '../../context/AuthContext';
import {Button} from '../../components/Button';
import {TextField} from '../../components/TextField';
import {OTPInput} from '../../components/OTPInput';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = ({navigation, route}: Props) => {
  const {resetPassword} = useAuth();
  const email = route.params?.email ?? '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid code', 'Enter the 6-digit code from your email.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'New password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(email, otp, password);
      Alert.alert('Success', 'Password reset. Please log in with your new password.');
      navigation.popToTop();
    } catch (err: any) {
      Alert.alert('Reset failed', extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter the code we sent to {email || 'your email'} and choose a new password.</Text>

          <OTPInput value={otp} onChange={setOtp} />
          <TextField label="New password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
          <TextField label="Confirm new password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" />

          <Button title="Reset password" onPress={onSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingTop: Spacing.xl},
  back: {marginBottom: Spacing.md},
  title: {...Typography.h1, color: Colors.text},
  subtitle: {...Typography.body, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.lg},
});
