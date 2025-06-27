const User = require('../models/user');
const upload = require('../middleware/upload');

class UserController {
    async getProfile(req,res){
        try{
            const user = await User.findById(req.user._id).select('-password -refreshToken -security.twoFactorSecret');
            res.json(user);
        } catch(error){
            res.status(500).json({error: error.message});
        }
    }
    async updateProfile(req,res){
        try{
            const updates = req.body;
            const allowedUpdates = ['profile.firstName', 'profile.lastName', 'profile.timezone', 'profile.preferredCurrency', 'phone'];

            const updateObj = {};
            Object.keys(updates).forEach(key => {
                if(allowedUpdates.includes(key)){
                    updateObj[key] = updates[key];
                }
            });

            const user = await User.findByIdAndUpdate(req.user._id , updateObj, {new: true}).select('-password -refreshTokens');
            res.json(user);
        } catch(error){
            res.status(500).json({error: error.message});
        }    }
        
         async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { 'profile.avatar': req.file.path },
        { new: true }
      ).select('-password -refreshTokens');

      res.json({ 
        message: 'Avatar uploaded successfully',
        avatar: user.profile.avatar 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateFCMToken(req, res) {
    try {
      const { fcmToken } = req.body;
      
      await User.findByIdAndUpdate(req.user._id, { fcmToken });
      res.json({ message: 'FCM token updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
