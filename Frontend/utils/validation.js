import * as yup from 'yup';

export const loginSchema  = yup.Object().shape({
    email : yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
    password : yup
    .string()
    .min(6 , 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signUpSchema = yup.Object().shape({
    firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('first name is required'),
    lastName : yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
    email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export const kycSchema = yup.object().shape({
  documentType: yup
    .string()
    .required('Document type is required'),
  documentNumber: yup
    .string()
    .min(5, 'Document number must be at least 5 characters')
    .required('Document number is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  address: yup
    .string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  city: yup
    .string()
    .min(2, 'City must be at least 2 characters')
    .required('City is required'),
  country: yup
    .string()
    .required('Country is required'),
  postalCode: yup
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .required('Postal code is required'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});