const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req , res , next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({
                status:'error',
                message: 'Not authorized to access this route'
            });
        }
    
       try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(401).json({
                    status:'error',
                    message:'User not found'
                });
            }
            if(req.user.accountStatus !== 'active'){
                return res.status(401).json({
                    status:'error',
                    message:'Account is suspended or closed'
                });
            }
            next();
       }
       catch(error){
        return res.status(401).json({
            status:'error',
            message:'Not authorized to access this route'
        });
    }
  } catch(error){
    res.status(500).json({
        status:'error',
        message:'Server error in auth middleware'
    });
  }
};

//Grant access to specific roles
const authorize = (...roles) => {
    return (req, res , next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: 'error',
                message: 'User role is not authhorized to access this route'
            });
        }
        next();
    };
};

// optional authentication - does't fail if no token
const optionalAuth = async ( req, res , next) => {
    try{
        let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid, but continue without user
        req.user = null;
      }
    }

    next();
    } catch(error){
        next();

    }
};

module.exports = {
    protect,
    authorize,
    optionalAuth
};