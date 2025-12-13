import { Post } from '../models/post.model.js'
import {Like} from '../models/like.model.js'
import {Follow} from '../models/follow.model.js'
import { PostWarning } from '../models/postModeration.model.js'
import {User} from '../models/user.model.js';
import sendEmail from '../config/email.config.js';
import mongoose from 'mongoose';
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


export const createPost = async ({content, images, user}) => {
    const newPost = await Post.create({
        content,
        images,
        user
    });
    return newPost; 
}
export const editPost = async ({postId, content, images}) => {
    return await Post.findByIdAndUpdate(postId, {
        content: content,
        images: images
    }, { new: true });
}

export const getPostsInHome = async ({viewer, limit, exclude_ids}) => {

    
    
    console.log ("Viewer in home: ", viewer);
    const userPosts = await Post.aggregate([
        {
            $match: {isDeleted: { $ne: true } }
        },
        {
            $match: { _id: { $nin: exclude_ids.map(id => new mongoose.Types.ObjectId(id)) }}
        },
        {
            $sample: { size: limit }
        },
        {
            $lookup : {
                from : "users",
                localField : "user",
                foreignField : "_id",
                as : "userInfo"
            }
        },
        {
            $lookup : {
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
            // is Liked by viewer
        {
            $lookup : {
                from : "likes",
                let : {postId : "$_id"},
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $and : [
                                    {$eq : ["$post", "$$postId"]},
                                    {$eq : ["$user", viewer ? new mongoose.Types.ObjectId(viewer._id) : null]}
                                ]
                            }
                        }
                    }
                ],
                as : "isLikedByViewer"
            }
        }
        ,
        {
            $lookup : {
                from : "follows",
                let : {postUserId : "$user"},
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $and : [
                                    {$eq : ["$follower", viewer ? new mongoose.Types.ObjectId(viewer._id) : null]},
                                    {$eq : ["$following", "$$postUserId"]}
                                ]
                            }
                        }
                    }
                ],
                as : "followInfo"    
            }
        }
        ,
        {
            $addFields: {
                'comments': { $size: "$comments" },
                'likes': { $size: "$likes" },
                'username' : { $arrayElemAt: [ "$userInfo.username", 0 ] },
                'avatar' : { $arrayElemAt: [ "$userInfo.profile.avatar", 0 ] },
                'isFollowing' : { $gt : [ {$size : "$followInfo"}, 0 ] },
                'isLiked' : { $gt : [ {$size : "$isLikedByViewer"}, 0 ] },
                'owner_id' : { $arrayElemAt: [ "$userInfo._id", 0 ] }
            }
        },
        {
            $project: {
                userInfo: 0,
                followInfo: 0,
                isLikedByViewer: 0
            }
        }
    ])

    console.log("getUserPosts result:", userPosts.length, "posts found");
    return userPosts;
}

export const getUserPosts = async ({userId, viewer}) => {
    
    console.log("getUserPosts called with userId:", userId, "type:", typeof userId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("Converted to ObjectId:", userObjectId);
    
    const userPosts = await Post.aggregate([
        {
            $match: { user:  userObjectId, isDeleted: { $ne: true } }
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $lookup : {
                from : "users",
                localField : "user",
                foreignField : "_id",
                as : "userInfo"
            }
        },
        {
            $lookup : {
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
            // is Liked by viewer
        {
            $lookup : {
                from : "likes",
                let : {postId : "$_id"},
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $and : [
                                    {$eq : ["$post", "$$postId"]},
                                    {$eq : ["$user", viewer ? new mongoose.Types.ObjectId(viewer._id) : null]}
                                ]
                            }
                        }
                    }
                ],
                as : "isLikedByViewer"
            }
        }
        ,
        {
            $lookup : {
                from : "follows",
                let : {postUserId : "$user"},
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $and : [
                                    {$eq : ["$follower", viewer ? new mongoose.Types.ObjectId(viewer._id) : null]},
                                    {$eq : ["$following", "$$postUserId"]}
                                ]
                            }
                        }
                    }
                ],
                as : "followInfo"    
            }
        }
        ,
        {
            $addFields: {
                'comments': { $size: "$comments" },
                'likes': { $size: "$likes" },
                'username' : { $arrayElemAt: [ "$userInfo.username", 0 ] },
                'avatar' : { $arrayElemAt: [ "$userInfo.profile.avatar", 0 ] },
                'isFollowing' : { $gt : [ {$size : "$followInfo"}, 0 ] },
                'isLiked' : { $gt : [ {$size : "$isLikedByViewer"}, 0 ] },
                'owner_id' : { $arrayElemAt: [ "$userInfo._id", 0 ] }
            }
        },
        {
            $project: {
                userInfo: 0,
                followInfo: 0,
                isLikedByViewer: 0
            }
        }
    ])

    console.log("getUserPosts result:", userPosts.length, "posts found");
    return userPosts;
}



export const likePost = async ({postId, user}) => {
    const existingLike = await Like.findOne({post: postId, user: user._id});
    if (existingLike) {
        // Unlike
        await Like.deleteOne({ _id: existingLike._id });
        return { message: "Post unliked" };
    } else {
        // Like
        const newLike = new Like({
            post: postId,
            user: user._id
        });
        await newLike.save();
        return { message: "Post liked" };
    }
}

export const followUserFromPost = async ({postId, userId}) => {
    // is UserId owner of the post
    const post = await Post.findById(postId);
    if (!post) {
        return { status : "false",message: 'Post not found' };
    }
    const postOwnerId = post.user.toString();

    if (postOwnerId == userId) {
        return {status : "false", message: "Cannot follow yourself" };
    }

    const existingFollow = await Follow.findOne({follower: userId, following: postOwnerId});
    if (existingFollow) {
        // Unfollow
        await Follow.deleteOne({ _id: existingFollow._id });
        return { message: "User unfollowed" };
    }
    else {
        // Follow
        const newFollow = new Follow({
            follower: userId,
            following: postOwnerId
        });
        await newFollow.save();
        return { message: "User followed" };
    }

}
