const Transaction = require('../models/transcation')
const wallet = require('../models/wallet');
const user = require('../models/user');
const currencyservice = require('../services/currencyservice');
const notificationservice = require('../services/notificationservice');
const emailservice = require('../services/emailservice');

class TransactionController {
    async sendMoney(req,res){
        try{
            const{recipientEmail , amount, currency , description , reference} = req.body;

            if(req.user.kycStatus !== 'approved'){
                return res.status(403).json({error : 'KYC approval required for money transfers'});

            }

            const  recipient = await wallet.findOne({email : recipientEmail});
            if(!recipient){
                return res.status(404).json({error : 'recipient not found'});
            }

            const senderWallet = await wallet.findOne({email: recipientEmail});
            const recipientWallet = await wallet.findOne({userId: recipient._id});

            const senderBalance  = senderWallet.balances.find(b => b.currency === currency);
            if(!senderBalance || senderBalance.available < amount){
                return res.status(400).json({error: 'Insufficient funds'});
            }

            const platformFee = amount * 0.02;
            const totalAmount = amount + platformFee;

            if(senderBalance.available < totalAmount){
                return res.status(400).json({error:'Insufficent funds including fees'});

            }


             const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaySent = await Transaction.aggregate([
        {
          $match: {
            'sender.userId': req.user._id,
            type: 'send',
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

      const todayTotal = todaySent[0]?.total || 0;
      if (todayTotal + amount > senderWallet.limits.daily.send) {
        return res.status(400).json({ error: 'Daily send limit exceeded' });
      }

      // Create transaction
      const transaction = new Transaction({
        type: 'send',
        sender: {
          userId: req.user._id,
          walletId: senderWallet._id,
          email: req.user.email,
          name: req.user.profile.firstName + ' ' + req.user.profile.lastName
        },
        recipient: {
          userId: recipient._id,
          walletId: recipientWallet._id,
          email: recipient.email,
          name: recipient.profile.firstName + ' ' + recipient.profile.lastName
        },
        amount: { value: amount, currency },
        fees: {
          platform: platformFee,
          total: platformFee
        },
        description,
        reference,
        paymentMethod: 'wallet',
        status: 'processing'
      });

      // Update sender balance
      senderBalance.available -= totalAmount;
      senderBalance.pending += totalAmount;
      await senderWallet.save();

      await transaction.save();

      // Process transaction (in real app, this might be queued)
      setTimeout(async () => {
        try {
          // Update recipient balance
          let recipientBalance = recipientWallet.balances.find(b => b.currency === currency);
          if (!recipientBalance) {
            recipientBalance = { currency, available: 0, pending: 0, frozen: 0 };
            recipientWallet.balances.push(recipientBalance);
          }

          recipientBalance.available += amount;
          await recipientWallet.save();

          // Update sender balance
          senderBalance.pending -= totalAmount;
          await senderWallet.save();

          // Update transaction status
          transaction.status = 'completed';
          transaction.timeline.push({
            status: 'completed',
            notes: 'Transfer completed successfully'
          });
          await transaction.save();

          // Send notifications
          await notificationService.sendTransactionNotification(req.user, transaction);
          await notificationService.sendTransactionNotification(recipient, transaction);
          
          await emailService.sendTransactionNotification(req.user.email, transaction);
          await emailService.sendTransactionNotification(recipient.email, transaction);

        } catch (error) {
          console.error('Transaction processing error:', error);
          
          // Revert balances on error
          senderBalance.available += totalAmount;
          senderBalance.pending -= totalAmount;
          await senderWallet.save();

          transaction.status = 'failed';
          transaction.timeline.push({
            status: 'failed',
            notes: 'Transaction processing failed'
          });
          await transaction.save();
        }
      }, 2000); // 2 second delay to simulate processing

      res.json({
        message: 'Transaction initiated',
        transaction,
        estimatedProcessingTime: '2-5 minutes'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransaction(req, res) {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findOne({ transactionId })
        .populate('sender.userId', 'email profile')
        .populate('recipient.userId', 'email profile');

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Check if user is authorized to view this transaction
      const isAuthorized = transaction.sender.userId?._id.equals(req.user._id) || 
                          transaction.recipient.userId?._id.equals(req.user._id);

      if (!isAuthorized && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransactionHistory(req, res) {
    try {
      const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;
      
      const query = {
        $or: [
          { 'sender.userId': req.user._id },
          { 'recipient.userId': req.user._id }
        ]
      };

      if (type) query.type = type;
      if (status) query.status = status;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('sender.userId', 'email profile')
        .populate('recipient.userId', 'email profile');

      const total = await Transaction.countDocuments(query);

      // Calculate summary statistics
      const summary = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount.value' }
          }
        }
      ]);

      res.json({
        transactions,
        summary,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async cancelTransaction(req, res) {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findOne({ transactionId });
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (!transaction.sender.userId.equals(req.user._id)) {
        return res.status(403).json({ error: 'Only the sender can cancel this transaction' });
      }

      if (!['pending', 'processing'].includes(transaction.status)) {
        return res.status(400).json({ error: 'Transaction cannot be cancelled' });
      }

      // Revert wallet balances
      if (transaction.type === 'send') {
        const senderWallet = await Wallet.findOne({ userId: req.user._id });
        const senderBalance = senderWallet.balances.find(b => b.currency === transaction.amount.currency);
        
        const totalAmount = transaction.amount.value + transaction.fees.total;
        senderBalance.available += totalAmount;
        senderBalance.pending -= totalAmount;
        await senderWallet.save();
      }

      transaction.status = 'cancelled';
      transaction.timeline.push({
        status: 'cancelled',
        notes: 'Cancelled by sender'
      });
      await transaction.save();

      res.json({
        message: 'Transaction cancelled successfully',
        transaction
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
        }
  module .exports = new TransactionController();