import * as userService from '../../services/user.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}

export const getUserById = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.json({
            success: false,
            message: 'User ID is required',
        });
    }

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}

export const getTotalUserPages = async (req, res) => {
    try {
        const totalUsers = await userService.countUsers();
        const usersPerPage =  5; // 1 page shows 5 users 
        const totalPages = Math.ceil(totalUsers / usersPerPage);
        res.json({
            success: true,
            message: 'Total user pages retrieved successfully',
            data: { totalPages },
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.json({
            success: false,
            message: 'User ID is required',
        });
    }

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            });
        }
        
        await userService.deleteUser(userId);
        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}