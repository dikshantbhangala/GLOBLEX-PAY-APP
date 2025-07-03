import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';

// Context Providers
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { WalletProvider } from './src/context/WalletContext';

// Import screens
import CurrencyConversionScreen from './Frontend/screens/CurrencyConversionScreen';
import DashboardScreen from './Frontend/screens/DashboardScreen';
import ForgotPasswordScreen from './Frontend/screens/ForgotPasswordScreen';
import HelpChatScreen from './Frontend/screens/helperscren';
import KYCScreen from './Frontend/screens/KYCScreen';
import LoginScreen from './Frontend/screens/LoginScreen';
import NotificationsScreen from './Frontend/screens/NotificationScreen';
import OnboardingScreen from './Frontend/screens/OnboardingScreen';
import ProfileScreen from './Frontend/screens/ProfileScreen';
import SignUpScreen from './Frontend/screens/SignUpScreen';
import TransactionHistoryScreen from './Frontend/screens/Transaction';
import WalletScreen from './Frontend/screens/WalletScreen';

// Loading component
import LoadingSpinner from './Frontend/components/common/LoadingSpinner';

const Stack = createStackNavigator();

// Navigation component that handles auth state
function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        // First time launching the app
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  if (isLoading || isFirstLaunch === null) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isFirstLaunch ? "OnboardingScreen" : "LoginScreen"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
          borderBottomColor: '#FFD700',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FFD700',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        cardStyle: { backgroundColor: '#000' },
      }}
    >
      {!user ? (
        // Auth Stack - User not logged in
        <>
          <Stack.Screen 
            name="OnboardingScreen" 
            component={OnboardingScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{ 
              title: 'Sign In',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="SignUpScreen" 
            component={SignUpScreen} 
            options={{ 
              title: 'Create Account',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="ForgotPasswordScreen" 
            component={ForgotPasswordScreen} 
            options={{ 
              title: 'Reset Password',
              headerBackTitleVisible: false,
            }}
          />
        </>
      ) : (
        // Main App Stack - User logged in
        <>
          <Stack.Screen 
            name="DashboardScreen" 
            component={DashboardScreen} 
            options={{ 
              title: 'GLOBLEX',
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="ProfileScreen" 
            component={ProfileScreen} 
            options={{ 
              title: 'Profile',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="WalletScreen" 
            component={WalletScreen} 
            options={{ 
              title: 'Wallet',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="TransactionHistoryScreen" 
            component={TransactionHistoryScreen} 
            options={{ 
              title: 'Transaction History',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="CurrencyConversionScreen" 
            component={CurrencyConversionScreen} 
            options={{ 
              title: 'Currency Exchange',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="KYCScreen" 
            component={KYCScreen} 
            options={{ 
              title: 'KYC Verification',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="HelpChatScreen" 
            component={HelpChatScreen} 
            options={{ 
              title: 'AI Assistant',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen 
            name="NotificationsScreen" 
            component={NotificationsScreen} 
            options={{ 
              title: 'Notifications',
              headerBackTitleVisible: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <NotificationProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#000" />
            <AppNavigator />
          </NavigationContainer>
        </NotificationProvider>
      </WalletProvider>
    </AuthProvider>
  );
}