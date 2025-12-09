import * as userService from "../../services/user.service.js";
import uploadToCloudinary from "../../config/cloudinary.config.js";
import fs from 'fs';
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