const Mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const conn = await Mongoose.conn(process.env.MONGODB_URI,{
            userNewUrlParser: true,
            userUnifiedTopology : true,
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);

    }catch(error){
        console.error('Databse connection error:', error);
        process.exit(1);
    }
};

//handle connection events
Mongoose.connection.on('disconnected' , () => {
    console.log('MongoDB disconnected');
});

Mongoose.connection.on('reconnected' , () => {
    console.log('MongoDB reconnected');
});

process.on('SIGINT', async() => {
    await Mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB;