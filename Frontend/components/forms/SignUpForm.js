import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../styles';
import { signUpSchema } from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';

const SignUpForm = ({ onSubmit, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="First Name"
              placeholder="First name"
              value={value}
              onChangeText={onChange}
              error={errors.firstName?.message}
              style={styles.nameInput}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Last Name"
              placeholder="Last name"
              value={value}
              onChangeText={onChange}
              error={errors.lastName?.message}
              style={styles.nameInput}
            />
          )}
        />
      </View>

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
            placeholder="Create a password"
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Button
        title="Create Account"
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

export default SignUpForm;