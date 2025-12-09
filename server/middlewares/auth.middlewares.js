

// decode JWT token and attach user to req object
import jwt from 'jsonwebtoken';
import { User } from '../models/auth.model.js';

export const verifyToken = async (req, res, next) => {
    console.log ("Token cookies:", req.cookies);
    const token = req.cookies.accessToken;
    console.log ("Verifying token:", token);
    if (!token) {

        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        console.log ("Decoding token...");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure decoded is an object with id property
        if (typeof decoded === 'string' || !decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

