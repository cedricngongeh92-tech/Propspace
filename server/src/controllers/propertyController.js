import Property from '../models/Property.js';

const canManageProperty = (user, property) => {
  return user.role === 'admin' || property.owner.toString() === user.id;
};

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id,
    });

    return res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create property',
      error: error.message,
    });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const {
      search,
      propertyType,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (status) {
      query.status = status;
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .populate('owner', 'fullName email');

    return res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageLimit),
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch properties',
      error: error.message,
    });
  }
};

export const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'fullName email');

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      });
    }

    return res.status(200).json({
      message: 'Property fetched successfully',
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch property',
      error: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      });
    }

    if (!canManageProperty(req.user, property)) {
      return res.status(403).json({
        message: 'You are not allowed to update this property',
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update property',
      error: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      });
    }

    if (!canManageProperty(req.user, property)) {
      return res.status(403).json({
        message: 'You are not allowed to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete property',
      error: error.message,
    });
  }
};
