const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
        trim: true,
        maxlength: [50,'First name cannot exceed 50 characters']
    },
    lastName:{
        type:String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50,'Last name cannot exceed 50 characters']
    },
    email:{
        type: String,
        required: [true,'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone:{
        type:String,
        required: [true, 'Phone number is required'],
        unique: true,
         match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
     password: {
     type: String,
     required: [true, 'Password is required'],
     minlength: [8, 'Password must be at least 8 characters'],
     select: false
     },
            profilePicture: {
            url: String,
            publicId: String
            },
            dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required']
            },
            address: {
            street: String,
            city: String,
            state: String,
            country: {
            type: String,
            required: [true, 'Country is required']
            },
            zipCode: String
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        kycStatus: {
            type: String,
            enum: ['pending', 'submitted', 'approved', 'rejected'],
            default: 'pending'
        },
        accountStatus: {
            type: String,
            enum: ['active', 'suspended', 'closed'],
            default: 'active'
        },
        pushNotificationToken: {
        type : String,
        lastLoginAt: Date,
        LoginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: Date,
        }, 
        TimeRanges: {
            timestamps : true,
            versionKey : false,
        },
});

userSchema.index({email: 1});
userSchema.index({phone:1});
userSchema.index({'address.country' : 1});


// Virtual for full name
userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

// virtual for account locked status
userSchema.virtual('isLocked').get(function(){
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

//Pre-save hash password
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_ROUNDS) || 12);
    next();
})

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
    
}

//Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    if(this.lockUntil && this.lockUntil < Date.now()){
        return this.updateOne({
            $set : {
                LoginAttempts: 1,
            },
            $unset: {
                lockUntil: 1
            }
        });

    }
    const updates = {$inc : {LoginAttempts : 1}};

    // lock account after 5 attempts for 2 hours
    if(this.LoginAttempts +1 >=5 && !this.isLocked){
        updates.$set = {lockUntil: Date.now() + 2 * 60 * 60* 1000} ;
       }
       return this.updateOne(updates);
};

// Method to reset Login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            LoginAttempts : 1,
            lockUntil: 1
        }
    });
};

module.exports = mongoose.model('User' ,userSchema);