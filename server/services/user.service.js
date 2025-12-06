import { User } from '../models/user.model.js';
import { Follow } from '../models/follow.model.js'; // Import Follow model
import { decodeBase64 } from 'bcryptjs';

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