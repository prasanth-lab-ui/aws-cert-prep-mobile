import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';
import {Colors} from '../../theme/colors';
import {AuthStackParamList} from '../../App';

type Route = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const {verifyEmail, resendOtp} = useAuth();
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const {email} = route.params;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (val: string, idx: number) => {
    const newCode = [...code];
    newCode[idx] = val.replace(/[^0-9]/g, '');
    setCode(newCode);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      // Navigation auto-handled by RootNavigator
    } catch (err: any) {
      Alert.alert('Verification Failed', err?.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(email);
      Alert.alert('Sent!', 'A new OTP has been sent to your email');
    } catch {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.iconWrap}>
          <Icon name="mail" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.heading}>Verify your email</Text>
        <Text style={styles.sub}>We sent a 6-digit code to{`\n`}<Text style={styles.email}>{email}</Text></Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => (inputs.current[i] = el)}
              style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Verify Email</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
          <Text style={styles.resendText}>
            {resending ? 'Sending...' : "Didn't receive it? Resend code"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1, padding: 24, alignItems: 'center'},
  backBtn: {alignSelf: 'flex-start', marginBottom: 32, padding: 4},
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8},
  sub: {fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 20},
  email: {color: Colors.primary, fontWeight: '700'},
  codeRow: {flexDirection: 'row', gap: 10, marginBottom: 32},
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  codeInputFilled: {borderColor: Colors.primary, backgroundColor: Colors.primaryLight},
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnDisabled: {opacity: 0.7},
  btnText: {color: Colors.white, fontSize: 16, fontWeight: '700'},
  resendBtn: {marginTop: 16},
  resendText: {color: Colors.primary, fontSize: 14, fontWeight: '600'},
});
