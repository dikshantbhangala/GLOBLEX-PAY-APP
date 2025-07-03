const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId : {
        type: String,
        required : true,
        unique: true,
        default : () => `TXN${Date.now()} ${Math.random() .toString(36).substr(2,9).toUpperCase()}`
    },
    type:{
        type:String,
        required: true,
        enum : ['send' ,'receive' , 'add_funds', 'withdraw' , 'currency_exchange', 'fee']
    },
    status:{
        type:String,
        required: true,
        enum: ['pending' ,'processing' , 'completed' , 'failed', 'cancelled'],
        default: 'pending'
    },
    amount:{
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than 0']
    },
    currency:{
        type: String,
        required: true,
        uppercase: true,
        match : [/^[A-Z]{3}$/ , 'Currency must be a valid 3-letter code']
    },

    //For currency exchange transactions

    exchangeDetails:{
        fromCurrency: String,
        toCurrency: String,
        FromAmount : Number,
        toAmount : Number, 
        exchangeRate: Number,
        fee: Number
    },

    //Sender information
    sender: {
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name : String,
        email :String,
        phone: String
    },

    //Reciver Information
    receiver :{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref:  'User',
        },
        name:String,
        email: String,
        phone:String,

        //for external transfers
        banlAccount: {
            accountNumber : String,
            routingNumber : String,
            bankName : String,
            accountHolderName : String
        }
    },

    //fee information
    fee:{
        amount:{
            type: Number,
            deefault : 0
        },
        currency:String,
        type:{
            type:String,
            enum:['fixed','percentage'],
            default: 'percentage'
        }
    },

    //Payment method
    paymentMethid:{
        type:String,
        enum:['stripe', 'bank_transfer' , 'wallet' ],
        default: 'wallet'
    },

    //external payment reference
    externalReference: {
        stripePaymentIntentId: String,
        bankTransactionId : String
    },

    //Transaction notes
    description : {
        type: String,
        maxlength : [500 , 'Description  cannot exceed 500 characters'],
        trim : true
    },

    //location data
    location:{
        country: String,
        city: String,
        ipAddress: String
    },
    // System metadata
    metaData: {
        deviceId :String,
        appVersion : String,
        platform  :String,
        userAgent: String
    },

    // Settlement information
    failureReason : {
    retryCount : {
        type: Number,
        default :0
    }, 
     type : String } , 

     timeStamps : true,
     versionKey :false

        
     

});

// indexes for better query performance
transactionSchema.index({'sender.userId' : 1, createdAt: -1});
transactionSchema.index({'reciver.userId' : 1, createdAt : -1});
transactionSchema.index({transactionId: 1});
transactionSchema.index({status :1});
transactionSchema.index({type:1});
transactionSchema.index({createdAt:1}),
transactionSchema.index({settlementDate: 1});

// Virtual for transaction age
transactionSchema.virtual('ageInHours').get(function(){
    return Math.floor((Date.now() - this.createdAt) / (1000*60*60));
});

//Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function(){
    return new Intl.NumberFormat('en-US' ,{
        style: 'currency',
        currency: this.currency
    }).format(this.amount);
});

// method to check if the transaction is cancelled
transactionSchema.methods.canBeCancelled = function(){
    return this.status === 'pending' && this.ageInHours < 24;
}; 

//method to check if transaction needs retry
transactionSchema.methods.needRetry = function(){
    return this.status === 'failed' && this.retryCount <3 && this.ageInHours < 72; 
};

//Static method to get user transcation summary
transactionSchema.statics.getUserSummary = function(userId , days = 30){
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.aggregate([
        {
            $match : {
                $or:[
                    {'sender.userId': mongoose.Types.ObjectId(userId)},
                    {'reciver.userID' : mongoose.Types.ObjectId(userId)}
                ],
                createdAt: {$gte: startDate},
                status: 'completed'
            }
        },{
            $group: {
                _id : '$currency',
                totalSent:{
                    $sum:{
                        $cond:[
                            {$eq: ['$sender.userId', mongoose.Types.ObjectId(userId)]},
                            '$amount',
                            0
                        ]
                    }
                },
                totalReceived:{
                    $sum:{
                        $cond:[
                            {$eq: ['$reciver.userId', mongoose.Types.ObjectId(userId)]},
                            '$amount',
                            0
                        ]
                    }
                },
                transactionCount: {$sum: 1}
            }
        }
    ]);
};

// pre-save middleware
transactionSchema.pre('save', function(next) {
    if(this.status === 'completed' && !this.settlementDate){
        this.settlementDate = new Date();
    }

    // Auto-generate descritption if not provided
    if(!this.description){
        switch(this.type){
            case 'send' : this.description = `Money sent to ${this.receiver.name || this.receiver.email}`;
            break;
            case 'recieve' : this.description = `Money sent to ${this.sender.name || this.sender.email}`;
            break;
            case 'add_funds' : this.description = `Added funds to wallet`;
            break;
            case 'withdraw' : this.description = 'withdrew funds from wallet';
            break;
            case 'currency_exchange' : this.description = `Exchanged ${this.exchangeDetails.fromCurrency} to ${this.exchangeDetails.toCurrency}`;
            break;
            default:
                this.description = `${this.type} transaction`
        }
    }
    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
