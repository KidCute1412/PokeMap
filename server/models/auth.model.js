import connectDatabase from '../config/database.config.js';

const mongoose = connectDatabase();

// Main Users Schema (for verified users only)
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        avatar: String
    },
    emailVerified: {
        type: Boolean,
        default: true  // Only verified users get here
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    strict: false
});

// Pending Users Schema (for unverified signups)
const pendingUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true  // Store hashed password
    },
    username: {
        type: String,
        required: true
    },
    profile: {
        firstName: String,
        lastName: String
    },
    otp: {
        type: String,
        required: true
    },
    otpExpires: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    },
    recreation:{
        type: Number,
        default: 0,
        max: 3
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600  // Auto-delete after 1 hour if not verified
    }
},{
    strict: false
});


const otpResetPasswordSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true

    }
    ,
    otpExpires: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    }

})

export const User = mongoose.model('Users', userSchema);
export const OTPResetPassword = mongoose.model('OTP_Reset_Password', otpResetPasswordSchema);
export const PendingUser = mongoose.model('Pending_users', pendingUserSchema);