import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {AuthStackParamList} from '../../App';
import {useAuth} from '../../context/AuthContext';
import {Button} from '../../components/Button';
import {TextField} from '../../components/TextField';
import {ScreenContainer} from '../../components/ScreenContainer';
import {Colors} from '../../theme/colors';
import {Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({navigation}: Props) => {
  const {forgotPassword} = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email) {
      Alert.alert('Email required');
      return;
    }
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      Alert.alert('Check your email', 'If an account exists, a reset code has been sent.');
      navigation.navigate('ResetPassword', {email: email.trim()});
    } catch (err: any) {
      Alert.alert('Request failed', extractErrorMessage(err));
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
          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send a 6-digit reset code.</Text>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <Button title="Send reset code" onPress={onSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingTop: Spacing.xl},
  back: {marginBottom: Spacing.md},
  title: {...Typography.h1, color: Colors.text},
  subtitle: {...Typography.body, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.lg},
});
