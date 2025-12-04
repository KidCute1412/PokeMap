import { Post } from '../models/post.model.js'
import { PostWarning } from '../models/postModeration.model.js'

export const getAllPosts = async () => {
    return await Post.find({});
}

export const getPostById = async (postId) => {
    return await Post.findById(postId);
}

export const countPosts = async () => {
    return await Post.countDocuments();
}

export const warnPost = async (postId, warningType, description, warnedBy) => {
    // Find the post
    const post = await Post.findById(postId);
    
    if (!post) {
        throw new Error('Post not found');
    }

    // Check existing warnings for this post
    const existingWarning = await PostWarning.findOne({ post: postId, isResolved: false });

    let warningCount = 1;
    let warning;

    if (existingWarning) {
        // Update existing warning
        existingWarning.warningCount += 1;
        warningCount = existingWarning.warningCount;
        warning = await existingWarning.save();
    } else {
        // Create new warning
        warning = new PostWarning({
            post: postId,
            warningType,
            description,
            warnedBy,
            warningCount: 1
        });
        warning = await warning.save();
    }

    // Update post
    post.isWarned = true;

    // If warnCount reaches 3, delete the post
    if (warningCount >= 3) {
        post.isDeleted = true;
        post.deletedAt = new Date();
        
        warning.isResolved = true;
        warning.resolvedAt = new Date();
        await warning.save();
        
        await post.save();
        return {
            message: 'Post has been warned 3 times and deleted',
            data: { post, warning }
        };
    }

    // Save the updated post
    await post.save();

    return {
        message: `Post warned successfully. Warning count: ${warningCount}/3`,
        data: { post, warning }
    };
};

export const deletePost = async (postId) => {
    return await Post.findByIdAndUpdate(postId, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });
}