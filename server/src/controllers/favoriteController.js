import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

export const saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: 'Property already saved',
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: propertyId,
    });

    return res.status(201).json({
      message: 'Property saved successfully',
      favorite,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to save property',
      error: error.message,
    });
  }
};

export const getMySavedProperties = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'property',
        select:
          'title description price location propertyType bedrooms bathrooms area images status owner',
        populate: {
          path: 'owner',
          select: 'fullName email',
        },
      });

    return res.status(200).json({
      message: 'Saved properties fetched successfully',
      favorites,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch saved properties',
      error: error.message,
    });
  }
};

export const removeSavedProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: 'Saved property not found',
      });
    }

    await Favorite.findByIdAndDelete(favorite._id);

    return res.status(200).json({
      message: 'Property removed from saved properties',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to remove saved property',
      error: error.message,
    });
  }
};

export const checkSavedProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    return res.status(200).json({
      success: true,
      saved: Boolean(favorite),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to check saved property',
      error: error.message,
    });
  }
};
