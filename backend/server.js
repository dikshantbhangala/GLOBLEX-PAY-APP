const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importing Configurations

const connectDB = require('./config/database');
const firebase = require('./config/firebase'); // Initializing firebase

// Importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const walletRoutes = require('./routes/wallet');
const kycRoutes = require('./routes/kyc');
const transactionRoutes = require('./routes/transcation');
const currencyRoutes = require('./routes/currency');
const notificationRoutes = require('./routes/notification');

// Intializing express app
const app = express();

//Connection to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

//Rate Limiting
const limiter = rateLimit({
    windowMs : 15*60*1000,
    max : 100,
    message: 'Too many request from this IP, please try again later.'
});
app.use(limiter);

//CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourapp.com']
    :['http://localhost:3000', 'exp://192.168.1.100:19000'],
    credentials: true
}));

// Health check endpoint
app.get('/health' , (req,res) => {
    res.status(200).json({
        status: 'success',
        message: 'Payment App API is running',
        timestamp: new Date().toISOString()
    });
});

//API Routes
app.use('./api/authapi', authRoutes);
app.use('./api/userapi',userRoutes);
app.use('./api/walletapi',walletRoutes);
app.use('./api/kycapi',kycRoutes);
app.use('./api/transationapi',transactionRoutes);
app.use('./api/currencyapi',currencyRoutes);
app.use('./api/notificationapi',notificationRoutes);

// Global error handler
app.use((err , req , res , next ) => {
    console.error('Error:' , err);
    let error = {...err};
    error.message = err.message;

    //Mongoose bad objectid
    if(err.name === 'CastError'){
        const message = 'Resource not found';
        error = {message, statusCode: 404};
    }

    //Mongose duplicate key
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        error = {message, statusCode : 400};
    }
    
    //Mongose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = {message , statusCode:400};
    }

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Server Error'
    });


});

// 404 handler
app.use('*',(req,res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
    });
});

const PORT  = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Payment app API ready at http://loacalhost:${PORT}`);
});

module.exports = app;