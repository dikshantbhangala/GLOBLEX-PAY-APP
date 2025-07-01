import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import KYCScreen from '../screens/KYCScreen';
import LoginScreen from '../screens/LoginScreen';
import NotificationsScreen from '../screens/NotificationScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';

import { colors } from '../styles/colors';

const Stack = createStackNavigator();

// Authentication Stack
export const AuthStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main App Stack
export const AppStackNavigator = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
      },
      headerBackTitleVisible: false,
      headerLeft: ({ canGoBack }) => {
        if (canGoBack) {
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                backgroundColor: colors.surfaceLight,
              }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
          );
        }
        return null;
      },
      cardStyle: { backgroundColor: colors.background },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    })}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{
        title: 'Notifications',
        headerRight: ({ navigation }) => (
          <TouchableOpacity
            onPress={() => {
              // Mark all as read functionality
              console.log('Mark all as read');
            }}
            style={{
              marginRight: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              backgroundColor: colors.primary,
            }}
          >
            <Ionicons name="checkmark-done" size={16} color={colors.white} />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen 
      name="KYC" 
      component={KYCScreen}
      options={{
        title: 'Verify Identity',
        headerLeft: ({ navigation, canGoBack }) => {
          if (canGoBack) {
            return (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginLeft: 16,
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  backgroundColor: colors.surfaceLight,
                }}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            );
          }
          return null;
        },
      }}
    />
  </Stack.Navigator>
);

// Root Navigator that handles auth state
export const RootStackNavigator = ({ isAuthenticated }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {isAuthenticated ? (
      <Stack.Screen name="App" component={AppStackNavigator} />
    ) : (
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
    )}
  </Stack.Navigator>
);