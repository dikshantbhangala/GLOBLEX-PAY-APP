const { time } = require('console');
const crypto = require('crypto');

/**
 * Generate a random OTP (One Time Password)
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Generated OTP
 */

const generateOtp = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for(let i = 0; i< length ; i++){
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
};

/**
 * Generate unique transaction ID
 * @param {string} prefix - Prefix for transaction ID (default: 'TXN')
 * @returns {string} Unique transaction ID
 */

const generateTransactionId = (prefix = 'TXN') => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}_${timestamp}_${randomBytes}`;
};

/**
 * Generate unique reference number
 * @param {string} prefix - Prefix for reference (default: 'REF')
 * @returns {string} Unique reference number
 */

const genrateReferemce = (prefix = 'REF') => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() *100000).toString().padStart(4,'0');
    return `${prefix}_${timestamp}_${randomNum}`;
};

/**
 * Format timestamp to readable date string
 * @param {Date|string|number} timestamp - Timestamp to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */

const formatTimestamp = (timestamp, locale = 'en-US', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp provided');
  }
  
  return date.toLocaleString(locale, formatOptions);
};

/**
 * Format date for database storage (ISO string)
 * @param {Date|string|number} date - Date to format
 * @returns {string} ISO formatted date string
 */
const formatDateForDB = (date = new Date()) => {
  return new Date(date).toISOString();
};

/**
 * Calculate time difference in minutes
 * @param {Date|string} startTime - Start time
 * @param {Date|string} endTime - End time (default: current time)
 * @returns {number} Difference in minutes
 */
const getTimeDifferenceInMinutes = (startTime, endTime = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return Math.floor((end - start) / (1000 * 60));
};

/**
 * Check if timestamp is expired
 * @param {Date|string} timestamp - Timestamp to check
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {boolean} True if expired
 */
const isExpired = (timestamp, expiryMinutes = 10) => {
  const timeDiff = getTimeDifferenceInMinutes(timestamp);
  return timeDiff > expiryMinutes;
};

/**
 * Generate secure random string
 * @param {number} length - Length of string (default: 32)
 * @returns {string} Random string
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

/**
 * Hash sensitive data
 * @param {string} data - Data to hash
 * @param {string} algorithm - Hash algorithm (default: 'sha256')
 * @returns {string} Hashed data
 */
const hashData = (data, algorithm = 'sha256') => {
  return crypto.createHash(algorithm).update(data.toString()).digest('hex');
};

/**
 * Mask sensitive information (e.g., email, phone)
 * @param {string} value - Value to mask
 * @param {number} visibleStart - Characters to show at start
 * @param {number} visibleEnd - Characters to show at end
 * @returns {string} Masked value
 */
const maskSensitiveData = (value, visibleStart = 2, visibleEnd = 2) => {
  if (!value || value.length <= visibleStart + visibleEnd) {
    return value;
  }
  
  const start = value.substring(0, visibleStart);
  const end = value.substring(value.length - visibleEnd);
  const middle = '*'.repeat(Math.max(0, value.length - visibleStart - visibleEnd));
  
  return start + middle + end;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {number} Percentage
 */
const calculatePercentage = (value, total, decimals = 2) => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @param {number} baseDelay - Base delay in ms (default: 1000)
 * @returns {Promise} Result of function or throws error
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
};


module.exports = {
    generateOtp,
    generateTransactionId,
    genrateReferemce,
    formatTimestamp,
    formatDateForDB,
    getTimeDifferenceInMinutes,
    isExpired,
    generateSecureToken,
    hashData,
    maskSensitiveData,
    formatCurrency,
    calculatePercentage,
    sleep,
    retryWithBackoff
};