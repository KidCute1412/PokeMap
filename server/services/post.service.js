import { Post } from '../models/post.model.js'
import { PostWarning } from '../models/postModeration.model.js'
import {User} from '../models/user.model.js';
import sendEmail from '../config/email.config.js';
export const getAllPosts = async ({page, limit}) => {
    const skip = (page - 1) * limit;

    const PostData = await Post.aggregate([
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $match: { isDeleted: { $ne: true } }
        }
        ,
        {
            $lookup: {
                from : "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $lookup: {
                from: "post_warnings",
                localField: "_id",
                foreignField: "post",
                as: "warnings"
            }
        },
        {
            $lookup:{
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"

            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields: {
                username : { $arrayElemAt: [ "$userInfo.username", 0 ] },
                avatar : { $arrayElemAt: [ "$userInfo.profile.avatar", 0 ] },
                warning_counts : {$arrayElemAt : ["$warnings.warningCount", 0]},
                comments: { $size: "$comments" },
                likes: { $size: "$likes" }

            }
        },
        {
            $project: {
                userInfo: 0,
                warnings: 0,
            }
        }
    ])
    console.log(PostData);
    return PostData;
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


    // THIS IS A MOCKED USER ID FOR TESTING PURPOSES
    const mockwarnedBy = "6932dbfa4359cbdf3b5f0405";
    warnedBy = mockwarnedBy; // Temporary hardcoded user ID for testing
    if (!post) {
        throw new Error('Post not found');
    }
    console.log("Post found:", postId);
    // Check existing warnings for this post
    const existingWarning = await PostWarning.findOne({ post: postId, isResolved: false });
    console.log("Existing warning:", existingWarning);
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
        console.log("Creating new warning:", warning);
        warning = await warning.save();
        console.log("New warning saved:", warning);
    }
  
    // Update post
    post.isWarned = true;
    const author = await Post.findById(postId).populate('user');

    // @ts-ignore
    if (author.user && author.user.email) {
        // @ts-ignore
        console.log("Sending email to: ", author.user.email);
        sendEmail(
        // @ts-ignore
        author.user.email,
        'Your post has been warned',
        `Your post with ID ${postId} has received a warning for the following reason: ${warningType}. Description: ${description}. This is warning ${warningCount} out of 3.`
        );
    }
    

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

export const findAuthorByPostId = async (postId) => {
    const post =  await Post.findById(postId).populate('user');
    return post.user;
}


export const deletePost = async (postId) => {
    return await Post.findByIdAndUpdate(postId, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });
}