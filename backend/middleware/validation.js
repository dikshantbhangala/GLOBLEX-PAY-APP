const { body , validationResult } = require('express-validator');

//handle validation errors
const handlevalidationerrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!erros.isEmpty()){
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};


 // USer registration validation
const validationregistration = [
    body('firstName').trim()
    .islength({min:2 , max:50})
    .withMessage('First name must be metween 2 and 50 characters'),

    body('lastName')
    .trim()
    .islength({min:2,max:50})
    .withMessage('Last name must be between 2 and 50 characters'),

    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

    body('phone')
    .isMobilePhone()
    .withMessage('please provide a valid phone number'),

    body('password')
    .islength()
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('dateOfBirth')
    .isISO8601()
    .withMessage('please provide a valid date of birth')
    .custom((value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if(age<18){
            throw new Error('You must ne at least 18 year old');
        }
        return true;
    }),
    body('country')
    .trim()
    .islength({min:2})
    .withMessage('Country is required'),
    handlevalidationerrors
];

// User Login Validation
const validateLogin = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('please provide a valid email'),
    body('password')
    .notEmpty()
    .withMessage('Password is required'),
    handlevalidationerrors
]

// send money validation
const validationsendmoney = [
    body('recipentIdentifier')
    .notEmpty()
    .withMessage('recipient email or phone is required')
    .custom((value) => {
         const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error('Please provide a valid email or phone number');
      }
      return true;
    }),
    body('amount')
    .isFloat({min: 0.01})
    .withMessage('Amount must be greater than 0'),
    body('currency')
    .islength({min:3,max:3})
    .isAlpha()
    .toUpperCase()
    .withMessage('Currency must be a valid 3-letter code'),
    body('description')
    .optional()
    .trim()
    .withMessage('description cannot exceed 500 characters'),
    handlevalidationerrors
];

//Add funds validation
const validateAddFunds  = [
    body('amount')
    .isFloat({min:1})
    .withMessage('Amount must be at least $1'),
    body('currency')
    .islength({min:3,max:3})
    .isAlpha()
    .toUpperCase()
    .withMessage('Currency must be a valid 3-letter code'),
    body('paymentMethodId')
    .notEmpty()
    .withMessage('Payment method is required'),
    handlevalidationerrors
];

// Currency conversion validation
const validateCurrencyConversion = [
  body('fromCurrency')
    .isLength({ min: 3, max: 3 })
    .isAlpha()
    .toUpperCase()
    .withMessage('From currency must be a valid 3-letter code'),
  body('toCurrency')
    .isLength({ min: 3, max: 3 })
    .isAlpha()
    .toUpperCase()
    .withMessage('To currency must be a valid 3-letter code'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  handleValidationErrors
];


// Currency conversion nalidation
const validateKYC = [
     body('personalInfo.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('personalInfo.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('personalInfo.dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('personalInfo.nationality')
    .trim()
    .notEmpty()
    .withMessage('Nationality is required'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('documents.governmentId.type')
    .isIn(['passport', 'drivers_license', 'national_id', 'voter_id'])
    .withMessage('Invalid government ID type'),
  body('documents.governmentId.number')
    .trim()
    .notEmpty()
    .withMessage('Government ID number is required'),
    handlevalidationerrors
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  handleValidationErrors
];

module.exports = {
        validationregistration,
    validateLogin,
    validationsendmoney,
    validateAddFunds,
    validateCurrencyConversion,
    validateKYC,
    validateProfileUpdate,
    handleValidationErrors
}