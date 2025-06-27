const currencyService = require('../services/currencyservice');

class CurrencyController {
  async getExchangeRates(req, res) {
    try {
      const { base = 'USD' } = req.query;
      const rates = await currencyService.getExchangeRates(base);
      
      res.json({
        base,
        rates,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async convertCurrency(req, res) {
    try {
      const { amount, from, to } = req.query;

      if (!amount || !from || !to) {
        return res.status(400).json({ error: 'Amount, from, and to currencies are required' });
      }

      const conversion = await currencyService.convertCurrency(
        parseFloat(amount),
        from.toUpperCase(),
        to.toUpperCase()
      );

      res.json({
        originalAmount: parseFloat(amount),
        fromCurrency: from.toUpperCase(),
        toCurrency: to.toUpperCase(),
        convertedAmount: conversion.amount,
        exchangeRate: conversion.rate,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupportedCurrencies(req, res) {
    try {
      const currencies = currencyService.getSupportedCurrencies();
      res.json({ currencies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CurrencyController();
