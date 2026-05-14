import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';
import {Colors} from '../../theme/colors';
import {AuthStackParamList} from '../../App';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const {forgotPassword} = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {Alert.alert('Error', 'Enter your email'); return;}
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      Alert.alert('Sent!', 'Check your email for the reset OTP', [
        {text: 'OK', onPress: () => navigation.navigate('ResetPassword', {email: email.trim().toLowerCase()})},
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.iconWrap}>
          <Icon name="key" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.heading}>Forgot password?</Text>
        <Text style={styles.sub}>Enter your email and we'll send a reset code</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Icon name="mail" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSend}
          disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Send Reset Code</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1, padding: 24},
  backBtn: {marginBottom: 32, alignSelf: 'flex-start', padding: 4},
  iconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heading: {fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8},
  sub: {fontSize: 14, color: Colors.textSecondary, marginBottom: 28, lineHeight: 20},
  inputGroup: {marginBottom: 16},
  label: {fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6},
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, height: 50,
  },
  inputIcon: {marginRight: 10},
  input: {flex: 1, fontSize: 15, color: Colors.textPrimary},
  btn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 52, justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnDisabled: {opacity: 0.7},
  btnText: {color: Colors.white, fontSize: 16, fontWeight: '700'},
});
