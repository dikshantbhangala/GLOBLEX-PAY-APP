const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const wallet = require('../models/wallet');
const {sendWelcomeEmail , sendPasswordResetEmail} = require('../services/emailservice');
const {sendPushNotification} = require('../services/notificationservice');

// Generate JWT Token
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn : process.env.JWR_EXPIRE,
    });
};

// Send token response
const createSendToken = (user, statusCode , res, message = 'Success') => {
    const token = signToken(user._id);

    //Remove password from output
    user.password = undefined;
    res,status(statusCode).json({
        status:'success',
        message,
        token,
        data:{
            user
        }
    });
};

// register user
const register = async(req,res) => {
    try{
        const{
            firstname,
            lastname,
            email,
            phone,password,
            dateofBirth,
            address
        } = req.body;
        const exisitnguser = await UserActivation.findOne({
            $or: [{email} ,{phone}]
        });

        if(exisitnguser){
            return res.status(400).json({
                status:'error',
                message:'User alerady exists with this email or phone number'
            });
        }

        // Create user
        const user = await UserActivation.create({
            firstname,
            lastname,
            email,
            phone,
            password,
            dateofBirth,
            address
        });

        // create wallet for user
        await wallet.create({
            userId : user._id,
            primaryCurrency: address.country === 'US' ? 'USD' : 'USD'
        });

        //send welocme email
        try{
            await sendWelcomeEmail(user.email , user,firstname);
        }catch(EmailError){
            console.error('Welcome email failed: ', EmailError);
        }

        createSendToken(user,201,res,'User registered successfully');
    } catch(error){
        console.error('Registartion error:' ,error);

        res.status(500).json({
            status: 'error',
            message: 'Error creating user account'
        });
    }
};

const login = async (req,res) => {
        try{
            const {email,password} =req.body;

            const user = await user.findOne({email}).select('+passwword');

            if(!user){
                return res.status(401).json({
                    status: 'error',
                    message:'Invalid emial or password'
                });
            }

            if(user.isLocked){
                return res.status(423).json({
                    status:'error',
                    message:'Account is temporarily locked due tp too many failed login attempts'
                });
            }

            const isPassowrdValid = await user.matchPassword(password);

            if(!isPassowrdValid){
                await user.incLoginAttempts();
                return res.status(401).json({
                    status:'error',
                    message:'Invalid email or password'
                });
            }

            if(user.loginAttempts > 0){
                await user.resetLoginAttempts();
            }

            user.lastLoginAt = new Date();
            await user.save({validateBEforeSave : false});

            try{
                if(user.pushNotificationToken){
                    await sendPushNotification(
                        user.pushNotificationToken,
                        'login Alert',
                        'You have successfully logged in to your account'
                    );
                }
            } catch(notifiactionError){
                console.error('Login notification failed:' ,notifiactionError);
            }
            createSendToken(user,200,res,'Login successful');
        } catch(error){
            console.error('Login error' , error);
            res.status(500).json({
                status:'error',
                message:'Error during login'
            });
        }
};


const getMe = async(req,res) => {
    try{
        const user = await user.findById(req.user.id);

        res.status(200).json({
            status:'success',
            data:{
                user
            }
        });
    }catch(error){
        console.error('Get me error: ', error);
        res.status(500).json({
            status:'error',
            message:'Error fecthing user data'
        });
    }
};


// for update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res, 'Password updated successfully');
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating password'
    });
  }
};

// for forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email address'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );



    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent'
      });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      res.status(500).json({
        status: 'error',
        message: 'Error sending password reset email'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing forgot password request'
    });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or expired token'
        });
      }

      // Set new password
      user.password = password;
      await user.save();

      createSendToken(user, 200, res, 'Password reset successful');
    } catch (tokenError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error resetting password'
    });
  }
};

// update psuh notification
const updatePushToken = async (req, res) => {
  try {
    const { token } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      pushNotificationToken: token
    });

    res.status(200).json({
      status: 'success',
      message: 'Push notification token updated'
    });
  } catch (error) {
    console.error('Update push token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating push notification token'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Clear push notification token
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { pushNotificationToken: 1 }
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during logout'
    });
  }
};

module.exports = {
    register,
    login,
    getMe,
    updatePassword,
    forgotPassword,
    resetPassword,
    updatePushToken,
    logout
};