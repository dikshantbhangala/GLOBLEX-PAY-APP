const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
        unique: true,
    }, 
    balances : {
        type: Map,
        of: {
            amount : {
                type: Number,
                default: 0,
                min: [0, 'Balance cannot be negative']
            },
            currency : {
                type: String,
                required : true,
                uppercase: true,
                match: [/^[A-Z]{3}$/, 'Currency must be a valid 3-letter code' ]
            }
        },
        default: () => new Map([
            ['USD', {amount :0 , currency: 'USD'}],
            ['EUR' , {amount:0 , currency: 'EUR'}],
            ['GBP' , {amount: 0 , currency: 'GBP'}],
            ['INR' , {amount: 0 , currency: 'INR'}]
        ])
    },
    primaryCurrency: {
        type: String,
        default: 'USD',
        uppercase: true,
        match: [/^[A-Z]{3}$/ , 'Currency must be a valid 3-letter code']
    },
    totalBalance: {
        type : Number,
        default: 0
    },
     isActive : {
        type : Boolean,
        default : true
     },
     dailyLimit : {
        type: Number,
        default: 10000
     },
     monthlyLimit : {
        type: Number,
        default : 50000
     },
     dailySpent:{
        type: Number,
        default: 0
     },
     lastResetDate:{
        type: Date,
        default: Date.now
     },
     pin:{
        type: String,
        select : false,
        minLength : [4,'PIN must be 4 digits'],
        maxlength : [6,'PIN cannot exceed 6 digits']
     }
});

//INDEXES
walletSchema.index({userId : 1});
walletSchema.index({isActive: 1});

// Method to get balance for specific currency
walletSchema.methods.getBalance = function(currency = 'USD'){
    const currencyCode = currency.toUpperCase();
    const currentBalance = this.getBalance(currencyCode);

    let newAmount;
    if(operation === 'add'){
        newAmount = currentBalance + Math.abs(amount);
    }
    else if(operation === 'subtract')  {
        newAmount = currentBalance - Math.abs(amount);
        if(newAmount < 0){
            throw new Error('Insufficient balance');
        }

    }
    else{
        newAmount = amount;
    }
    this.balances.set(currencyCode , {
        amount : newAmount,
        currency: currencyCode
    });
    this.markModified('balances');
    return this;

};

walletSchema.methods.canSpend = function(amount, currency = 'USD'){
    //check balance
    if(this.getBalance(currency ) < amount){
        return{
            canSpend: false , reason: 'Insufficient balance'   
             };

    };

    //Method to add to spending
    walletSchema.methods.addSpeding = function(amount){
        this.dailySpent += amount;
        this.monthlyLimit += amount;
        return this;
    };

    //Method to reset daily/montlhy limits
    walletSchema.methods.resetLimits = function(){
        const now = new Date();
        const lastReset = new Date(this.lastResetDate);

    // Reset Daily when it is the new day
    if(now.getDate() !== lastReset.getDate()){
        this.dailySpent = 0;
    }

    // Reset Montly if it is a new month
    if(now.getMonth() !== lastReset.getMonth() || now.getFullYear !== lastReset.getFullYear()){
        this.monthlyLimit = 0;
    }
    this.lastResetDate = nowl
    return this;
    };

}

    // pre save middle ware to calculate total balance

    walletSchema.pre('save', function(next){
        let total = 0;
        for(let [currency, balance] of this.balances){
            //Covert all to usd for total

            total += balance.amount;
        }
        this.totalBalance = total;
        next();
    });


module.exports = mongoose.model('Wallet', walletSchema);