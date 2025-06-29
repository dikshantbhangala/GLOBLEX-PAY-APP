const express = require('express');
const {authLimiter} = require('../middleware/ratelimiter');
const { registerValidation , loginValidation}  = require('../middleware/validation');
const authController = require('../controllers/authcontroller');
const {auth} = require('../middleware/Auth');

const router = express.Router();

router.post('/register' , authLimiter , registerValidation , authController.register);
router.post('/login',authLimiter , loginValidation , authController.login);
router.post('/refresh-token' , authController.refreshToken);
router.post('/logout' , auth , authController.logout);
router.post('/verify-email',authController.verifyEmail);

module.exports = router;