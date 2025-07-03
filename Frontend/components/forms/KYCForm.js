import { yupResolver } from '@hookform/resolvers/yup';
import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../../styles';
import { kycSchema } from '../../utils/validation';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

const KYCForm = ({ onSubmit, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(kycSchema),
    mode: 'onChange',
  });

  const documentTypes = [
    { label: 'Select Document Type', value: '' },
    { label: 'Passport', value: 'passport' },
    { label: 'Driver License', value: 'driver_license' },
    { label: 'National ID', value: 'national_id' },
    { label: 'Voter ID', value: 'voter_id' },
  ];

  const countries = [
    { label: 'Select Country', value: '' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Canada', value: 'CA' },
    { label: 'India', value: 'IN' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.title}>Complete Your KYC</Text>
        <Text style={styles.subtitle}>
          We need to verify your identity to comply with regulations and keep your account secure.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>
          
          <Controller
            control={control}
            name="documentType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Document Type</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    {documentTypes.map((type) => (
                      <Picker.Item 
                        key={type.value} 
                        label={type.label} 
                        value={type.value} 
                      />
                    ))}
                  </Picker>
                </View>
                {errors.documentType && (
                  <Text style={styles.errorText}>{errors.documentType.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="documentNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Document Number"
                placeholder="Enter document number"
                value={value}
                onChangeText={onChange}
                error={errors.documentNumber?.message}
                autoCapitalize="characters"
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                error={errors.dateOfBirth?.message}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Street Address"
                placeholder="Enter your full address"
                value={value}
                onChangeText={onChange}
                error={errors.address?.message}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <Input
                label="City"
                placeholder="Enter your city"
                value={value}
                onChangeText={onChange}
                error={errors.city?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    {countries.map((country) => (
                      <Picker.Item 
                        key={country.value} 
                        label={country.label} 
                        value={country.value} 
                      />
                    ))}
                  </Picker>
                </View>
                {errors.country && (
                  <Text style={styles.errorText}>{errors.country.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="postalCode"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Postal Code"
                placeholder="Enter postal code"
                value={value}
                onChangeText={onChange}
                error={errors.postalCode?.message}
                autoCapitalize="characters"
              />
            )}
          />
        </View>

        <Button
          title="Submit KYC Application"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid || loading}
          style={styles.submitButton}
        />

        <Text style={styles.disclaimer}>
          By submitting this form, you agree to our Terms of Service and Privacy Policy. 
          Your information will be securely processed and stored.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  picker: {
    height: 48,
    color: colors.text,
  },
  errorText: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.regular,
    color: colors.error,
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  disclaimer: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default KYCForm;
