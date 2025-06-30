import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../Frontend/context/AuthContext';
import { NotificationProvider } from '../Frontend/context/NotificationContext';
import { WalletProvider } from '../Frontend/context/WalletContext';
import MainTabNavigator from '../Frontend/navigation/MainTabNavigator';
import ForgotPasswordScreen from '../Frontend/screens/ForgotPasswordScreen';
import LoginScreen from '../Frontend/screens/LoginScreen';
import OnboardingScreen from '../Frontend/screens/OnboardingScreen';
import SignUpScreen from '../Frontend/screens/SignUpScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.log('Error checking first launch:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return null; // Loading screen can be added here
  }

  if (showOnboarding) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding">
            {props => (
              <OnboardingScreen 
                {...props} 
                onComplete={handleOnboardingComplete} 
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
      'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
      'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <WalletProvider>
        <NotificationProvider>
          <StatusBar style="light" backgroundColor="#000000" />
          <AppNavigator />
        </NotificationProvider>
      </WalletProvider>
    </AuthProvider>
  );
}