const { VALIDATION_RULES, CURRENCY_CODES, KYC_DOCUMENT_TYPES } = require('./constants');

/**
 * Validate address
 * @param {string} address - Address to validate
 * @returns {Object} Validation result
 */
const validateAddress = (address) => {
  const result = { isValid: false, message: '' };
  
  if (!address) {
    result.message = 'Address is required';
    return result;
  }
  
  if (typeof address !== 'string') {
    result.message = 'Address must be a string';
    return result;
  }
  
  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length < 10) {
    result.message = 'Address must be at least 10 characters long';
    return result;
  }
  
  if (trimmedAddress.length > 200) {
    result.message = 'Address must be less than 200 characters long';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate country code (ISO 3166-1 alpha-2)
 * @param {string} countryCode - Country code to validate
 * @returns {Object} Validation result
 */
const validateCountryCode = (countryCode) => {
  const result = { isValid: false, message: '' };
  
  if (!countryCode) {
    result.message = 'Country code is required';
    return result;
  }
  
  if (typeof countryCode !== 'string') {
    result.message = 'Country code must be a string';
    return result;
  }
  
  // ISO 3166-1 alpha-2 country codes
  const validCountryCodes = [
    'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT',
    'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI',
    'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY',
    'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
    'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM',
    'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK',
    'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL',
    'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR',
    'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN',
    'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS',
    'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
    'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW',
    'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP',
    'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM',
    'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM',
    'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF',
    'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW',
    'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
    'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'
  ];
  
  const upperCountryCode = countryCode.toUpperCase();
  
  if (!validCountryCodes.includes(upperCountryCode)) {
    result.message = `Invalid country code: ${countryCode}`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate OTP (One Time Password)
 * @param {string|number} otp - OTP to validate
 * @returns {Object} Validation result
 */
const validateOTP = (otp) => {
  const result = { isValid: false, message: '' };
  
  if (!otp) {
    result.message = 'OTP is required';
    return result;
  }
  
  const otpString = otp.toString();
  
  if (otpString.length !== VALIDATION_RULES.OTP_LENGTH) {
    result.message = `OTP must be ${VALIDATION_RULES.OTP_LENGTH} digits long`;
    return result;
  }
  
  if (!/^\d+$/.test(otpString)) {
    result.message = 'OTP must contain only numbers';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate transaction description
 * @param {string} description - Description to validate
 * @returns {Object} Validation result
 */
const validateTransactionDescription = (description) => {
  const result = { isValid: false, message: '' };
  
  if (!description) {
    result.message = 'Transaction description is required';
    return result;
  }
  
  if (typeof description !== 'string') {
    result.message = 'Transaction description must be a string';
    return result;
  }
  
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < 3) {
    result.message = 'Transaction description must be at least 3 characters long';
    return result;
  }
  
  if (trimmedDescription.length > VALIDATION_RULES.TRANSACTION_DESCRIPTION_MAX_LENGTH) {
    result.message = `Transaction description must be less than ${VALIDATION_RULES.TRANSACTION_DESCRIPTION_MAX_LENGTH} characters long`;
    return result;
  }
  
  // Basic content validation - no special characters that could be harmful
  const allowedPattern = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
  
  if (!allowedPattern.test(trimmedDescription)) {
    result.message = 'Transaction description contains invalid characters';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {Object} Validation result
 */
const validateUUID = (uuid) => {
  const result = { isValid: false, message: '' };
  
  if (!uuid) {
    result.message = 'UUID is required';
    return result;
  }
  
  if (typeof uuid !== 'string') {
    result.message = 'UUID must be a string';
    return result;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    result.message = 'Invalid UUID format';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ObjectId to validate
 * @returns {Object} Validation result
 */
const validateObjectId = (id) => {
  const result = { isValid: false, message: '' };
  
  if (!id) {
    result.message = 'ID is required';
    return result;
  }
  
  if (typeof id !== 'string') {
    result.message = 'ID must be a string';
    return result;
  }
  
  // MongoDB ObjectId is 24 character hex string
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!objectIdRegex.test(id)) {
    result.message = 'Invalid ID format';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate file type for uploads
 * @param {string} mimeType - MIME type to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {Object} Validation result
 */
const validateFileType = (mimeType, allowedTypes = []) => {
  const result = { isValid: false, message: '' };
  
  if (!mimeType) {
    result.message = 'File type is required';
    return result;
  }
  
  if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) {
    result.message = 'No allowed file types specified';
    return result;
  }
  
  if (!allowedTypes.includes(mimeType)) {
    result.message = `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate pagination parameters
 * @param {number|string} page - Page number
 * @param {number|string} limit - Items per page
 * @returns {Object} Validation result with parsed values
 */
const validatePagination = (page = 1, limit = 20) => {
  const result = { 
    isValid: false, 
    message: '', 
    page: 1, 
    limit: 20 
  };
  
  // Parse page
  const parsedPage = parseInt(page);
  if (isNaN(parsedPage) || parsedPage < 1) {
    result.message = 'Page must be a positive integer';
    return result;
  }
  
  // Parse limit
  const parsedLimit = parseInt(limit);
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    result.message = 'Limit must be a positive integer';
    return result;
  }
  
  if (parsedLimit > 100) {
    result.message = 'Limit cannot exceed 100 items per page';
    return result;
  }
  
  result.isValid = true;
  result.page = parsedPage;
  result.limit = parsedLimit;
  return result;
};

/**
 * Comprehensive validation for user registration
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
const validateUserRegistration = (userData) => {
  const result = { isValid: true, message: '', errors: {} };
  
  const { firstName, lastName, email, password, phone, dateOfBirth, countryCode } = userData;
  
  // Validate first name
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.isValid) {
    result.errors.firstName = firstNameValidation.message;
    result.isValid = false;
  }
  
  // Validate last name
  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    result.errors.lastName = lastNameValidation.message;
    result.isValid = false;
  }
  
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    result.errors.email = emailValidation.message;
    result.isValid = false;
  }
  
  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    result.errors.password = passwordValidation.message;
    result.isValid = false;
  }
  
  // Validate phone (optional)
  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      result.errors.phone = phoneValidation.message;
      result.isValid = false;
    }
  }
  
  // Validate date of birth (optional)
  if (dateOfBirth) {
    const dobValidation = validateDateOfBirth(dateOfBirth);
    if (!dobValidation.isValid) {
      result.errors.dateOfBirth = dobValidation.message;
      result.isValid = false;
    }
  }
  
  // Validate country code (optional)
  if (countryCode) {
    const countryValidation = validateCountryCode(countryCode);
    if (!countryValidation.isValid) {
      result.errors.countryCode = countryValidation.message;
      result.isValid = false;
    }
  }
  
  if (!result.isValid) {
    result.message = 'Validation failed. Please check the errors.';
  }
  
  return result;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateAmount,
  validateCurrency,
  validateName,
  validateDateOfBirth,
  validateDocumentType,
  validateAddress,
  validateCountryCode,
  validateOTP,
  validateTransactionDescription,
  validateUUID,
  validateObjectId,
  validateFileType,
  validatePagination,
  validateUserRegistration
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
const validateEmail = (email) => {
  const result = { isValid: false, message: '' };
  
  if (!email) {
    result.message = 'Email is required';
    return result;
  }
  
  if (typeof email !== 'string') {
    result.message = 'Email must be a string';
    return result;
  }
  
  if (email.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) {
    result.message = `Email must be less than ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`;
    return result;
  }
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    result.message = 'Please enter a valid email address';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
const validatePassword = (password) => {
  const result = { 
    isValid: false, 
    message: '', 
    strength: 'weak',
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  };
  
  if (!password) {
    result.message = 'Password is required';
    return result;
  }
  
  if (typeof password !== 'string') {
    result.message = 'Password must be a string';
    return result;
  }
  
  // Check length
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    result.message = `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`;
    return result;
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    result.message = `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters long`;
    return result;
  }
  
  // Check requirements
  result.requirements.length = password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
  result.requirements.uppercase = /[A-Z]/.test(password);
  result.requirements.lowercase = /[a-z]/.test(password);
  result.requirements.number = /\d/.test(password);
  result.requirements.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Calculate strength score
  let score = 0;
  if (result.requirements.length) score += 20;
  if (result.requirements.uppercase) score += 20;
  if (result.requirements.lowercase) score += 20;
  if (result.requirements.number) score += 20;
  if (result.requirements.special) score += 20;
  
  result.score = score;
  
  // Determine strength
  if (score >= 80) {
    result.strength = 'strong';
    result.isValid = true;
  } else if (score >= 60) {
    result.strength = 'medium';
    result.isValid = true;
  } else {
    result.strength = 'weak';
    result.message = 'Password must contain at least 3 of the following: uppercase letter, lowercase letter, number, special character';
  }
  
  return result;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
const validatePhone = (phone) => {
  const result = { isValid: false, message: '' };
  
  if (!phone) {
    result.message = 'Phone number is required';
    return result;
  }
  
  if (typeof phone !== 'string') {
    result.message = 'Phone number must be a string';
    return result;
  }
  
  // Remove all non-digit characters for length validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < VALIDATION_RULES.PHONE_MIN_LENGTH) {
    result.message = `Phone number must have at least ${VALIDATION_RULES.PHONE_MIN_LENGTH} digits`;
    return result;
  }
  
  if (digitsOnly.length > VALIDATION_RULES.PHONE_MAX_LENGTH) {
    result.message = `Phone number must have no more than ${VALIDATION_RULES.PHONE_MAX_LENGTH} digits`;
    return result;
  }
  
  // International phone number regex (supports + prefix and various formats)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  if (!phoneRegex.test(digitsOnly)) {
    result.message = 'Please enter a valid phone number';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate transaction amount
 * @param {number|string} amount - Amount to validate
 * @param {string} currency - Currency code (optional)
 * @returns {Object} Validation result
 */
const validateAmount = (amount, currency = 'USD') => {
  const result = { isValid: false, message: '' };
  
  if (amount === null || amount === undefined) {
    result.message = 'Amount is required';
    return result;
  }
  
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    result.message = 'Amount must be a valid number';
    return result;
  }
  
  if (numAmount < VALIDATION_RULES.AMOUNT_MIN) {
    result.message = `Amount must be at least ${VALIDATION_RULES.AMOUNT_MIN}`;
    return result;
  }
  
  if (numAmount > VALIDATION_RULES.AMOUNT_MAX) {
    result.message = `Amount cannot exceed ${VALIDATION_RULES.AMOUNT_MAX}`;
    return result;
  }
  
  // Check decimal places (max 2 for most currencies)
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    result.message = 'Amount cannot have more than 2 decimal places';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {Object} Validation result
 */
const validateCurrency = (currency) => {
  const result = { isValid: false, message: '' };
  
  if (!currency) {
    result.message = 'Currency is required';
    return result;
  }
  
  if (typeof currency !== 'string') {
    result.message = 'Currency must be a string';
    return result;
  }
  
  const upperCurrency = currency.toUpperCase();
  
  if (!Object.values(CURRENCY_CODES).includes(upperCurrency)) {
    result.message = `Unsupported currency: ${currency}`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate name (first name, last name, etc.)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {Object} Validation result
 */
const validateName = (name, fieldName = 'Name') => {
  const result = { isValid: false, message: '' };
  
  if (!name) {
    result.message = `${fieldName} is required`;
    return result;
  }
  
  if (typeof name !== 'string') {
    result.message = `${fieldName} must be a string`;
    return result;
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    result.message = `${fieldName} must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`;
    return result;
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    result.message = `${fieldName} must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long`;
    return result;
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  
  if (!nameRegex.test(trimmedName)) {
    result.message = `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate date of birth
 * @param {string|Date} dateOfBirth - Date of birth to validate
 * @returns {Object} Validation result
 */
const validateDateOfBirth = (dateOfBirth) => {
  const result = { isValid: false, message: '' };
  
  if (!dateOfBirth) {
    result.message = 'Date of birth is required';
    return result;
  }
  
  const dob = new Date(dateOfBirth);
  
  if (isNaN(dob.getTime())) {
    result.message = 'Please enter a valid date of birth';
    return result;
  }
  
  const today = new Date();
  const minAge = 18;
  const maxAge = 120;
  
  // Calculate age
  const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (age < minAge) {
    result.message = `You must be at least ${minAge} years old`;
    return result;
  }
  
  if (age > maxAge) {
    result.message = `Please enter a valid date of birth`;
    return result;
  }
  
  // Check if date is not in the future
  if (dob > today) {
    result.message = 'Date of birth cannot be in the future';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate KYC document type
 * @param {string} documentType - Document type to validate
 * @returns {Object} Validation result
 */
const validateDocumentType = (documentType) => {
  const result = { isValid: false, message: '' };
  
  if (!documentType) {
    result.message = 'Document type is required';
    return result;
  }
  
  if (typeof documentType !== 'string') {
    result.message = 'Document type must be a string';
    return result;
  }
  
  if (!Object.values(KYC_DOCUMENT_TYPES).includes(documentType.toLowerCase())) {
    result.message = `Invalid document type: ${documentType}`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

