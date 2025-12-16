import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import mongoose from 'mongoose';

export const searchUsers = async (keyword, { page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    
    const searchRegex = new RegExp(keyword, 'i');
    
    const users = await User.aggregate([
        {
            $match: {
                $or: [
                    { username: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ],
                $and: [
                    { $or: [{ bannedAt: null }, { bannedAt: { $exists: false } }] }
                ]
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followersList"
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "followingList"
            }
        },
        {
            $addFields: {
                'profile.followers': { $size: "$followersList" },
                'profile.following': { $size: "$followingList" }
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                description: 1,
                'profile.avatar': 1,
                'profile.followers': 1,
                'profile.following': 1,
                createdAt: 1
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    const total = await User.countDocuments({
        $and: [
            {
                $or: [
                    { username: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            },
            {
                $or: [{ bannedAt: null }, { bannedAt: { $exists: false } }]
            }
        ]
    });

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const searchPosts = async (keyword, { page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    
    const searchRegex = new RegExp(keyword, 'i');
    
    const posts = await Post.aggregate([
        {
            $match: {
                content: { $regex: searchRegex },
                isDeleted: { $ne: true }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $lookup: {
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
                username: { $arrayElemAt: ["$userInfo.username", 0] },
                avatar: { $arrayElemAt: ["$userInfo.profile.avatar", 0] },
                userId: { $arrayElemAt: ["$userInfo._id", 0] },
                commentsCount: { $size: "$comments" },
                likesCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                images: 1,
                username: 1,
                avatar: 1,
                userId: 1,
                commentsCount: 1,
                likesCount: 1,
                createdAt: 1
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    const total = await Post.countDocuments({
        content: { $regex: searchRegex },
        isDeleted: { $ne: true }
    });

    return {
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const searchAll = async (keyword, { userLimit = 5, postLimit = 5 }) => {
    const searchRegex = new RegExp(keyword, 'i');
    
    // Search users
    const users = await User.aggregate([
        {
            $match: {
                $or: [
                    { username: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ],
                $and: [
                    { $or: [{ bannedAt: null }, { bannedAt: { $exists: false } }] }
                ]
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followersList"
            }
        },
        {
            $addFields: {
                'profile.followers': { $size: "$followersList" }
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                description: 1,
                'profile.avatar': 1,
                'profile.followers': 1
            }
        },
        { $limit: userLimit }
    ]);

    // Search posts
    const posts = await Post.aggregate([
        {
            $match: {
                content: { $regex: searchRegex },
                isDeleted: { $ne: true }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo"
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
                username: { $arrayElemAt: ["$userInfo.username", 0] },
                avatar: { $arrayElemAt: ["$userInfo.profile.avatar", 0] },
                userId: { $arrayElemAt: ["$userInfo._id", 0] },
                likesCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                images: 1,
                username: 1,
                avatar: 1,
                userId: 1,
                likesCount: 1,
                createdAt: 1
            }
        },
        { $limit: postLimit }
    ]);

    const totalUsers = await User.countDocuments({
        $and: [
            {
                $or: [
                    { username: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            },
            {
                $or: [{ bannedAt: null }, { bannedAt: { $exists: false } }]
            }
        ]
    });

    const totalPosts = await Post.countDocuments({
        content: { $regex: searchRegex },
        isDeleted: { $ne: true }
    });

    return {
        users,
        posts,
        totalUsers,
        totalPosts
    };
};
