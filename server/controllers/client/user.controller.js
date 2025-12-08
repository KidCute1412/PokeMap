import * as userService from "../../services/user.service.js";
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