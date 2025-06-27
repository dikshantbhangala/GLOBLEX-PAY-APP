const wallet = require('../models/wallet');
const transaction = require('../models/transcation');
const PaymentService = require('../services/paymentservice');
const CurrencyService = require('../services/currencyservice');
const wallet = require('../models/wallet');
const paymentservice = require('../services/paymentservice');

class WalletController {
    async getWallet(req, res){
        try{
            const wallet = await WalletController.findOne({userId : req.user._id}).populate('userId', 'email profile');
            if(!wallet){
                return res.status(404).json({error :'wallet not found'});
            }
        } catch(error){
            res.status(500).json({error: error.message});
        }
    }


    async getBalance(req,res){
        try{
            const {currency} = req.params;
            const wallet = await wallet.findOne({userId : req.user._id});

            if(!wallet){
                return res.status(404).json({error: 'Wallet not found'});
            }
            const balance = wallet.balances.find(b=> b.currency === currency.toUpperCase());

            if(!balance){
                return res.json({currency: currency.toUpperCase() , avaliable: 0 , pending: 0 , frozen: 0});
            }
            res.json(balance);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async addFunds(req,res){
        try{
            const {amount,currency,paymentMethodId} = req.body;

            if(!req.user.verification.email.verified){
                return res.status(403).json({error:'Email verification required'});
            }
            const paymentIntent = await paymentservice.createPaymentIntent(
                amount,
                currency,
                req.user.stripeCustomerId
            );

            const transaction = new Transaction({
                type:'deposit',
                sender:{
                    userId: req.user._id,
                    email: req.user.email,
                    name:req.user.profile.firstName + ' ' + req.user.profile.lastName

                },
                amount: {value:amount , currency},
                paymentMethod : 'stripe',
                externalIds: {stripe: paymentIntent.id},
                status: 'pending'
            });
            await transaction.save();

            res.json({
                message: 'payment intent created',
                clientSecret : paymentIntent.client_secret,
                transactionId: transaction.transactionId
            });
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async confirmDeposit(req,res){
        try{
            const{transactionId , paymentIntentId} = req.body;
            const transaction = await Transaction.findOne({transactionId});

            if(!transaction){
                return res.status(404).json({error: 'transaction not found'});
            }

            const paymentIntent = await paymentservice.confirmPayment(paymentIntentId);
            if(paymentIntent.status === 'succeeded'){
                const wallet = await Wallet.findOne({userId : req.user._id});
                let balance = wallet.balances.find(b => b.currency === transaction.am.currency);

                if(!balance){
                    balance = {currency: transaction.amount.currency , avaliable:0 , pending: 0, frozen: 0};
                    wallet.balance.push(balance);
                }

                balance.avaliable += transaction.amount.value;
                await wallet.save;

                transaction.status = 'completed';
                transaction.timeline.push({
                    status:'completed',
                    notes:'Payment confirmed by stripe'
                });
                await transaction.save();

                res.json({
                    message:'Deposit completed successfully',
                    transaction,
                    balance:balance.avaliable

                });
            } else{
                transaction.status = 'failed';
                await transaction.save();
                res.status(400).json({error: 'Payment Failed'});
            }
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }

     async withdraw(req, res) {
    try {
      const { amount, currency, bankDetails } = req.body;

      if (req.user.kycStatus !== 'approved') {
        return res.status(403).json({ error: 'KYC approval required for withdrawals' });
      }

      const wallet = await Wallet.findOne({ userId: req.user._id });
      const balance = wallet.balances.find(b => b.currency === currency);

      if (!balance || balance.available < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Check daily withdrawal limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayWithdrawals = await Transaction.aggregate([
        {
          $match: {
            'sender.userId': req.user._id,
            type: 'withdrawal',
            status: { $in: ['completed', 'processing'] },
            createdAt: { $gte: today }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount.value' }
          }
        }
      ]);

      const todayTotal = todayWithdrawals[0]?.total || 0;
      if (todayTotal + amount > wallet.limits.daily.withdraw) {
        return res.status(400).json({ error: 'Daily withdrawal limit exceeded' });
      }

      // Create withdrawal transaction
      const transaction = new Transaction({
        type: 'withdrawal',
        sender: {
          userId: req.user._id,
          walletId: wallet._id,
          email: req.user.email,
          name: req.user.profile.firstName + ' ' + req.user.profile.lastName
        },
        recipient: {
          bankDetails
        },
        amount: { value: amount, currency },
        paymentMethod: 'bank_transfer',
        status: 'processing'
      });

      // Update wallet balance
      balance.available -= amount;
      balance.pending += amount;
      await wallet.save();

      await transaction.save();

      res.json({
        message: 'Withdrawal initiated',
        transaction,
        estimatedProcessingTime: '1-3 business days'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransactionHistory(req, res) {
    try {
      const { page = 1, limit = 20, type, status } = req.query;
      
      const query = {
        $or: [
          { 'sender.userId': req.user._id },
          { 'recipient.userId': req.user._id }
        ]
      };

      if (type) query.type = type;
      if (status) query.status = status;

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('sender.userId', 'email profile')
        .populate('recipient.userId', 'email profile');

      const total = await Transaction.countDocuments(query);

      res.json({
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WalletController();