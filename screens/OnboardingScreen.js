import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primary: '#0A0A0A', // Royal black background
  secondary: '#1A1A1A',
  gold: '#FFD700',
  accentGold: '#FFA500',
  white: '#FFFFFF', // All text will be white
  black: '#000000',
};

const FONTS = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  semibold: 'Roboto-SemiBold',
  bold: 'Roboto-Bold',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Simple screen components that would normally be separate files
const LoginScreen = ({ onClose }) => (
  <Modal transparent={true} animationType="slide">
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login Screen</Text>
      <TouchableOpacity style={loginStyles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={COLORS.white} />
      </TouchableOpacity>
      {/* Your login form would go here */}
    </View>
  </Modal>
);

const SignupScreen = ({ onClose }) => (
  <Modal transparent={true} animationType="slide">
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Signup Screen</Text>
      <TouchableOpacity style={loginStyles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={COLORS.white} />
      </TouchableOpacity>
      {/* Your signup form would go here */}
    </View>
  </Modal>
);

export default function OnboardingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentScreen, setCurrentScreen] = useState(null);

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  const showLogin = () => setCurrentScreen('login');
  const showSignup = () => setCurrentScreen('signup');
  const closeModal = () => setCurrentScreen(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background Gradient */}
      <LinearGradient 
        colors={[COLORS.primary, COLORS.secondary, COLORS.primary]} 
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={showLogin}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="globe-outline" size={60} color={COLORS.gold} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.brand}>GLOBLEX</Text>
            <Text style={styles.tagline}>Premium Cross-Border Payments</Text>
            <Text style={styles.description}>
              Experience seamless international transfers with enterprise-grade security
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <FeatureItem icon="shield-checkmark-outline" text="Bank-Level Security" />
            <FeatureItem icon="flash-outline" text="Instant Transfers" />
            <FeatureItem icon="globe-outline" text="200+ Countries" />
          </View>

          {/* CTA Button - changed to white text */}
          <TouchableOpacity 
            style={styles.buttonWrapper} 
            onPress={showSignup}
            activeOpacity={0.8}
          >
            <LinearGradient 
              colors={[COLORS.gold, COLORS.accentGold]} 
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.black} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.authOptions}>
            <Text style={styles.authOptionsText}>
              Already have an account?{' '}
              <Text style={styles.authLink} onPress={showLogin}>
                Sign In
              </Text>
            </Text>
          </View>

          {/* Bottom Accent */}
          <View style={styles.bottomAccent}>
            <View style={styles.accentLine} />
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Modal Screens */}
      {currentScreen === 'login' && <LoginScreen onClose={closeModal} />}
      {currentScreen === 'signup' && <SignupScreen onClose={closeModal} />}
    </View>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color={COLORS.gold} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

// Main styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1,
  },
  skipText: {
    color: COLORS.white, // Changed to white
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  logoContainer: {
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  welcome: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: COLORS.white, // Changed to white
    marginBottom: SPACING.xs,
  },
  brand: {
    fontSize: 48,
    fontFamily: FONTS.bold,
    color: COLORS.gold,
    marginBottom: SPACING.xs,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.white, // Changed to white
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white, // Changed to white
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    opacity: 0.9,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: SPACING.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white, // Changed to white
  },
  buttonWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.semibold,
    color: COLORS.black, // Keeping button text black for contrast
    marginRight: SPACING.sm,
  },
  authOptions: {
    alignItems: 'center',
  },
  authOptionsText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: FONTS.regular,
  },
  authLink: {
    color: COLORS.gold,
    fontFamily: FONTS.semibold,
    textDecorationLine: 'underline',
  },
  bottomAccent: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
});

// Login/Signup modal styles
const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.bold,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.xl,
    padding: SPACING.sm,
  },
});
