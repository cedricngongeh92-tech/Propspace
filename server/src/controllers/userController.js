import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const validRoles = ['user', 'admin', 'agent'];

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, profileImage } = req.body;

    const updateData = {};

    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        message: 'Old password is incorrect',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Role must be one of: user, admin, agent',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};
