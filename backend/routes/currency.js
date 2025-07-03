const express = require('express');
const { auth } = require('../middleware/Auth');
const currencyController = require('../controllers/currencyController');

const router = express.Router();

router.get('/rates', auth, currencyController.getExchangeRates);
router.get('/convert', auth, currencyController.convertCurrency);
router.get('/supported', auth, currencyController.getSupportedCurrencies);

module.exports = router;