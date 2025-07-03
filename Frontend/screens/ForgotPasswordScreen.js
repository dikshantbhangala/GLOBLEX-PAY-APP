import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { apiService } from '../services/api';

import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';
import { spacing } from '../styles/spacing';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await apiService.forgotPassword({
        email: email.toLowerCase().trim(),
      });

      if (response.success) {
        setEmailSent(true);
        Alert.alert(
          'Email Sent',
          'Password reset instructions have been sent to your email address.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Please try again');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await apiService.forgotPassword({
        email: email.toLowerCase().trim(),
      });

      if (response.success) {
        Alert.alert('Email Sent', 'Password reset instructions have been resent.');
      } else {
        Alert.alert('Error', response.message || 'Please try again');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={colors.primary} />
            </View>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? 'We\'ve sent password reset instructions to your email address.'
                : 'Don\'t worry! Enter your email address and we\'ll send you instructions to reset your password.'}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              editable={!emailSent}
            />

            {!emailSent ? (
              <Button
                title="Send Reset Instructions"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.resetButton}
              />
            ) : (
              <View style={styles.emailSentActions}>
                <Button
                  title="Resend Email"
                  onPress={handleResendEmail}
                  loading={loading}
                  variant="outline"
                  style={styles.resendButton}
                />
                <Button
                  title="Back to Login"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.backToLoginButton}
                />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.helpSection}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.helpText}>
                If you don't receive an email within a few minutes, check your spam folder or contact support.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => {
                Alert.alert(
                  'Contact Support',
                  'Need help? Contact our support team at support@globlex.com'
                );
              }}
            >
              <Text style={styles.supportText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    fontFamily: fonts.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    marginTop: spacing.lg,
  },
  emailSentActions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  resendButton: {
    marginBottom: spacing.xs,
  },
  backToLoginButton: {
    marginTop: spacing.xs,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
    marginLeft: spacing.xs,
  },
  supportButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  supportText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
});

export default ForgotPasswordScreen;