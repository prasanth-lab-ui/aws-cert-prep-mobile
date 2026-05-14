import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
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
import {configureGoogleSignIn} from '../../services/google';
import {extractErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  const {register, googleSignIn} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing info', 'Name, email and password are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const {email: registeredEmail} = await register(name.trim(), email.trim(), password);
      navigation.navigate('VerifyEmail', {email: registeredEmail});
    } catch (err: any) {
      Alert.alert('Registration failed', extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setGoogleBusy(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      Alert.alert('Google sign-in failed', extractErrorMessage(err));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </Pressable>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>One tap with Google, or sign up with email.</Text>

          <Pressable onPress={onGoogle} disabled={googleBusy} style={({pressed}) => [styles.googleBtn, pressed && {opacity: 0.85}, googleBusy && {opacity: 0.6}]}>
            <Icon name="chrome" size={20} color={Colors.google} />
            <Text style={styles.googleText}>{googleBusy ? 'Connecting…' : 'Register with Gmail'}</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.dividerLine} />
          </View>

          <TextField label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" autoCapitalize="words" />
          <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
          <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
          <TextField label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" />

          <Button title="Create account" onPress={onSubmit} loading={submitting} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}> Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingTop: Spacing.xl, flexGrow: 1},
  back: {marginBottom: Spacing.md},
  title: {...Typography.h1, color: Colors.text},
  subtitle: {...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg},
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  googleText: {marginLeft: 10, fontWeight: '600', color: Colors.text},
  divider: {flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md},
  dividerLine: {flex: 1, height: 1, backgroundColor: Colors.border},
  dividerText: {marginHorizontal: Spacing.sm, color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase'},
  footer: {flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg},
  footerText: {color: Colors.textMuted},
  footerLink: {color: Colors.primary, fontWeight: '700'},
});
