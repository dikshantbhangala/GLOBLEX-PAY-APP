import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../styles';
import { loginSchema } from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = ({ onSubmit, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isValid || loading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

export default LoginForm;