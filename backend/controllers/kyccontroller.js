const KYC = require('../models/yc');
const user = require('../models/user');

class KYCController{
    async submitKYC(req,res){
        try{
            const{firstName , lastName , dateOfBirth , nationality , address , income, documents} = req.body;

            const exisiingKYC = await KYC.findOne({userId : req.user._id});
            if(exisiingKYC && exisiingKYC.status === 'approved'){
                return res.status(400).json({error: 'KYC alerady approved'});
            }
            const kycData = {
                userId : req.user._id,
                firstName,
                lastName,
                dateOfBirth,
                nationality,
                address,
                income,
                documents,
                status:'pending',
                submittedAt: new Date()
            };
            let kyc;
            if(exisiingKYC){
                kyc = await KYC.findByIdAndUpdate(exisiingKYC._id , kycData , {new : true});
            } else{
                kyc = new KYC(kycData);
                await kyc.save();
            }

            await user.findByIdAndUpdate(req.user._id, {kycStatus: 'pending'});

            res.json({
                message : 'KYC submitted successfully',
                kyc
            });
        } catch(error){
            res.status(500).json({error : error.message});
        }
    }


    async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { documentType } = req.body; // 'front', 'back', 'selfie'
      const documentUrl = req.file.path;

      res.json({
        message: 'Document uploaded successfully',
        documentType,
        url: documentUrl
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  async getKYCStatus(req, res) {
    try {
      const kyc = await KYC.findOne({ userId: req.user._id });
      
      if (!kyc) {
        return res.json({
          status: 'not_started',
          message: 'KYC not submitted yet'
        });
      }

      res.json({
        status: kyc.status,
        submittedAt: kyc.submittedAt,
        reviewedAt: kyc.reviewedAt,
        reviewNotes: kyc.reviewNotes
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async reviewKYC(req, res) {
    try {
      const { kycId } = req.params;
      const { status, notes } = req.body;

      const kyc = await KYC.findByIdAndUpdate(
        kycId,
        {
          status,
          reviewNotes: notes,
          reviewedBy: req.user._id,
          reviewedAt: new Date()
        },
        { new: true }
      );

      if (!kyc) {
        return res.status(404).json({ error: 'KYC not found' });
      }

      // Update user KYC status
      await User.findByIdAndUpdate(kyc.userId, { kycStatus: status });

      res.json({
        message: 'KYC reviewed successfully',
        kyc
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPendingKYCs(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const kycs = await KYC.find({ status: 'pending' })
        .populate('userId', 'email profile')
        .sort({ submittedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await KYC.countDocuments({ status: 'pending' });

      res.json({
        kycs,
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
 module.exports = new KYCController();
