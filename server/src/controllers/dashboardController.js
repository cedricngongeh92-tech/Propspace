import Favorite from '../models/Favorite.js';
import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

export const getMyDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalMyProperties,
      availableMyProperties,
      soldMyProperties,
      rentedMyProperties,
      totalInquiriesReceived,
      newInquiriesReceived,
      totalSavedProperties,
    ] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Property.countDocuments({ owner: userId, status: 'available' }),
      Property.countDocuments({ owner: userId, status: 'sold' }),
      Property.countDocuments({ owner: userId, status: 'rented' }),
      Inquiry.countDocuments({ owner: userId }),
      Inquiry.countDocuments({ owner: userId, status: 'new' }),
      Favorite.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalMyProperties,
        availableMyProperties,
        soldMyProperties,
        rentedMyProperties,
        totalInquiriesReceived,
        newInquiriesReceived,
        totalSavedProperties,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalAgents,
      totalNormalUsers,
      totalProperties,
      availableProperties,
      soldProperties,
      rentedProperties,
      totalInquiries,
      newInquiries,
      contactedInquiries,
      closedInquiries,
      totalFavorites,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'agent' }),
      User.countDocuments({ role: 'user' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'sold' }),
      Property.countDocuments({ status: 'rented' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'contacted' }),
      Inquiry.countDocuments({ status: 'closed' }),
      Favorite.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalAgents,
        totalNormalUsers,
        totalProperties,
        availableProperties,
        soldProperties,
        rentedProperties,
        totalInquiries,
        newInquiries,
        contactedInquiries,
        closedInquiries,
        totalFavorites,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch admin dashboard stats',
      error: error.message,
    });
  }
};
