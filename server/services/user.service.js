import { User } from '../models/user.model.js';
import { Follow } from '../models/follow.model.js'; // Import Follow model
import { decodeBase64 } from 'bcryptjs';
import moongoose from 'mongoose';
import speakingURL from "speakingurl"
export const getAllUsers = async ({page, limit}) => {
  try {
    const skip = (page - 1) * limit;
    // const users = await User.find()
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo, mới nhất trước

    // add following and followers count to profile (join with follows collection)

    const userInfos = await User.aggregate ([
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
        $lookup: {
          from : "follows",
          localField: "_id",
          foreignField: "following",
          as: "followersList"

        } 
      },
      {
        $lookup: {
          from : "follows",
          localField: "_id",
          foreignField: "follower",
          as: "followingList"
      }
      },
      {
        $addFields: {
          'profile.followers': { $size: "$followersList" },
          'profile.following': { $size: "$followingList" },
        }
      },
      {
        $project: {
          followersList: 0,
          followingList: 0
        }
      
      }

    ])
    console.log(userInfos);
    return userInfos;
    

  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

export const getUserById = async (userId) => {
  return await User.findById(userId);
}

export const countUsers = async () => {
  return await User.countDocuments();
}

export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
}

export const isUserNameExist = async (id, username) => {
  const userName = await User.findOne({ _id: id });

  return speakingURL(userName.username) === speakingURL(username);
}

export async function findUserProfile (id, username) {
  let query = {
    _id : new moongoose.Types.ObjectId(id)
  }
  const isExistUserName = await isUserNameExist (id, username);
  if (!isExistUserName) {
    return null;
  }

  console.log("Finding user profile with query:", query);
  const userProfile = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "follows", // Make sure this matches your collection name
          localField: "_id",
          foreignField: "following", // Users who follow THIS user
          as: "followersList"
        }
      },
      {
        $lookup: {
          from: "follows", // Make sure this matches your collection name
          localField: "_id",
          foreignField: "follower", // Users THIS user follows
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
          password: 0,
          followersList: 0,
          followingList: 0
        }
      }
  ]);

  if (!userProfile || userProfile.length === 0) {
    console.log("No user found with query:", query);
    return null;
  }

  console.log("User Profile found:", userProfile[0]);
  return userProfile[0]; // Return first result since aggregate returns array
}