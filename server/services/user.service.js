import { User } from '../models/user.model.js';
import moongoose from 'mongoose';
import speakingURL from "speakingurl"

// ADMIN FUNCTION
export const getAllUsers = async ({page, limit}) => {
  try {
    const skip = (page - 1) * limit;


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
  // set bannedAt field to current date
  return await User.findByIdAndUpdate(
    userId,
    { bannedAt: new Date() },
    { new: true }
  );
}

export const restoreUser = async (userId) => {
  // set bannedAt field to null
  return await User.findByIdAndUpdate(
    userId,
    { bannedAt: null },
    { new: true }
  );
}

export const isUserNameExist = async (id, username) => {
  const userName = await User.findOne({ _id: id ,
    bannedAt: { $in: [null, undefined] }
  });
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
    return null;
  }


  return userProfile[0]; // Return first result since aggregate returns array
}


export async function updateUserProfile (userId, updateData) {

  const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
  ).select('-password');

  return updatedUser;
}