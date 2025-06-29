const express = require('express');
const { auth } = require('../middleware/Auth');
const { transactionLimiter } = require('../middleware/ratelimiter');
const walletController = require('../controllers/walletController');

const router = express.Router();

router.get('/', auth, walletController.getWallet);
router.get('/balance/:currency', auth, walletController.getBalance);
router.post('/add-funds', auth, transactionLimiter, walletController.addFunds);
router.post('/confirm-deposit', auth, walletController.confirmDeposit);
router.post('/withdraw', auth, transactionLimiter, walletController.withdraw);
router.get('/transactions', auth, walletController.getTransactionHistory);

module.exports = router;