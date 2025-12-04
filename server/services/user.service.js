import { User } from '../models/user.model.js';

export const getAllUsers = async () => {
  return await User.find({});
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