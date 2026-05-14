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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
  const {login, googleSignIn} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Email and password are required.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login failed', extractErrorMessage(err, 'Invalid credentials'));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setGoogleBusy(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      Alert.alert('Google sign-in failed', extractErrorMessage(err, 'Please try again.'));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <ScreenContainer padded={false}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Icon name="cloud" size={36} color={Colors.primary} />
            <Text style={styles.title}>AWS Cert Prep</Text>
            <Text style={styles.subtitle}>Sign in to keep practicing</Text>
          </View>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Button title="Log in" onPress={onLogin} loading={submitting} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable onPress={onGoogle} disabled={googleBusy} style={({pressed}) => [styles.googleBtn, pressed && {opacity: 0.85}, googleBusy && {opacity: 0.6}]}>
            <Icon name="chrome" size={20} color={Colors.google} />
            <Text style={styles.googleText}>{googleBusy ? 'Connecting…' : 'Continue with Google'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}> Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scroll: {padding: Spacing.lg, paddingTop: Spacing.xxl, flexGrow: 1, justifyContent: 'center'},
  brand: {alignItems: 'center', marginBottom: Spacing.xl},
  title: {...Typography.h1, color: Colors.text, marginTop: Spacing.sm},
  subtitle: {...Typography.body, color: Colors.textMuted, marginTop: 4},
  forgot: {alignSelf: 'flex-end', marginBottom: Spacing.md},
  forgotText: {color: Colors.primary, fontWeight: '600'},
  divider: {flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg},
  dividerLine: {flex: 1, height: 1, backgroundColor: Colors.border},
  dividerText: {marginHorizontal: Spacing.md, color: Colors.textMuted, fontSize: 12, textTransform: 'uppercase'},
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 10,
  },
  googleText: {marginLeft: 10, fontWeight: '600', color: Colors.text},
  footer: {flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl},
  footerText: {color: Colors.textMuted},
  footerLink: {color: Colors.primary, fontWeight: '700'},
});
