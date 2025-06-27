const axios = require('axios');

class CurrencyService{
    constructor(){
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000;
    }

    async getExchangeRates (baseCurrency = 'USD'){
        const cacheKey = `rates_${baseCurrency}`;
        const cached = this.cache.get(cacheKey);

        if(cached && Date.now() - cached.timestamp < this.cacheExpiry){
            return cached.data;
        }

        try{
            const response = await axios.get(`https://api.exchangerate.host/latest?base=${baseCurrency}`);
            const rates = response.data.rates;

            this.cache.set(cacheKey,{
                dates: rates,
                timestamp: Date.now()
            });
            return rates;
        }catch(error){
            console.error('Error fetching exchange rates:',error);
            throw new Error('Unable to fetch exchange rates');
        }
    }
    

    async convertCurrency(amount, fromCurrency, toCurrency){
        if(fromCurrency === toCurrency){
            return {amount, rate:1};
        }

        const rates = await this.getExchangeRates(fromCurrency);
        const rate = rates[toCurrency];

        if(!rate){
            throw new Error(`Exchange rate not avaliable for ${toCurrency}`);
        }

        return{
            amount: amount * rate,
            rate
        };
    }

    getSupportedCurrencies(){
        return[
            'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
             'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'ZAR',
             'BRL', 'INR', 'KRW', 'PLN', 'CZK', 'HUF', 'ILS', 'CLP',
              'PHP', 'THB', 'MYR', 'RON', 'BGN', 'HRK'
        ];
    }
}

module.exports = new CurrencyService();