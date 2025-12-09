import * as postService from '../../services/post.service.js';

export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const numberOfPosts = await postService.countPosts();
        const totalPages = Math.ceil(numberOfPosts / limit);
        const posts = await postService.getAllPosts({page: page, limit: limit});
        res.json({
            success: true,
            message: 'Posts retrieved successfully',
            data: posts,
            numberOfPages: totalPages
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'An error occurred while retrieving posts',
            error: error.message    
        });
    }
}

export const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await postService.getPostById(postId);
        if (post) {
            res.json({
                success: true,
                message: 'Post retrieved successfully',
                data: post
            });
        } else {
            res.json({
                success: false,
                message: 'Post not found'
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: 'An error occurred while retrieving the post',
            error: error.message
        });
    }
}

export const getTotalPages = async (req, res) => {
    try {
        const totalPages = await postService.countPosts();
        res.json({
            success: true,
            message: 'Total pages retrieved successfully',
            data: { totalPages }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'An error occurred while retrieving the total pages',
            error: error.message
        });
    }
}   

export const warnPost = async (req, res) => {   
    const { postId } = req.params;
    console.log("Warning post ID:", postId);
    const { warningType, description, warnedBy } = req.body;
    
    try {
        // Validate required fields
        if (!warningType) {
            return res.status(400).json({
                success: false,
                message: 'warningType and warnedBy are required'
            });
        }

        const post = await postService.warnPost(postId, warningType, description, warnedBy);
        res.json({
            success: true,
            message: post.message,
            data: post.data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'An error occurred while warning the post',
            error: error.message
        });
    }
}

export const deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await postService.deletePost(postId);
        if (post) {
            res.json({
                success: true,
                message: 'Post deleted successfully',
                data: post
            });
        } else {
            res.json({
                success: false,
                message: 'Post not found'
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'An error occurred while deleting the post',
            error: error.message
        });
    }
}