const express = require('express');
const { auth } = require('../middleware/Auth');
const { transactionLimiter } = require('../middleware/ratelimiter');
const { transactionValidation } = require('../middleware/validation');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.post('/send', auth, transactionLimiter, transactionValidation, transactionController.sendMoney);
router.get('/history', auth, transactionController.getTransactionHistory);
router.get('/:transactionId', auth, transactionController.getTransaction);
router.put('/:transactionId/cancel', auth, transactionController.cancelTransaction);

module.exports = router;