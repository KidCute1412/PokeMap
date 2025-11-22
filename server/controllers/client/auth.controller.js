

import jwt from 'jsonwebtoken';
import { User, PendingUser, OTPResetPassword } from '../../models/auth.model.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../../config/email.config.js';

// Generate random 6-digit OTP
function generateOTP() {

    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}



// SIGNUP - Step 1: Create pending user and send OTP
export const signup = async (req, res) => {
    try {
        const { email, password, username} = req.body;
        
        // 1. Check if user already exists (verified)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // 2. Check if email exists in pending (delete old entry)
        await PendingUser.deleteOne({ email });

        // 3. Validate input
        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and username are required'
            });
        }

        // 4. Hash password
        const hashedPassword = await hashPassword(password);

        // 5. Generate OTP
        const otp = generateOTP();

        // 6. Create pending user
        const pendingUser = new PendingUser({
            email,
            password: hashedPassword,
            username,
            otp
        });
        console.log('Pending user created:', pendingUser);

        await pendingUser.save().catch(err => {
            console.error('Error saving pending user:', err);
            throw new Error('Database error');
        })

        // 7. Send OTP email
        await sendEmail(
            email,
            'Your Signup OTP',
            `Your OTP for completing signup is: ${otp}. It is valid for 10 minutes.`
        );

        // 8. Return success (no sensitive data)
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete signup.',
            data: {
                email: email // Only return email for next step
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

// VERIFY SIGNUP OTP - Step 2: Verify OTP and create real user
export const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Find pending user
        const pendingUser = await PendingUser.findOne({ email });
        if (!pendingUser) {
            return res.status(400).json({
                success: false,
                message: 'No pending signup found for this email'
            });
        }

        // 2. Check if OTP expired
        if (new Date() > pendingUser.otpExpires) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please signup again.'
            });
        }

        // 3. Check attempts limit
        if (pendingUser.attempts >= 3) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: 'Too many failed attempts. Please signup again.'   
            });
        }

        // 4. Verify OTP
        if (pendingUser.otp !== otp) {
            // Increment attempts
            pendingUser.attempts += 1;
            await pendingUser.save();
            
            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${3 - pendingUser.attempts} attempts remaining.`
            });
        }

        // 5. OTP is valid - Create real user
        const newUser = new User({
            email: pendingUser.email,
            password: pendingUser.password, // Already hashed
            username: pendingUser.username,
            emailVerified: true
        });

        await newUser.save();

        // 6. Delete pending user
        await PendingUser.deleteOne({ email });

        // 7. Return success
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            data: {
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    username: newUser.username,
                    profile: newUser.profile
                }
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
};

// RESEND SIGNUP OTP
export const resendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Find pending user
        const pendingUser = await PendingUser.findOne({ email });
        if (!pendingUser) {
            return res.status(400).json({
                success: false,
                message: 'No pending signup found for this email'
            });
        }

        if (pendingUser.recreation >= 3) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: 'OTP resend limit reached. Please signup again.'
            });
        }
        // Generate new OTP
        const newOTP = generateOTP();
        
        // Update pending user
        pendingUser.otp = newOTP;
        pendingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        pendingUser.attempts = 0; // Reset attempts
        pendingUser.recreation += 1;
        
        await pendingUser.save();

        // Send new OTP
        await sendEmail(
            email,
            'Your New Signup OTP',
            `Your new OTP for completing signup is: ${newOTP}. It is valid for 10 minutes.`
        );

        res.status(200).json({
            success: true,
            message: 'New OTP sent to your email'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP resend'
        });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user (only verified users)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 2. Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        // cookies 
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // 3. Return success (you can add JWT token here)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    profile: user.profile
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};


export const forgotPassword = async (req, res) => {
    try{
        const {email} = req.body;
        console.log('Forgot password request for email:', email);
        const user = await User.findOne({
            email: email
        })
    
        if (!user){
            return res.status(400).json({
                success: false,
                message: 'Email not found'
            })
        }

        await OTPResetPassword.deleteMany({
            email: email
        })

        const otp = generateOTP();

        const otpEntry = new OTPResetPassword({
            email: email,
            otp: otp
        })

        await otpEntry.save();

        await sendEmail(
            email,
            'Your Password Reset OTP',
            `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`
        );

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email'
        });

    }
    catch (error){
        console.error('Forgot Password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during forgot password'
        });
    }
}


export const otpForgotPassword = async (req, res) => {
    try{
        const {email, otp} = req.body;

        const otpEntry = await OTPResetPassword.findOne({
            email: email
        });

        if (!otpEntry){
            return res.status(400).json({
                success: false,
                message: 'No OTP request found for this email'
            })
        }

        if (new Date() > otpEntry.otpExpires){
            await OTPResetPassword.deleteMany({
                email: email
            });
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new one.'
            })
        }

        if (otpEntry.attempts >= 3){
            await OTPResetPassword.deleteMany({
                email: email
            });
            return res.status(400).json({
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.'
            })
        }   

        if (otpEntry.otp !== otp){
            otpEntry.attempts += 1;
            await otpEntry.save();
            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${3 - otpEntry.attempts} attempts remaining.`
            })
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified. You can now reset your password.'
        });
    }
    catch (error) {
        console.error('OTP Forgot Password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification'
        });
    }
}


export const resetPassword = async (req, res) => {
    try{
        const {email, newPassword} = req.body;
        const user = await User.findOne({
            email: email
        });
        if (!user){
            return res.status(400).json({
                success: false,
                message: 'Email not found'
            })
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        await OTPResetPassword.deleteMany({
            email: email
        });

        
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    }   
    catch (error){
        console.error('Reset Password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
}