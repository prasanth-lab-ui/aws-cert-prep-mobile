import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import {AuthProvider, useAuth} from './context/AuthContext';
import {Colors} from './theme/colors';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import VerifyEmailScreen from './screens/auth/VerifyEmailScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

// Main Screens
import DashboardScreen from './screens/main/DashboardScreen';
import PracticeSetupScreen from './screens/main/PracticeSetupScreen';
import QuestionPracticeScreen from './screens/main/QuestionPracticeScreen';
import ResultsScreen from './screens/main/ResultsScreen';
import AnalyticsScreen from './screens/main/AnalyticsScreen';
import CommunityScreen from './screens/main/CommunityScreen';
import PremiumPlansScreen from './screens/main/PremiumPlansScreen';

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  PracticeSetup: undefined;
  QuestionPractice: {sessionId: number; config: any};
  Results: {sessionId: number; score: number; correctCount: number; total: number; questions: any[]; userAnswers: any};
  PremiumPlans: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: {email: string};
  ForgotPassword: undefined;
  ResetPassword: {email: string};
};

export type TabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Community: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Login">
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 64,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
      tabBarIcon: ({color, size}) => {
        const icons: Record<string, string> = {
          Dashboard: 'home',
          Analytics: 'bar-chart-2',
          Community: 'users',
        };
        return <Icon name={icons[route.name] || 'circle'} size={22} color={color} />;
      },
    })}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Community" component={CommunityScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="PracticeSetup" component={PracticeSetupScreen} />
          <Stack.Screen name="QuestionPractice" component={QuestionPracticeScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="PremiumPlans" component={PremiumPlansScreen} />
        </>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const App = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
