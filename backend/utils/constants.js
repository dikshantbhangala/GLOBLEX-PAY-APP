// User related constants
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

// Transaction related constants
const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const TRANSACTION_TYPES = {
  SEND: 'send',
  RECEIVE: 'receive',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  REFUND: 'refund',
  FEE: 'fee'
};

const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CARD: 'card',
  MOBILE_MONEY: 'mobile_money',
  CRYPTO: 'crypto',
  WALLET: 'wallet'
};

// KYC related constants
const KYC_STATUS = {
  NOT_SUBMITTED: 'not_submitted',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

const KYC_DOCUMENT_TYPES = {
  PASSPORT: 'passport',
  NATIONAL_ID: 'national_id',
  DRIVERS_LICENSE: 'drivers_license',
  UTILITY_BILL: 'utility_bill',
  BANK_STATEMENT: 'bank_statement',
  SELFIE: 'selfie'
};

const KYC_VERIFICATION_LEVELS = {
  LEVEL_1: 'level_1', // Basic verification - email/phone
  LEVEL_2: 'level_2', // Identity verification - ID documents
  LEVEL_3: 'level_3'  // Enhanced verification - address proof
};

// Wallet related constants
const WALLET_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FROZEN: 'frozen',
  SUSPENDED: 'suspended'
};

const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  NGN: 'NGN',
  KES: 'KES',
  GHS: 'GHS',
  ZAR: 'ZAR',
  INR: 'INR',
  CAD: 'CAD',
  AUD: 'AUD'
};

// Notification related constants
const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  SECURITY: 'security',
  KYC: 'kyc',
  PROMOTIONAL: 'promotional',
  SYSTEM: 'system'
};

const NOTIFICATION_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app'
};

// Email related constants
const EMAIL_TYPES = {
  WELCOME: 'welcome',
  OTP: 'otp',
  TRANSACTION_CONFIRMATION: 'transaction_confirmation',
  TRANSACTION_RECEIPT: 'transaction_receipt',
  KYC_STATUS: 'kyc_status',
  PASSWORD_RESET: 'password_reset',
  SECURITY_ALERT: 'security_alert'
};

// API related constants
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded'
};

// Validation constants
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  EMAIL_MAX_LENGTH: 254,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 50000,
  TRANSACTION_DESCRIPTION_MAX_LENGTH: 500
};

// Rate limiting constants
const RATE_LIMITS = {
  LOGIN_ATTEMPTS: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_ATTEMPTS: 5
  },
  OTP_REQUESTS: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_ATTEMPTS: 3
  },
  TRANSACTION_REQUESTS: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_ATTEMPTS: 10
  },
  API_GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_ATTEMPTS: 100
  }
};

// File upload constants
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
};

// Transaction limits
const TRANSACTION_LIMITS = {
  DAILY_LIMIT: {
    UNVERIFIED: 100,    // $100 for unverified users
    LEVEL_1: 1000,      // $1,000 for level 1 KYC
    LEVEL_2: 10000,     // $10,000 for level 2 KYC
    LEVEL_3: 50000      // $50,000 for level 3 KYC
  },
  SINGLE_TRANSACTION: {
    MIN: 1,             // $1 minimum
    MAX: 10000          // $10,000 maximum per transaction
  }
};

// Security constants
const SECURITY = {
  JWT_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d',
  PASSWORD_RESET_EXPIRY: 30, // minutes
  SESSION_TIMEOUT: 30,       // minutes
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION: 30 // minutes
};

// System constants
const SYSTEM = {
  DEFAULT_TIMEZONE: 'UTC',
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_LOCALE: 'en-US',
  PAGINATION_LIMIT: 20,
  MAX_PAGINATION_LIMIT: 100,
  CACHE_TTL: 300, // 5 minutes in seconds
  MAINTENANCE_MODE: false
};

// Error codes
const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_TOKEN_INVALID: 'AUTH_003',
  AUTH_ACCOUNT_LOCKED: 'AUTH_004',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_005',
  
  // User errors
  USER_NOT_FOUND: 'USER_001',
  USER_ALREADY_EXISTS: 'USER_002',
  USER_INACTIVE: 'USER_003',
  
  // Transaction errors
  TRANSACTION_INSUFFICIENT_FUNDS: 'TXN_001',
  TRANSACTION_LIMIT_EXCEEDED: 'TXN_002',
  TRANSACTION_NOT_FOUND: 'TXN_003',
  TRANSACTION_ALREADY_PROCESSED: 'TXN_004',
  
  // KYC errors
  KYC_DOCUMENT_INVALID: 'KYC_001',
  KYC_VERIFICATION_FAILED: 'KYC_002',
  KYC_REQUIRED: 'KYC_003',
  
  // Validation errors
  VALIDATION_INVALID_EMAIL: 'VAL_001',
  VALIDATION_INVALID_PHONE: 'VAL_002',
  VALIDATION_INVALID_AMOUNT: 'VAL_003',
  VALIDATION_REQUIRED_FIELD: 'VAL_004',
  
  // System errors
  SYSTEM_MAINTENANCE: 'SYS_001',
  SYSTEM_SERVICE_UNAVAILABLE: 'SYS_002',
  SYSTEM_RATE_LIMIT: 'SYS_003'
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
  KYC_STATUS,
  KYC_DOCUMENT_TYPES,
  KYC_VERIFICATION_LEVELS,
  WALLET_STATUS,
  CURRENCY_CODES,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_CHANNELS,
  EMAIL_TYPES,
  HTTP_STATUS,
  API_MESSAGES,
  VALIDATION_RULES,
  RATE_LIMITS,
  UPLOAD_LIMITS,
  TRANSACTION_LIMITS,
  SECURITY,
  SYSTEM,
  ERROR_CODES
};