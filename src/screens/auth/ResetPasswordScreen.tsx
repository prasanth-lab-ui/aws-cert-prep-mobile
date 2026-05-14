import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';
import {Colors} from '../../theme/colors';
import {AuthStackParamList} from '../../App';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const {resetPassword} = useAuth();
  const route = useRoute<Route>();
  const {email} = route.params;

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !newPassword) {Alert.alert('Error', 'Fill in all fields'); return;}
    if (newPassword.length < 6) {Alert.alert('Error', 'Password must be 6+ characters'); return;}
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      Alert.alert('Success', 'Password reset! Please sign in.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Reset failed');
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
        <Text style={styles.heading}>Reset password</Text>
        <Text style={styles.sub}>Enter the OTP sent to <Text style={{color: Colors.primary}}>{email}</Text></Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OTP Code</Text>
          <View style={styles.inputWrap}>
            <Icon name="hash" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="6-digit code"
              placeholderTextColor={Colors.textMuted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrap}>
            <Icon name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Min 6 characters"
              placeholderTextColor={Colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPass}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPass(p => !p)}>
              <Icon name={showPass ? 'eye-off' : 'eye'} size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleReset}
          disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Reset Password</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1, padding: 24},
  backBtn: {marginBottom: 24, alignSelf: 'flex-start', padding: 4},
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
    backgroundColor: Colors.primary, borderRadius: 14, height: 52,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnDisabled: {opacity: 0.7},
  btnText: {color: Colors.white, fontSize: 16, fontWeight: '700'},
});
