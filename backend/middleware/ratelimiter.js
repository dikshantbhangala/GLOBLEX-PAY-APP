const rateLimit = require('express-rate-limit');

//General Api rate limiting
const generalLimiter = rateLimit({
    windowMs : 15* 60* 1000,
    max: 100,
    message :{
        status: 'error',
        message:'too many request fro this IP, please try again later'
    },
    standardHeaders : true,
    legacyHeaders : false,
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        status: 'error',
        message: 'Too many transfer attempts , please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

//Money transfer rate limiting
const transferLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 transfers per hour
  message: {
    status: 'error',
    message: 'Too many transfer attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting
const uploadLimiter = rateLimit({
    windowMs: 60* 60 * 1000,
    max : 20,
    message:{
        status: 'error',
        message: 'Too many upload attempts , please try again later.'
    },
    standardHeaders: true,
    leagacyHeaders : false,

});

module.exports = {
    generalLimiter,
    authLimiter,
    transferLimiter,
    uploadLimiter
}
