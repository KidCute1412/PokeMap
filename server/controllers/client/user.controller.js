import * as userService from "../../services/user.service.js";
import uploadToCloudinary from "../../config/cloudinary.config.js";
import fs from 'fs';
import {User} from "../../models/user.model.js";
import * as authHelper from '../../helpers/auth.helper.js';
export async function getUserProfile (req, res) {
    try{
        const {id, username} = req.query;
        const userProfile = await userService.findUserProfile(id, username);
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: userProfile
        })
    }
    catch (e){
        res.status(500).json({
            success: false,
            message: e.message || "Server error fetching user profile"
        })
    }
}

export async function editUserProfile (req, res) {
    try{
        const userId = req.user.id;
        const updateData = req.body;
        const avatarFile = req.file;

        if (avatarFile) {
            const avatarUploadResult = await uploadToCloudinary(avatarFile.path, 'avatar_user_pokemap');
            updateData['profile.avatar'] = avatarUploadResult.secure_url;
            fs.unlinkSync(avatarFile.path);
            
        }
        const updatedUser = await userService.updateUserProfile(userId, updateData);
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser
        })

    }
    catch (e){
        res.status(500).json({
            success: false,
            message: e.message || "Server error updating user profile"
        })
    }
}

export async function changePassword (req, res) {
    try {   
        const userId =  req.user.id;
        const { currentPassword, newPassword} = req.body;
        // verify current password
        const password = await User.findById(userId).select('password');
        const isMatch = await authHelper.comparePassword(currentPassword, password.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        // update to new password
        const result = await User.findByIdAndUpdate(
            userId,
            { password: await authHelper.hashPassword(newPassword) },
            { new: true }
        ).select('-password');
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: result
        });

    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Server error changing password"
        })
    }
}